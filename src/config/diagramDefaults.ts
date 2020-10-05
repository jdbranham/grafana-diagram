import { LegendDisplayMode } from '@grafana/ui';
import mermaidAPI from 'mermaid/mermaidAPI';
import { MermaidThemeVariables } from 'config/theme';
import { DiagramOptions, LegendOptions } from 'config/types';

export const defaultFlowChartConfig: mermaidAPI.FlowChartConfig & { useMaxWidth: boolean } = {
  curve: 'linear',
  htmlLabels: true,
  useMaxWidth: true,
};

export const defaultMermaidOptions: mermaidAPI.Config = {
  securityLevel: 'loose',
  logLevel: 3, //1:debug, 2:info, 3:warn, 4:error, 5:fatal
  //cloneCssStyles: true, // - This options controls whether or not the css rules should be copied into the generated svg
  startOnLoad: false, // - This options controls whether or mermaid starts when the page loads
  arrowMarkerAbsolute: true, // - This options controls whether or arrow markers in html code will be absolute paths or an anchor, #. This matters if you are using base tag settings.
  flowchart: defaultFlowChartConfig,
  sequence: {
    diagramMarginX: 50, // - margin to the right and left of the sequence diagram
    diagramMarginY: 10, // - margin to the over and under the sequence diagram
    actorMargin: 50, // - Margin between actors
    width: 150, // - Width of actor boxes
    height: 65, // - Height of actor boxes00000000001111
    boxMargin: 10, // - Margin around l01oop boxes
    boxTextMargin: 5, // - margin around the text in loop/alt/opt boxes
    noteMargin: 10, // - margin around notes
    messageMargin: 35, // - Space between messages
    mirrorActors: true, // - mirror actors under diagram
    bottomMarginAdj: 1, // - Depending on css styling this might need adjustment. Prolongs the edge of the diagram downwards
    useMaxWidth: true, // - when this flag is set the height and width is set to 100% and is then scaling with the available space if not the absolute space required is used
  },
  gantt: {
    titleTopMargin: 25, // - margin top for the text over the gantt diagram
    barHeight: 20, // - the height of the bars in the graph
    barGap: 4, // - the margin between the different activities in the gantt diagram
    topPadding: 50, // - margin between title and gantt diagram and between axis and gantt diagram.
    leftPadding: 75, // - the space allocated for the section name to the left of the activities.
    gridLineStartPadding: 35, // - Vertical starting position of the grid lines
    fontSize: 11, // - font size ...
    fontFamily: '"Open-Sans", "sans-serif"', // - font family ...
    numberSectionStyles: 3, // - the number of alternating section styles
  },
};

export const defaultLegendOptions: LegendOptions = {
  show: true,
  stats: ['mean', 'last', 'min', 'max', 'sum'],
  asTable: true,
  hideEmpty: false,
  hideZero: false,
  placement: 'under',
  displayMode: LegendDisplayMode.Table,
  sortBy: 'last',
  sortDesc: true,
  gradient: {
    enabled: true,
    show: true,
  },
};

export const defaultMermaidThemeVariables: MermaidThemeVariables = {
  common: {
    fontFamily: 'Roboto,Helvetica Neue,Arial,sans-serif',
  },
  classDiagram: {},
  flowChart: {},
  sequenceDiagram: {},
  stateDiagram: {},
  userJourneyDiagram: {},
};

export const defaults: DiagramOptions = {
  pluginVersion: '',
  anonymousTracking: true,
  nodeSize: { minWidth: 30, minHeight: 40 },
  composites: [],
  metricCharacterReplacements: [],
  style: '',
  legend: defaultLegendOptions,
  maxWidth: true,
  moddedSeriesVal: 0,
  valueName: 'last',
  content: `graph LR
      A --> B
    `,
  mode: 'content', //allowed values: 'content' and 'url'
  mermaidServiceUrl: '',
  useBasicAuth: false,
  authUsername: '',
  authPassword: '',
  mermaidThemeVariablesDark: defaultMermaidThemeVariables,
  mermaidThemeVariablesLight: defaultMermaidThemeVariables,
  useBackground: false,
};
