---
title: Options
description: 'Reference for Diagram panel options.'
sidebar_position: 3
---

<!-- section-brief
Fill this in: Reference the options Diagram exposes in the panel editor. Cover both the custom options the panel adds (via `setPanelOptions` in source) and the standard field options it enables (via `useFieldConfig`). Skip the sections below that don't apply to this panel - if there's no Standard field options block, no Tooltip section etc., remove those headings entirely rather than leaving an empty brief.

Do not redocument the framework-level standard options themselves (Min, Max, Unit, etc.) - Grafana's own docs cover those. The Standard field options section lists which ones are enabled, nothing more.
-->

## Panel options

<!-- section-brief
Fill this in: Emit a markdown table with these columns - one row per option registered through `setPanelOptions` in `src/module.ts`. Match the Grafana built-in panel docs style: https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/logs/#logs-options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |

- _Option_: the `name` value from the `setPanelOptions` `.add*({...})` call, verbatim.
- _Type_: a short label for the editor the option uses, derived from the builder method (`addBooleanSwitch` → Toggle, `addSelect` → Select, `addNumberInput` → Number, `addFieldNamePicker` → Field picker). For a custom editor, name what it is, such as Color picker, rather than writing Custom.
- _Default_: the value a reader sees in the panel editor, rendered as inline code. Resolve enum members, constants and translation calls to that value - `ClockMode.time` becomes `Time`. Keep the source expression only when it can't be resolved. When there is no default but the code falls back to a value while the option is unset, give that fallback value. Leave the cell empty only when there is neither.
- _Description_: the `description` value, verbatim. If the verbatim text causes a `docs:validate` warning, reword it as little as possible and keep its meaning. When source has none, write one short sentence describing what the option does, based on how the panel code uses it. Don't guess beyond what the code shows.

If the panel does not call `setPanelOptions`, remove this section entirely.
-->

## Standard field options

<!-- section-brief
Fill this in: A bulleted list of the standard field options this panel enables - the entries from `useFieldConfig({ standardOptions: [...] })` in `src/module.ts`. If the panel calls `useFieldConfig()` or `useFieldConfig({})` without a `standardOptions` key, document this as "all standard options are enabled" and list the standard set.

If the panel does not call `useFieldConfig` at all, remove this section entirely.
-->

## Custom field options

<!-- section-brief
Fill this in: A table with the same shape as Panel options (Option / Type / Default / Description) but for the per-field overrides registered via `useFieldConfig({ useCustomConfig: builder => ... })`. These appear under the Overrides picker in the panel editor.

If the panel does not register custom field options, remove this section entirely.
-->

## Tooltip options

<!-- section-brief
Fill this in: Describe the tooltip-related options Diagram exposes (hover behavior, what fields the tooltip shows, formatting). Most tooltip options will already appear in the Panel options table above when they're registered via `setPanelOptions` with `category: ['Tooltip']`; use this section for narrative context that doesn't fit in a table row. Remove this section if there is nothing extra to say beyond the table.
-->

## Legend options

<!-- section-brief
Fill this in: Describe the legend-related options Diagram exposes (placement, values shown, calculations). Same pattern as Tooltip options - the table above already covers the per-option reference; this section is for narrative context. Remove the section if not applicable.
-->
