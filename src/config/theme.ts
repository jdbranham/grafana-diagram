/**
 * For more information - https://mermaid-js.github.io/mermaid/getting-started/theming.html
 */

/** [Default] [Calculated/based-on] [Description] */

export interface MermaidThemeVariablesCommon {
  /** default:	false	 	Boolean Value that dictates how to calculate colors. “true” will activate darkmode. */
  darkMode?: boolean;
  /** default:	#f4f4f4	 	Used to calculate color for items that should either be background colored or contrasting to the background. */
  background?: string;
  /** default:	#fff4dd	 	Color to be used as background in nodes, other colors will be derived from this */
  primaryColor?: string;
  /** default:	“trebuchet ms”, verdana, arial	 	  */
  fontFamily?: string;
  /** default:	16px	 	Font Size, in pixels */
  fontSize?: string;
  /** default:	based on primaryColor	*	  */
  secondaryColor?: string;
  /** default:	based on primaryColor	*	  */
  tertiaryColor?: string;
  /** default:	based on primaryColor	*	Color to be used as border in nodes using primaryColor */
  primaryBorderColor?: string;
  /** default:	based on darkMode #ddd/#333	*	Color to be used as text color in nodesusing primaryColor */
  primaryTextColor?: string;
  /** default:	based on secondaryColor	*	Color to be used as border in nodes using secondaryColor */
  secondaryBorderColor?: string;
  /** default:	based on secondaryColor	*	Color to be used as text color in nodesusing secondaryColor */
  secondaryTextColor?: string;
  /** default:	based on tertiaryColor	*	Color to be used as border in nodes using tertiaryColor */
  tertiaryBorderColor?: string;
  /** default:	based on tertiaryColor	*	Color to be used as text color in nodesusing tertiaryColor */
  tertiaryTextColor?: string;
  /** default:	#fff5ad	 	Color used as background in notes */
  noteBkgColor?: string;
  /** default:	#333	 	Text color in note rectangles. */
  noteTextColor?: string;
  /** default:	based on noteBkgColor	*	Border color in note rectangless. */
  noteBorderColor?: string;
  /** default:	based on background	*	  */
  lineColor?: string;
  /** default:	based on primaryTextColor	*	Text in diagram over the background for instance text on labels and on signals in sequence diagram or the title in gantt diagram */
  textColor?: string;
  /** default:	based on primaryColor	*	Background in flowchart objects like rects/circles, class diagram classes, sequence diagram etc */
  mainBkg?: string;
  /** default:	tertiaryColor	*	Color for syntax error message */
  errorBkgColor?: string;
  /** default:	tertiaryTextColor	*	Color for syntax error message */
  errorTextColor?: string;
}

export interface MermaidThemeVariablesFlowChart {
  /** default:	primaryBorderColor	*	Node Border Color */
  nodeBorder?: string;
  /** default:	tertiaryColor	*	Background in subgraphs */
  clusterBkg?: string;
  /** default:	tertiaryBorderColor	*	Cluster Border Color */
  clusterBorder?: string;
  /** default:	lineColor	*	Link Color */
  defaultLinkColor?: string;
  /** default:	tertiaryTextColor	*	Title Color */
  titleColor?: string;
  /** default:	based on secondaryColor	*	  */
  edgeLabelBackground?: string;
  /** default:	primaryTextColor	*	Color for text inside Nodes. */
  nodeTextColor?: string;
}

export interface MermaidThemeVariablesSequenceDiagram {
  /** default:	primaryBorderColor	*	Actor Border Color */
  actorBorder?: string;
  /** default:	mainBkg	*	Actor Background Color */
  actorBkg?: string;
  /** default:	primaryTextColor	*	Actor Text Color */
  actorTextColor?: string;
  /** default:	grey	*	Actor Line Color */
  actorLineColor?: string;
  /** default:	actorBkg	*	Label Box Background Color */
  labelBoxBkgColor?: string;
  /** default:	textColor	*	Signal Color */
  signalColor?: string;
  /** default:	textColor	*	Signal Text Color */
  signalTextColor?: string;
  /** default:	actorBorder	*	Label Box Border Color */
  labelBoxBorderColor?: string;
  /** default:	actorTextColor	*	Label Text Color */
  labelTextColor?: string;
  /** default:	actorTextColor	*	Loop ext Color */
  loopTextColor?: string;
  /** default:r	based on secondaryColor	*	Activation Border Color */
  activationBorderColo?: string;
  /** default:	secondaryColor	*	Activation Background Color */
  activationBkgColor?: string;
  /** default:	based on lineColor	*	Sequence Number Color */
  sequenceNumberColor?: string;
}

export interface MermaidThemeVariablesStateDiagram {
  /** default:	primaryTextColor	*	  */
  labelColor?: string;
  /** default:	tertiaryColor	*	Used for background in deep composite states */
  altBackground?: string;
}

export interface MermaidThemeVariablesClassDiagram {
  /** default:	textColor	*	Color of Text in class diagrams */
  classText?: string;
}

export interface MermaidThemeVariablesUserJourneyDiagram {
  /** default:	primaryColor	*	Fill for 1st section in journey diagram */
  fillType0?: string;
  /** default:	secondaryColor	*	Fill for 2nd section in journey diagram */
  fillType1?: string;
  /** default:	based on primaryColor	*	Fill for 3rd section in journey diagram */
  fillType2?: string;
  /** default:	based on secondaryColor	*	Fill for 4th section in journey diagram */
  fillType3?: string;
  /** default:	based on primaryColor	*	Fill for 5th section in journey diagram */
  fillType4?: string;
  /** default:	based on secondaryColor	*	Fill for 6th section in journey diagram */
  fillType5?: string;
  /** default:	based on primaryColor	*	Fill for 7th section in journey diagram */
  fillType6?: string;
  /** default:	based on secondaryColor	*	Fill for 8th section in journey diagram */
  fillType7?: string;
}

export interface MermaidThemeVariables {
  common: MermaidThemeVariablesCommon;
  flowChart: MermaidThemeVariablesFlowChart;
  sequenceDiagram: MermaidThemeVariablesSequenceDiagram;
  stateDiagram: MermaidThemeVariablesStateDiagram;
  classDiagram: MermaidThemeVariablesClassDiagram;
  userJourneyDiagram: MermaidThemeVariablesUserJourneyDiagram;
}
