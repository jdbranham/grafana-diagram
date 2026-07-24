import { AbsoluteTimeRange, FieldConfigSource, GrafanaTheme2, InterpolateFunction, TimeZone } from '@grafana/data';
import { CustomScrollbar, VizLegendItem, stylesFactory, VizLegend } from '@grafana/ui';
import { defaultMermaidOptions } from 'config/diagramDefaults';
import DiagramErrorBoundary from 'DiagramErrorBoundary';
import { css, cx } from '@emotion/css';
import { merge } from 'lodash';
import mermaid from 'mermaid';
import React from 'react';
import { updateDiagramStyle } from 'visualizers/updateDiagramStyle';
import { DiagramOptions, DiagramSeriesModel, DiagramSeriesValue } from './config/types';

const mermaidAPI = mermaid.mermaidAPI;

export interface DiagramPanelControllerProps {
  theme: GrafanaTheme2;
  id: number;
  width: number;
  height: number;
  options: DiagramOptions;
  fieldConfig: FieldConfigSource;
  data: DiagramSeriesModel[];
  timeZone: TimeZone;
  replaceVariables: InterpolateFunction;
  onOptionsChange: (options: DiagramOptions) => void;
  onChangeTimeRange: (timeRange: AbsoluteTimeRange) => void;
}

interface DiagramPanelControllerState {
  diagramContainer?: string;
  wrapper?: string;
  legendContainer?: string;
}

const getDiagramWithLegendStyles = stylesFactory(({ options }: DiagramPanelControllerProps) => ({
  wrapper: css`
    display: flex;
    flex-direction: ${options.legend.placement === 'bottom' ? 'column' : 'row'};
    height: 100%;
  `,
  diagramContainer: css`
    min-height: 65%;
    flex-grow: 1;
  `,
  legendContainer: css`
    padding: 10px 0;
    max-height: ${options.legend.placement === 'bottom' ? '35%' : 'none'};
  `,
}));

export class DiagramPanelController extends React.Component<DiagramPanelControllerProps, DiagramPanelControllerState> {
  diagramRef!: HTMLDivElement;
  bindFunctions?: Function;
  renderToken = 0;

  constructor(props: DiagramPanelControllerProps) {
    super(props);
    this.onToggleSort = this.onToggleSort.bind(this);
    this.setDiagramRef = this.setDiagramRef.bind(this);
    this.renderCallback = this.renderCallback.bind(this);
  }

  setDiagramRef(element: HTMLDivElement) {
    this.diagramRef = element;
  }

  componentDidMount() {
    this.initializeMermaid();
  }

  componentDidUpdate(prevProps: DiagramPanelControllerProps) {
    if (
      prevProps.options !== this.props.options ||
      prevProps.fieldConfig !== this.props.fieldConfig ||
      prevProps.theme !== this.props.theme ||
      prevProps.data !== this.props.data
    ) {
      this.initializeMermaid();
    }
  }

  contentProcessor(content: string): string {
    const baseTheme = this.props.theme.isDark ? 'dark' : 'base';
    // check if the diagram definition already contains an init block
    const match = content.match('%%{.*}%%');
    // if it does, just return the original content
    if (match && match.length > 0) {
      return content;
    } else {
      // otherwise inject the variables from the options
      let overrides;
      if (this.props.theme.isDark) {
        overrides = {
          ...this.props.options.mermaidThemeVariablesDark.common,
          ...this.props.options.mermaidThemeVariablesDark.classDiagram,
          ...this.props.options.mermaidThemeVariablesDark.flowChart,
          ...this.props.options.mermaidThemeVariablesDark.sequenceDiagram,
          ...this.props.options.mermaidThemeVariablesDark.stateDiagram,
          ...this.props.options.mermaidThemeVariablesDark.userJourneyDiagram,
        };
      } else {
        overrides = {
          ...this.props.options.mermaidThemeVariablesLight.common,
          ...this.props.options.mermaidThemeVariablesLight.classDiagram,
          ...this.props.options.mermaidThemeVariablesLight.flowChart,
          ...this.props.options.mermaidThemeVariablesLight.sequenceDiagram,
          ...this.props.options.mermaidThemeVariablesLight.stateDiagram,
          ...this.props.options.mermaidThemeVariablesLight.userJourneyDiagram,
        };
      }

      const customTheme = `%%{init: {'theme': '${baseTheme}', 'themeVariables': ${JSON.stringify(overrides)}}}%%\n`;
      return customTheme + content;
    }
  }

  async getRemoteDiagramDefinition(url: string) {
    const response = await fetch(this.props.replaceVariables(url));
    return await response.text();
  }

  loadDiagramDefinition() {
    if (this.props.options.contentUrl) {
      return this.getRemoteDiagramDefinition(this.props.options.contentUrl);
    } else {
      return Promise.resolve(this.props.options.content);
    }
  }

  async initializeMermaid() {
    const options = merge({}, defaultMermaidOptions, { theme: this.props.theme.isDark ? 'dark' : 'base' });
    mermaid.initialize(options);
  
    if (this.diagramRef) {
      const token = ++this.renderToken;
      const diagramDefinition = await this.loadDiagramDefinition();
      if (token !== this.renderToken) {
        return;
      }
      try {
        const diagramId = `diagram-${this.props.id}-${token}`;
        const interpolated = this.props.replaceVariables(this.contentProcessor(diagramDefinition));
  
        const rendered = await mermaidAPI
          .render(diagramId, interpolated)
          .catch(() => mermaidAPI.render(diagramId, diagramDefinition));
        if (token !== this.renderToken) {
          return;
        }
        this.diagramRef.innerHTML = rendered.svg;
        if (rendered.bindFunctions) {
          rendered.bindFunctions(this.diagramRef);
        }
        updateDiagramStyle(this.diagramRef, this.props.data, this.props.options, diagramId);
      } catch (err) {
        this.diagramRef.innerHTML = `<div><p>Error rendering diagram. Check the diagram definition</p><p>${err}</p></div>`;
      }
    }
  }

  onToggleSort(sortBy: string) {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      legend: {
        ...options.legend,
        sortBy,
        sortDesc: sortBy === options.legend.sortBy ? !options.legend.sortDesc : false,
      },
    });
  }

  renderCallback(svgCode: string, bindFunctions: any) {
    if (this && bindFunctions) {
      //console.log('binding diagram functions');
      this.bindFunctions = bindFunctions;
    }
  }

  legendStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  };

  shouldHideLegendItem = (data: DiagramSeriesValue[][], hideEmpty = false, hideZero = false) => {
    const isZeroOnlySeries = data.reduce((acc, current) => acc + (current[1] || 0), 0) === 0;
    const isNullOnlySeries = !data.reduce((acc, current) => acc && current[1] !== null, true);

    return (hideEmpty && isNullOnlySeries) || (hideZero && isZeroOnlySeries);
  };

  getLegendItems = () => {
    const { stats } = this.props.options.legend;
    return this.props.data.reduce<VizLegendItem[]>((acc, s) => {
      return this.shouldHideLegendItem(s.data, this.props.options.legend.hideEmpty, this.props.options.legend.hideZero)
        ? acc
        : acc.concat([
            {
              label: s.label,
              color: '',
              disabled: !s.isVisible,
              yAxis: 0,
              getDisplayValues: () => {
                const info = s.info || [];
                return stats && stats.length > 0 ? info.filter((dv) => stats.includes(dv.title as string)) : info;
              },
            },
          ]);
    }, []);
  };

  render() {
    const { diagramContainer, wrapper, legendContainer } = getDiagramWithLegendStyles(this.props);
    return (
      <div className={cx('diagram-container', `diagram-container-${this.props.id}`, wrapper)}>
        <div
          ref={this.setDiagramRef}
          className={cx('diagram', `diagram-${this.props.id}`, diagramContainer)}
        ></div>
        {this.props.options.legend.show && (
          <div className={legendContainer}>
            <CustomScrollbar hideHorizontalTrack>
              <DiagramErrorBoundary fallback="Error rendering Legend">
                <VizLegend
                  items={this.getLegendItems()}
                  displayMode={this.props.options.legend.displayMode}
                  placement={this.props.options.legend.placement}
                  sortBy={this.props.options.legend.sortBy}
                  sortDesc={this.props.options.legend.sortDesc}
                  // Newer Grafana (verified 13.1.0) renders the table-legend header row
                  // `sr-only` (visually hidden) unless the legend is marked sortable; it
                  // showed unconditionally on 12.3.1. `isSortable` postdates the pinned
                  // @grafana/ui@9 types but is honored by the host Grafana's VizLegend at
                  // runtime (sorting is already wired up via onToggleSort below).
                  // @ts-expect-error isSortable is provided by the runtime @grafana/ui
                  isSortable
                  onLabelClick={(item, event) => {}}
                  onToggleSort={this.onToggleSort}
                />
              </DiagramErrorBoundary>
            </CustomScrollbar>
          </div>
        )}
      </div>
    );
  }
}
