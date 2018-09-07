import { pathValuesToGraph } from './path-values-to-graph'
import { getPathValues } from './get-path-values'
import { primitiveToJson } from './primitive-to-json'

export function getJsonGraph (graph, pathSet) {
  return pathValuesToGraph(getPathValues(graph, pathSet))
}

export function getJson (graph, pathSet) {
  return pathValuesToGraph(getPathValues(graph, pathSet), primitiveToJson)
}
