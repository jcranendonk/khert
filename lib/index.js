import { pathValuesToGraph } from "./path-values-to-graph";
import { getPathValues } from "./get-path-values";

export { getJson } from "./get-json";

export function getJsonGraph(graph, pathSet) {
  return pathValuesToGraph(getPathValues(graph, pathSet));
}
