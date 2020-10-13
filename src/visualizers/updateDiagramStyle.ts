import { DisplayValue, formattedValueToString, LinkModel } from '@grafana/data';
import { select, Selection } from 'd3';
import { diagramStyleFormatter } from 'diagramStyleFormatter';
import { CompositeMetric, DiagramOptions, DiagramSeriesModel, NodeSizeOptions } from '../config/types';

type MetricIndicator = DisplayValue & {
  metricName: string;
  valueName: string;
  isComposite?: boolean;
  originalName?: string;
  links?: LinkModel[];
};

const selectElementById = (container: HTMLElement, id: string): Selection<any, any, any, any> => {
  return select(container.querySelector('#' + id));
};

const selectElementByEdgeLabel = (container: HTMLElement, id: string): Selection<any, any, any, any> => {
  return select(container)
    .selectAll('span')
    .filter(function() {
      return select(this).text() === id;
    });
};

const selectDivElementByAlias = (container: HTMLElement, alias: string): Selection<any, any, any, any> => {
  const targetElement = select(container)
    .selectAll('div')
    .filter(function() {
      return select(this).text() === alias;
    });
  const node = targetElement.node();
  if (node != null) {
    const parentShape = (node as HTMLElement).closest('.node');
    if (parentShape != null) {
      return select(parentShape);
    }
  }
  return select(null);
};

const selectTextElementByAlias = (container: HTMLElement, alias: string): Selection<any, any, any, any> => {
  return select(container)
    .selectAll('text')
    .filter(function() {
      return select(this).text() === alias;
    });
};

const resizeGrouping = (element: Selection<any, any, any, any> | null | undefined, nodeSize: NodeSizeOptions) => {
  if (!element) {
    return;
  }
  const closestGroup: HTMLElement = element.node().closest('g');
  const closestLabelGroup: HTMLElement = element.node().closest('g.label');
  const closestForeignObject: HTMLElement = element.node().closest('foreignObject');

  if (closestGroup && closestLabelGroup && closestForeignObject) {
    closestGroup.setAttribute('transform', '');
    const _minWidth = Math.max(
      Number.parseInt(closestForeignObject.getAttribute('width') || '1', 10),
      nodeSize.minWidth
    );
    const _minHeight = Math.max(
      Number.parseInt(closestForeignObject.getAttribute('height') || '1', 10),
      nodeSize.minHeight
    );
    closestForeignObject.setAttribute('height', _minHeight.toString());
    closestForeignObject.setAttribute('width', _minWidth.toString());
    closestLabelGroup.setAttribute('transform', `translate(-${_minWidth / 2},-${_minHeight / 2})`);
  }
};

const styleD3Shapes = (
  targetElement: Selection<any, any, any, any>,
  indicator: MetricIndicator,
  useBackground: boolean,
  nodeSize: NodeSizeOptions
) => {
  const shapes = targetElement.selectAll('rect,circle,polygon,path');
  const div = targetElement.select('div');
  div.classed('diagram-value', true);
  if (div.node()) {
    const divElement = div.node() as HTMLElement;
    resizeGrouping(div, nodeSize);
    let content = divElement.innerText + `<br/> ${formattedValueToString(indicator)}`;
    if (indicator.isComposite) {
      content += `<br/>${indicator.originalName}`;
      divElement.style.marginTop = `-${nodeSize.minHeight / 4}px`;
    }
    // TODO: Add Field/Series Links??
    divElement.innerHTML = `<div style="margin:auto">${content}</div>`;
  }
  if (indicator.color) {
    if (useBackground) {
      shapes.style('fill', indicator.color);
    } else {
      div.style('color', indicator.color);
    }
  }
};

const styleFlowChartEdgeLabel = (
  targetElement: Selection<any, any, any, any>,
  indicator: MetricIndicator,
  useBackground: boolean,
  nodeSize: NodeSizeOptions
) => {
  const edgeParent = select(targetElement.node().parentNode);
  edgeParent.append('br');
  const v = edgeParent.append('span');
  v.classed('diagram-value', true);
  v.html(formattedValueToString(indicator));
  resizeGrouping(edgeParent, nodeSize);
  if (indicator.color) {
    if (useBackground) {
      v.style('background-color', indicator.color);
    } else {
      v.style('color', indicator.color);
    }
  }
};

const styleTextEdgeLabel = (
  targetElement: Selection<any, any, any, any>,
  indicator: MetricIndicator,
  useBackground: boolean
) => {
  targetElement.each(el => {
    var markerBox = {
      x: el.getBBox().x,
      y: el.getBBox().y + el.getBBox().height + 10,
      width: el.getBBox().width,
      height: el.getBBox().height,
    };
    if (indicator.color) {
      const rect = select(el.parentNode)
        .insert('rect')
        .attr('x', markerBox.x)
        .attr('y', markerBox.y)
        .attr('width', markerBox.width)
        .attr('height', markerBox.height);
      const textNode = select(el.parentNode)
        .insert('text')
        .text(formattedValueToString(indicator))
        .attr('x', markerBox.x + markerBox.width / 2)
        .attr('y', markerBox.y + markerBox.height - 1)
        .attr('width', markerBox.width)
        .attr('height', markerBox.height)
        .style('text-anchor', 'middle');
      if (indicator.color) {
        if (useBackground) {
          rect.style('fill', indicator.color);
        } else {
          textNode.style('color', indicator.color);
        }
      }
    }
  });
};

const injectCustomStyle = (container: HTMLElement, diagramStyle: string, diagramId: string) => {
  const diagramDiv = select(container);
  const diagramStyleElement = diagramDiv.append('style');
  diagramStyleElement.text(diagramStyleFormatter(diagramStyle, diagramId));
};

const processDiagramSeriesModel = (container: HTMLElement, indicator: MetricIndicator, options: DiagramOptions) => {
  const key = indicator.metricName;

  // Find nodes by ID if we can
  let targetElement = selectElementById(container, key);
  if (!targetElement.empty()) {
    styleD3Shapes(targetElement, indicator, options.useBackground, options.nodeSize);
    return;
  }

  targetElement = selectElementByEdgeLabel(container, key);
  if (!targetElement.empty()) {
    styleFlowChartEdgeLabel(targetElement, indicator, options.useBackground, options.nodeSize);
    return;
  }

  targetElement = selectDivElementByAlias(container, key);
  if (!targetElement.empty()) {
    styleD3Shapes(targetElement, indicator, options.useBackground, options.nodeSize);
    return;
  }

  targetElement = selectTextElementByAlias(container, key);
  if (!targetElement.empty()) {
    styleTextEdgeLabel(targetElement, indicator, options.useBackground);
    return;
  }

  console.log('could not find a diagram node with id/text: ' + key);
};

const reduceComposites = (indicators: MetricIndicator[], composites: CompositeMetric[]): MetricIndicator[] => {
  return composites
    .map(c => {
      const candidates = c.members.flatMap(m => {
        return indicators.filter(i => i.metricName === m);
      });
      if (candidates.length > 0) {
        const compositeIndicator = candidates.reduce((prev, current) => {
          const previousValue = isNaN(prev.numeric) ? 0 : prev.numeric;
          const currentValue = isNaN(current.numeric) ? 0 : current.numeric;
          const currentIsLower = currentValue < previousValue;
          if (c.showLowestValue) {
            return currentIsLower ? current : prev;
          } else {
            return currentIsLower ? prev : current;
          }
        });
        compositeIndicator.isComposite = true;
        compositeIndicator.originalName = compositeIndicator.metricName;
        compositeIndicator.metricName = c.name;
        return compositeIndicator;
      } else {
        return null;
      }
    })
    .filter(c => c != null) as any;
};

const reduceModels = (models: DiagramSeriesModel[]): MetricIndicator[] => {
  return models
    .filter(m => m.valueField.config.custom)
    .flatMap(m => {
      const dv = m.info?.find(dv => dv.title === m.valueField.config.custom.valueName);
      if (!dv) {
        return null;
      }
      return {
        ...dv,
        metricName: m.label,
        valueName: dv.title,
      };
    })
    .filter(m => m != null) as any;
};

export const updateDiagramStyle = (
  el: HTMLElement,
  models: DiagramSeriesModel[],
  options: DiagramOptions,
  diagramId: string
) => {
  const indicators: MetricIndicator[] = reduceModels(models);

  const svgSelection = select(el).select('svg');
  const svgNode = svgSelection.node();
  if (svgNode == null) {
    return;
  }

  const svg = svgNode as HTMLElement;
  if (options.maxWidth) {
    select(svg)
      .style('max-width', '100%')
      .style('max-height', '100%');
  }

  indicators.forEach(indicator => {
    processDiagramSeriesModel(svg, indicator, options);
  });
  reduceComposites(indicators, options.composites).forEach(indicator => {
    processDiagramSeriesModel(svg, indicator, options);
  });

  injectCustomStyle(el, options.style, diagramId);
};
