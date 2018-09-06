import bunyan from "bunyan";
import bFormat from "bunyan-format";
import process from "process";
import { isPrimitive, isRef } from "./value-checks";
import { isKey, isRange } from "./key-set-checks";
import { range } from "./range";

const log = bunyan.createLogger({
  name: "getPathValues",
  stream: bFormat(),
  level: process.env.LOG_LEVEL || "info",
});

/// Returns an empty atom for `undefined`, or `value` otherwise.
function safeValue(value) {
  return value === undefined ? { $type: "atom" } : value;
}

/// Takes a JSON Graph `graph` and an `initialPathSet`, and returns an array of [path, value] tuples.
export function getPathValues(graph, initialPathSet) {
  const pathSets = [initialPathSet];
  const pathValues = [];

  // Loop over all path sets; more path sets may be added during processing
  for (let pathSetIx = 0; pathSetIx < pathSets.length; pathSetIx++) {
    const pathSet = pathSets[pathSetIx];
    const path = [];
    let subgraph = graph;

    for (let keySetIx = 0; keySetIx < pathSet.length; keySetIx++) {
      const keySet = pathSet[keySetIx];
      const pathSuffix = pathSet.slice(keySetIx + 1);

      if (isKey(keySet)) {
        path.push(`${keySet}`);
        const graphEntry = subgraph[keySet];
        const hasSuffix = !!pathSuffix.length;

        if (isPrimitive(graphEntry)) {
          if (isRef(graphEntry) && hasSuffix) {
            const refPathSet = [...graphEntry.value, ...pathSuffix];
            log.debug("following ref to", refPathSet);
            pathSets.push(refPathSet);
          }

          // Add path-value key pair
          const pathValue = [path, safeValue(graphEntry)];
          log.debug("adding path value", pathValue);
          pathValues.push(pathValue);

          // Continue with next path set, do not descend with remaining key sets
          break;
        } else if (hasSuffix) {
          subgraph = graphEntry;
        } else {
          throw new Error("Invalid attempt to retrieve non-primitive value");
        }
      } else if (isRange(keySet)) {
        const expandedPathSets = range(keySet).map(key =>
          path.concat(`${key}`, pathSuffix)
        );
        log.debug("adding expanded paths", expandedPathSets);
        pathSets.push(...expandedPathSets);
        break;
      } else if (Array.isArray(keySet)) {
        const expandedPathSets = keySet.map(key =>
          path.concat(`${key}`, pathSuffix)
        );
        log.debug("adding expanded paths", expandedPathSets);
        pathSets.push(...expandedPathSets);
        break;
      } else {
        throw new Error("Invalid key type in key set");
      }
    }
  }

  return pathValues;
}
