import { formattedValueToString, GrafanaTheme } from '@grafana/data';
import { LegendItem, stylesFactory, ThemeContext } from '@grafana/ui';
import { css, cx } from 'emotion';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';

export interface DiagramLegendItemProps {
  key?: React.Key;
  item: LegendItem;
  className?: string;
  onLabelClick?: (item: LegendItem, event: React.MouseEvent<HTMLDivElement>) => void;
}

export const DiagramLegendListItem: React.FunctionComponent<DiagramLegendItemProps> = ({ item, onLabelClick }) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <div
        onClick={event => {
          if (onLabelClick) {
            onLabelClick(item, event);
          }
        }}
        className={css`
          cursor: pointer;
          white-space: pre-wrap;
          color: ${!item.isVisible && theme.colors.linkDisabled};
        `}
      >
        {item.label}
      </div>

      {item.displayValues && (
        <div
          className={css`
            margin-left: 6px;
          `}
        >
          {' '}
          {item.displayValues.forEach(stat => {
            <div>
              {stat.title && `${capitalize(stat.title)}:`} {formattedValueToString(stat)}
            </div>;
          })}
        </div>
      )}
    </>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    row: css`
      font-size: ${theme.typography.size.sm};
      td {
        padding: ${theme.spacing.xxs} ${theme.spacing.sm};
        white-space: nowrap;
      }
    `,
    label: css`
      cursor: pointer;
      white-space: nowrap;
    `,
    itemWrapper: css`
      display: flex;
      white-space: nowrap;
    `,
    value: css`
      text-align: right;
    `,
    yAxisLabel: css`
      color: ${theme.palette.gray2};
    `,
  };
});

export const DiagramLegendTableRow: React.FunctionComponent<DiagramLegendItemProps> = ({
  item,
  onLabelClick,
  className,
}) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <tr className={cx(styles.row, className)}>
      <td>
        <span className={styles.itemWrapper}>
          <div
            onClick={event => {
              if (onLabelClick) {
                onLabelClick(item, event);
              }
            }}
            className={styles.label}
          >
            {item.label} {item.yAxis === 2 && <span className={styles.yAxisLabel}>(right y-axis)</span>}
          </div>
        </span>
      </td>
      {item.displayValues &&
        item.displayValues.map((stat, index) => {
          return (
            <td className={styles.value} key={`${stat.title}-${index}`}>
              {formattedValueToString(stat)}
            </td>
          );
        })}
    </tr>
  );
};
