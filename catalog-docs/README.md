# Diagram documentation

This folder is the documentation for **Diagram**. It's published on the Documentation tab of
`grafana.com/grafana/plugins/jdbranham-diagram-panel/` with each plugin release. This README isn't published.

To learn how plugin docs work and how to write them, read the
[Add documentation to your plugin](https://grafana.com/developers/plugin-tools/how-to-guides/plugin-docs) guide.

## Next steps

1. Fill in or review the pages. Each section has a note that says what belongs there.
2. Add screenshots, videos and figures where they help readers. Save them inside this folder, for example in `img/`, and link to them with a relative path. `docs:validate` checks their formats and sizes.
3. Run `yarn run docs:serve` to preview the docs. It also reports warnings for every section left to fill.

## Commands

```bash
yarn run docs:serve     # local preview at http://localhost:3001
yarn run docs:validate  # check your docs, including sections left to fill
```
