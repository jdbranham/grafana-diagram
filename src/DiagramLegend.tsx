import React, { useContext } from 'react';
import { DiagramLegendListItem, DiagramLegendTableRow } from './DiagramLegendItem';
import union from 'lodash/union';
import sortBy from 'lodash/sortBy';
import { css } from 'emotion';
import { ThemeContext, selectThemeVariant, LegendList, LegendTable, LegendItem, LegendDisplayMode } from '@grafana/ui';
import { LegendProps } from '@grafana/ui/components/Legend/Legend';

export interface DiagramLegendProps extends LegendProps {
  displayMode: LegendDisplayMode;
  sortBy?: string;
  sortDesc?: boolean;
  onToggleSort?: (sortBy: string) => void;
  onLabelClick?: (item: LegendItem, event: React.MouseEvent<HTMLElement>) => void;
}

export const DiagramLegend: React.FunctionComponent<DiagramLegendProps> = ({
  items,
  displayMode,
  sortBy: sortKey,
  sortDesc,
  onToggleSort,
  placement,
  className,
  ...graphLegendItemProps
}) => {
  const theme = useContext(ThemeContext);

  if (displayMode === LegendDisplayMode.Table) {
    const columns = items
      .map(item => {
        if (item.displayValues) {
          return item.displayValues.map(i => i.title);
        }
        return [];
      })
      .reduce(
        (acc, current) => {
          return union(
            acc,
            current.filter(item => !!item)
          );
        },
        ['']
      ) as string[];

    const sortedItems = sortKey
      ? sortBy(items, item => {
          if (item.displayValues) {
            const stat = item.displayValues.filter(stat => stat.title === sortKey)[0];
            return stat && stat.numeric;
          }
          return undefined;
        })
      : items;

    const legendTableEvenRowBackground = selectThemeVariant(
      {
        dark: theme.palette.dark6,
        light: theme.palette.gray5,
      },
      theme.type
    );

    return (
      <LegendTable
        className={css`
          font-size: ${theme.typography.size.sm};
          th {
            padding: ${theme.spacing.xxs} ${theme.spacing.sm};
          }
        `}
        items={sortDesc ? sortedItems.reverse() : sortedItems}
        columns={columns}
        placement={placement}
        sortBy={sortKey}
        sortDesc={sortDesc}
        itemRenderer={(item, index) => (
          <DiagramLegendTableRow
            key={`${item.label}-${index}`}
            item={item}
            className={css`
              background: ${index % 2 === 0 ? legendTableEvenRowBackground : 'none'};
            `}
            {...graphLegendItemProps}
          />
        )}
        onToggleSort={onToggleSort}
      />
    );
  }
  return (
    <LegendList
      items={items}
      placement={placement}
      itemRenderer={item => <DiagramLegendListItem item={item} {...graphLegendItemProps} />}
    />
  );
};

DiagramLegend.displayName = 'DiagramLegend';
