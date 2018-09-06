import bunyan from "bunyan";
import bFormat from "bunyan-format";
import process from "process";
import _ from "lodash/fp";
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

export function getPathValues(graph, initialPathSet) {
  const pathSets = [initialPathSet];
  const pathValues = [];

  // Loop over all path sets; more path sets may be added during processing
  for (let pathSetIx = 0; pathSetIx < pathSets.length; pathSetIx++) {
    const pathSet = pathSets[pathSetIx];
    let subgraph = graph;

    for (let keySetIx = 0; keySetIx < pathSet.length; keySetIx++) {
      const keySet = pathSet[keySetIx];

      if (isKey(keySet)) {
        const entry = subgraph[keySet];
        const pathSuffix = pathSet.slice(keySetIx + 1);
        const hasSuffix = !!pathSuffix.length;

        if (isPrimitive(entry)) {
          if (isRef(entry) && hasSuffix) {
            const refPathSet = [...entry.value, ...pathSuffix];
            log.debug("following ref to", refPathSet);
            pathSets.push(refPathSet);
          }

          // Add path-value key pair
          const path = pathSet.slice(0, keySetIx + 1).map(_.toString);
          const pathValue = [path, safeValue(entry)];
          log.debug("adding path value", pathValue);
          pathValues.push(pathValue);

          // Continue with next path set, do not descend with remaining key sets
          break;
        } else if (hasSuffix) {
          subgraph = entry;
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
  }

  return pathValues;
}

export function getJsonGraph(graph, pathSet) {
  return pathValuesToGraph(getPathValues(graph, pathSet));
}
