import { PanelProps } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';
import { DiagramPanelController } from 'DiagramController';
import { css, cx } from 'emotion';
import { getDiagramSeriesModel } from 'getDiagramSeriesModel';
import React from 'react';
import { DiagramOptions } from 'config/types';
import { initAnalytics } from 'analytics/analytics';

export interface DiagramPanelOptions extends PanelProps<DiagramOptions> {}

export const DiagramPanel: React.FC<DiagramPanelOptions> = ({
  id,
  data,
  timeZone,
  width,
  height,
  options,
  fieldConfig,
  replaceVariables,
  onOptionsChange,
  onChangeTimeRange,
}) => {
  const theme = useTheme();
  const styles = getStyles();

  if (!data) {
    return (
      <div className="panel-empty">
        <p>No data found in response</p>
      </div>
    );
  }

  const diagramModels = React.useMemo(() => getDiagramSeriesModel(data.series, timeZone, options, fieldConfig), [
    data.series,
    timeZone,
    options,
    fieldConfig,
  ]);

  const analytics = React.useMemo(
    () =>
      initAnalytics({
        enabled: options.anonymousTracking,
        version: options.pluginVersion,
      }),
    [options]
  );

  React.useMemo(() => analytics.track('loaded panel'), [1]);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <DiagramPanelController
        theme={theme}
        id={id}
        data={diagramModels}
        timeZone={timeZone}
        width={width}
        height={height}
        options={options}
        fieldConfig={fieldConfig}
        replaceVariables={replaceVariables}
        onOptionsChange={onOptionsChange}
        onChangeTimeRange={onChangeTimeRange}
      ></DiagramPanelController>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
  };
});
