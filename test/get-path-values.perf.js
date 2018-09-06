import bunyan from "bunyan";
import bFormat from "bunyan-format";
import process from "process";
import randomWords from "random-words";
import prettyMs from "pretty-ms";
import { performance, PerformanceObserver } from "perf_hooks";
import { getPathValues } from "../lib/get-path-values";

const log = bunyan.createLogger({
  name: "perf",
  stream: bFormat(),
  level: process.env.LOG_LEVEL || "info",
});

const basePathLength = 7;
const itemsPerSection = 7;

const graph = {};
const graphPath = genBasePath();

function randomIds(count) {
  const ids = new Array(count);
  for (let i = 0; i < count; i++) {
    ids[i] = (ids[i - 1] || 0) + Math.floor(Math.random() * 4) + 1;
  }
  return ids;
}

function randomEntity() {
  return randomWords({ min: 2, max: 4 }).reduce((o, k) => {
    o[k] = randomWords();
    return o;
  }, {});
}

function genBasePath() {
  const basePath = randomWords({ exactly: basePathLength });
  return [].concat(...basePath.map(key => [key, randomIds(itemsPerSection)]));
}

let entityCount = 0;

function genGraph(path) {
  const key = path[0];
  const ids = path[1];
  const restPath = path.slice(2);
  for (let id of ids) {
    if (!graph[key]) graph[key] = {};

    if (restPath.length) {
      graph[key][id] = { $type: "ref", value: restPath.slice(0, 2) };
      genGraph(restPath);
    } else {
      graph[key][id] = randomEntity();
      entityCount++;
    }
  }
}

log.info("generated graph path", graphPath);
genGraph(graphPath);
log.info("generated", entityCount, "entities");

const obs = new PerformanceObserver(list => {
  log.info(prettyMs(list.getEntries()[0].duration));
});
obs.observe({ entryTypes: ["function"] });

performance.timerify(() => getPathValues(graph, graphPath))();
