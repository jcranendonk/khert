/// Converts an array of [path, value] tuples `pathValues` into a JSON Graph.
/// Optionally, a `valueTransform` can be provided to modify values before they're written
/// into the graph.
export function pathValuesToGraph(pathValues, valueTransform = x => x) {
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
    const tValue = valueTransform(value);
    if (tValue !== undefined) subgraph[lastKey] = tValue;
  }

  return graph;
}
