import { PanelModel } from '@grafana/data';
import { DiagramOptions } from './types';
import { defaults } from './diagramDefaults';

export const diagramPanelChangeHandler = (panel: PanelModel<DiagramOptions>): Partial<DiagramOptions> => {
  panel.options = defaults;
  return panel.options;
};
