FROM nodered/node-red:4.1.0

USER root

WORKDIR /app
COPY node-red/ /app/default-data/
COPY scripts/render-start.sh /usr/local/bin/render-start
COPY scripts/prepare-render-flow.mjs /app/scripts/prepare-render-flow.mjs

RUN chmod +x /usr/local/bin/render-start \
  && chown -R node-red:node-red /app

EXPOSE 1880

ENTRYPOINT ["/usr/local/bin/render-start"]
