import bunyan from "bunyan";
import bFormat from "bunyan-format";
import process from "process";
import { isPrimitive, isRef } from "./value-checks";

const log = bunyan.createLogger({
  name: "getJsonGraph",
  stream: bFormat(),
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "test" ? "debug" : "info"),
});

/// Returns a value indicating whether `maybeKey` is a key, as opposed to a range or key/range array.
function isKey(maybeKey) {
  return (
    typeof maybeKey === "string" ||
    typeof maybeKey === "boolean" ||
    typeof maybeKey === "number" ||
    maybeKey === null
  );
}

/// Returns a value indicating whether `maybeRange` is a range, as opposed to a key or key/range array.
function isRange(maybeRange) {
  return (
    typeof maybeRange === "object" &&
    maybeRange.from != null &&
    maybeRange.to != null
  );
}

/// Converts an array of [path, value] tuples into a JSON Graph.
export function pathValuesToGraph(pathValues) {
  const graph = {};

  for (const [path, value] of pathValues) {
    let subgraph = graph;
    const lastKey = path.pop();

    // Create intermediate subgraphs
    for (const key of path) {
      if (!subgraph[key]) subgraph[key] = {};
      subgraph = subgraph[key];
    }

    // Set value
    subgraph[lastKey] = value;
  }

  return graph;
}

/// Returns an empty atom for `undefined`, or `value` otherwise.
function safeValue(value) {
  return value === undefined ? { $type: "atom" } : value;
}

export function getPathValues(graph, initialPathSet, pathPrefix = []) {
  const pathSets = [initialPathSet];
  const pathValues = [];

  // Loop over all path sets; more path sets may be added during processing
  for (let pathSetIx = 0; pathSetIx < pathSets.length; pathSetIx++) {
    log.info(
      "next path",
      pathSets[pathSetIx],
      ",",
      pathSetIx,
      "out of",
      pathSets.length
    );
    const pathSuffix = Array.from(pathSets[pathSetIx]);
    const keySet = pathSuffix.shift();

    if (isKey(keySet)) {
      const entry = graph[keySet];
      const path = [...pathPrefix, `${keySet}`];
      const hasSuffix = !!pathSuffix.length;

      if (isPrimitive(entry)) {
        if (isRef(entry) && hasSuffix) {
          const refPath = entry.value;
          log.info("adding ", [...refPath, ...pathSuffix]);
          pathSets.push([...refPath, ...pathSuffix]);
          log.info("now have", pathSets.length, "paths:", pathSets);
        }

        // Add path-value key pair
        pathValues.push([path, safeValue(entry)]);

        // Continue with next path set, do not descend with remaining key sets
        break;
      } else if (hasSuffix) {
        // Descend into subgraph
        pathValues.push(...getPathValues(entry, pathSuffix, path));
      } else {
        throw new Error("Invalid attempt to retrieve non-primitive value");
      }
    } else if (isRange(keySet)) {
      // TODO range
    } else if (Array.isArray(keySet)) {
      // TODO array
    } else {
      throw new Error("Invalid key type in key set");
    }
  }

  return pathValues;
}

export function getJsonGraph(graph, pathSet) {
  return pathValuesToGraph(getPathValues(graph, pathSet));
}
