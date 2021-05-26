import { PanelProps } from '@grafana/data';
import { stylesFactory, useTheme2 } from '@grafana/ui';
import { DiagramPanelController } from 'DiagramController';
import { css, cx } from 'emotion';
import { getDiagramSeriesModel } from 'getDiagramSeriesModel';
import React from 'react';
import { DiagramOptions } from 'config/types';

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
  const theme = useTheme2();
  const styles = getStyles();

  if (!data) {
    return (
      <div className="panel-empty">
        <p>No data found in response</p>
      </div>
    );
  }

  const diagramModels = getDiagramSeriesModel(data.series, timeZone, options, theme, fieldConfig);

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
        theme={theme.v1}
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
