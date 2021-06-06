docker run --rm \
  -p 3000:3000 \
  --name=grafana \
  -e "GF_INSTALL_PLUGINS=https://github.com/jdbranham/grafana-diagram/releases/download/v1.7.3/jdbranham-diagram-panel-1.7.3.zip;grafana-diagram" \
  grafana/grafana:7.4.0