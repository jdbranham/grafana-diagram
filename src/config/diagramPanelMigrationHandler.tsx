import { PanelModel } from '@grafana/data';
import { DiagramOptions } from './types';
import { defaults } from './diagramDefaults';

export const diagramPanelMigrationHandler = (panel: PanelModel<DiagramOptions>): Partial<DiagramOptions> => {
  const options = panel.options || defaults;
  options.pluginVersion = panel.pluginVersion || 'latest';
  return options;
};
