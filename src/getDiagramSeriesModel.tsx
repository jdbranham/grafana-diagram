import {
  DataFrame,
  DEFAULT_DATE_TIME_FORMAT,
  DisplayValue,
  FieldConfigSource,
  FieldType,
  getDisplayProcessor,
  getFieldDisplayName,
  getFlotPairs,
  getSeriesTimeStep,
  getTimeField,
  hasMsResolution,
  MS_DATE_TIME_FORMAT,
  NullValueMode,
  reduceField,
  stringToJsRegex,
  TimeZone,
} from '@grafana/data';
import { DiagramOptions, DiagramSeriesModel, MetricCharacterReplacement } from './config/types';

const replaceMetricCharacters = (metricName: string, metricCharacterReplacements: MetricCharacterReplacement[]) => {
  // a datasource sending bad data will have a type other than string, set it to "MISSING_METRIC_TARGET" and return
  if (typeof metricName !== 'string') {
    return 'DATASOURCE_SENT_INVALID_METRIC_TARGET';
  }
  var replacedText = metricName.replace(/"|,|;|=|:|{|}/g, '_');
  for (var index in metricCharacterReplacements) {
    const replacement = metricCharacterReplacements[index];
    // start with a simple replacement
    let pattern = replacement.replacementPattern;
    // check if the pattern is empty
    if (pattern.toString().length === 0) {
      continue;
    }
    // if it is a regex, convert
    if (pattern.toString()[0] === '/') {
      pattern = stringToJsRegex(replacement.replacementPattern.toString());
    }
    replacedText = replacedText.replace(pattern, replacement.replaceWithText);
  }
  return replacedText;
};

const reducers = ['min', 'max', 'mean', 'last', 'sum'];

export const getDiagramSeriesModel = (
  dataFrames: DataFrame[],
  timeZone: TimeZone,
  options: DiagramOptions,
  fieldOptions?: FieldConfigSource
) => {
  const models: DiagramSeriesModel[] = [];

  const displayProcessor = getDisplayProcessor({
    field: {
      config: {
        decimals: fieldOptions?.defaults?.decimals,
        unit: fieldOptions?.defaults?.unit,
        thresholds: fieldOptions?.defaults?.thresholds,
      },
    },
    timeZone,
  });

  let fieldColumnIndex = -1;
  for (const series of dataFrames) {
    const { timeField } = getTimeField(series);

    if (!timeField) {
      continue;
    }

    for (const field of series.fields) {
      if (field.type !== FieldType.number) {
        continue;
      }
      // Storing index of series field for future inspection
      fieldColumnIndex++;

      // Use external calculator just to make sure it works :)
      const points = getFlotPairs({
        xField: timeField,
        yField: field,
        nullValueMode: NullValueMode.Null,
      });

      if (points.length > 0) {
        const seriesStats = reduceField({ field, reducers });
        let statsDisplayValues: DisplayValue[] = [];

        statsDisplayValues = reducers.map<DisplayValue>((stat: any) => {
          const statDisplayValue = field.display
            ? field.display(seriesStats[stat])
            : displayProcessor(seriesStats[stat]);

          return {
            ...statDisplayValue,
            title: stat,
          };
        });

        const timeStep = getSeriesTimeStep(timeField);
        const useMsDateFormat = hasMsResolution(timeField);

        timeField.display = getDisplayProcessor({
          timeZone,
          field: {
            ...timeField,
            type: timeField.type,
            config: {
              unit: `time:${useMsDateFormat ? MS_DATE_TIME_FORMAT : DEFAULT_DATE_TIME_FORMAT}`,
            },
          },
        });

        models.push({
          label: replaceMetricCharacters(
            getFieldDisplayName(field, series, dataFrames),
            options.metricCharacterReplacements
          ),
          data: points,
          info: statsDisplayValues,
          isVisible: true,
          seriesIndex: fieldColumnIndex,
          timeField: { ...timeField },
          valueField: { ...field },
          timeStep,
        });
      }
    }
  }

  console.log('generated models:');
  console.log(models);

  return models;
};
