import { DisplayValue, Field } from '@grafana/data';
import { LegendDisplayMode, LegendPlacement } from '@grafana/ui';
import { MermaidThemeVariables } from './theme';

export type ValueType = 'mean' | 'min' | 'max' | 'sum' | 'last' | 'name';
export type DiagramPanelMode = 'content' | 'url';
export type DiagramThemeType = 'default' | 'dark' | 'forest' | 'neutral';

export declare type DiagramSeriesValue = number | null;
/** View model projection of a series */
export interface DiagramSeriesModel {
  data: DiagramSeriesValue[][];
  isVisible: boolean;
  label: string;
  timeField: Field;
  valueField: Field;
  seriesIndex: number;
  timeStep: number;
  info?: DisplayValue[];
}

export interface NodeSizeOptions {
  minWidth: number;
  minHeight: number;
}

export interface LegendOptions {
  show: boolean;
  asTable: boolean;
  hideEmpty: boolean;
  hideZero: boolean;
  stats: string[];
  sortBy: string;
  sortDesc: boolean;
  placement: LegendPlacement;
  displayMode: LegendDisplayMode;
  gradient: {
    enabled: boolean;
    show: boolean;
  };
}

export interface MetricCharacterReplacement {
  replacementPattern: string | RegExp;
  replaceWithText: string;
}

export interface CompositeMetric {
  name: string;
  members: string[];
  valueName: ValueType;
  showLowestValue: boolean;
}

export interface DiagramOptions {
  pluginVersion: string;
  anonymousTracking: boolean;
  nodeSize: NodeSizeOptions;
  composites: CompositeMetric[];
  metricCharacterReplacements: MetricCharacterReplacement[];
  style: string;
  legend: LegendOptions;
  maxWidth: boolean;
  moddedSeriesVal: number;
  valueName: ValueType;
  content: string;
  mode: DiagramPanelMode;
  mermaidServiceUrl: string;
  useBasicAuth: boolean;
  authUsername: string;
  authPassword: string;
  mermaidThemeVariablesDark: MermaidThemeVariables;
  mermaidThemeVariablesLight: MermaidThemeVariables;
  useBackground: boolean;
}
