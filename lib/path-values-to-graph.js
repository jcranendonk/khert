/// Converts an array of [path, value] tuples `pathValues` into a JSON Graph.
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
