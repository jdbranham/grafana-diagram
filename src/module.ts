import { FieldConfigProperty, PanelOptionsEditorBuilder, PanelPlugin, SelectableValue } from '@grafana/data';
import { defaults } from './config/diagramDefaults';
import { diagramPanelChangeHandler } from './config/diagramPanelChangeHandler';
import { CompositeMetricEditor } from './editors/CompositeMetricEditor';
import { diagramPanelMigrationHandler } from './config/diagramPanelMigrationHandler';
import { DiagramOptions, ValueType } from './config/types';
import { DiagramPanel } from './DiagramPanel';
import { SupportEditor } from './editors/SupportEditor';
import { MetricCharacterReplacementEditor } from 'editors/MetricReplacementEditor';

interface PanelProperty {
  key: string;
  name: string;
  description: string;
}

const commonTextKeys: PanelProperty[] = [
  {
    key: 'fontFamily',
    name: 'Font family',
    description: 'CSS font family',
  },
  //{
  //  key: 'fontSize', name: 'Font Size', description: 'Font size in px'
  //}
];

const commonColorKeys: PanelProperty[] = [
  {
    key: 'mainBkg',
    name: 'Shape background color',
    description: 'Background in flowchart objects like rects/circles, class diagram classes, sequence diagram etc',
  },
  {
    key: 'lineColor',
    name: 'Line color',
    description: 'Default color of Lines',
  },
  {
    key: 'textColor',
    name: 'Text color',
    description:
      'Text in diagram over the background for instance text on labels and on signals in sequence diagram or the title in gantt diagram',
  },
];

const flowChartKeys: PanelProperty[] = [
  {
    key: 'nodeBorder',
    name: 'Shape border color',
    description: 'Border color of shapes',
  },
];

const statSelectOptions: Array<SelectableValue<ValueType>> = [
  { label: 'mean', value: 'mean', description: 'Use the mean value of all datapoints' },
  { label: 'min', value: 'min', description: 'Use the minimum datapoint value' },
  { label: 'max', value: 'max', description: 'Use the maximum datapoint value' },
  { label: 'sum', value: 'sum', description: 'Use the summation of all datapoints' },
  { label: 'last', value: 'last', description: 'Use the last datapoint value' },
];

const addStyleEditors = (builder: PanelOptionsEditorBuilder<DiagramOptions>) => {
  // dark common
  commonTextKeys.forEach((obj) => {
    builder.addTextInput({
      name: obj.name,
      path: `mermaidThemeVariablesDark.common.${obj.key}`,
      category: ['Style Common: Dark'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesDark.common as any)[obj.key],
      settings: {},
    });
  });

  // light common
  commonTextKeys.forEach((obj) => {
    builder.addTextInput({
      name: obj.name,
      path: `mermaidThemeVariablesLight.common.${obj.key}`,
      category: ['Style Common: Light'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesLight.common as any)[obj.key],
      settings: {},
    });
  });

  // dark common
  commonColorKeys.forEach((obj) => {
    builder.addColorPicker({
      name: obj.name,
      path: `mermaidThemeVariablesDark.common.${obj.key}`,
      category: ['Style Common: Dark'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesDark.common as any)[obj.key],
      settings: { disableNamedColors: true, allowUndefined: true, textWhenUndefined: 'default' },
    });
  });

  // light common
  commonColorKeys.forEach((obj) => {
    builder.addColorPicker({
      name: obj.name,
      path: `mermaidThemeVariablesLight.common.${obj.key}`,
      category: ['Style Common: Light'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesLight.common as any)[obj.key],
      settings: { disableNamedColors: true, allowUndefined: true, textWhenUndefined: 'default' },
    });
  });

  // dark flowchart
  flowChartKeys.forEach((obj) => {
    builder.addColorPicker({
      name: obj.name,
      path: `mermaidThemeVariablesDark.flowChart.${obj.key}`,
      category: ['Style FlowChart: Dark'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesDark.flowChart as any)[obj.key],
      settings: { disableNamedColors: true, allowUndefined: true, textWhenUndefined: 'default' },
    });
  });

  // light flowchart
  flowChartKeys.forEach((obj) => {
    builder.addColorPicker({
      name: obj.name,
      path: `mermaidThemeVariablesLight.flowChart.${obj.key}`,
      category: ['Style FlowChart: Light'],
      description: obj.description,
      defaultValue: (defaults.mermaidThemeVariablesLight.flowChart as any)[obj.key],
      settings: { disableNamedColors: true, allowUndefined: true, textWhenUndefined: 'default' },
    });
  });

  builder.addTextInput({
    name: 'Custom CSS',
    path: 'style',
    category: ['Advanced'],
    defaultValue: defaults.style,
    description: 'Applied after other styles and overrides',
    settings: {
      useTextarea: true,
      rows: 10,
    },
  });

  return builder;
};

const createPanelPlugin = () => {
  const plugin = new PanelPlugin<DiagramOptions>(DiagramPanel)
    .setMigrationHandler(diagramPanelMigrationHandler)
    .setPanelChangeHandler(diagramPanelChangeHandler)
    // Field Configuration Options
    .useFieldConfig({
      disableStandardOptions: [
        FieldConfigProperty.Min,
        FieldConfigProperty.Max,
        FieldConfigProperty.DisplayName,
        FieldConfigProperty.Links,
        FieldConfigProperty.Color,
      ],
      useCustomConfig: (builder) => {
        builder.addSelect({
          name: 'Value by',
          path: 'valueName',
          description: 'Use this reduction function on each series to determine the value of the metric indicator',
          defaultValue: defaults.valueName,
          category: ['Indicator'],
          settings: {
            options: statSelectOptions,
          },
        });
      },
    })
    .setPanelOptions((builder) => {
      builder
        // Display Options
        .addBooleanSwitch({
          path: 'useBackground',
          name: 'Use shape background for metric indicator',
          defaultValue: defaults.useBackground,
        })
        .addTextInput({
          name: 'Diagram URL',
          path: 'contentUrl',
          description: `Get the diagram definition from a URL`,
        })
        .addTextInput({
          name: 'Diagram definition',
          path: 'content',
          description: `This area uses Mermaid syntax - https://mermaid-js.github.io/`,
          defaultValue: defaults.content,
          settings: {
            rows: 10,
            useTextarea: true,
          },
        })
        .addNumberInput({
          name: 'Minimum text node width',
          path: 'nodeSize.minWidth',
          defaultValue: defaults.nodeSize.minWidth,
          description: 'The minimum width a matched diagram text node should be',
        })
        .addNumberInput({
          name: 'Minimum text node height',
          path: 'nodeSize.minHeight',
          defaultValue: defaults.nodeSize.minHeight,
          description: 'The minimum height a matched diagram text node should be',
        })
        // Legend Options
        .addBooleanSwitch({
          name: 'Show legend',
          path: 'legend.show',
          description: 'Show the legend',
          category: ['Legend'],
          defaultValue: defaults.legend.show,
        })
        // Composites
        .addCustomEditor({
          editor: CompositeMetricEditor,
          id: 'composites',
          path: 'composites',
          name: 'Composite metrics',
          category: ['Composites'],
          description: 'Combine series into a composite metric',
        })
        // Advanced
        .addCustomEditor({
          editor: MetricCharacterReplacementEditor,
          id: 'metricCharacterReplacements',
          path: 'metricCharacterReplacements',
          name: 'Metric Character Replacements',
          category: ['Advanced'],
          description: 'Match/replace charactes in the metric name',
        });

      builder = addStyleEditors(builder);

      // Support
      builder.addCustomEditor({
        editor: SupportEditor,
        id: 'support',
        path: 'support',
        name: 'Support',
        category: ['Help'],
      });
      return builder;
    });

  return plugin;
};

export const plugin = createPanelPlugin();
