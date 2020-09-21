import { PanelModel } from '@grafana/data';
import { DiagramOptions } from './types';
import { defaults } from './diagramDefaults';

export const diagramPanelChangeHandler = (panel: PanelModel<DiagramOptions>): Partial<DiagramOptions> => {
  panel.options = defaults;
  panel.options.pluginVersion = panel.pluginVersion || '';
  return panel.options;
};
