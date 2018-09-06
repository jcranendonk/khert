import test from "ava";
import { pathValuesToGraph } from "../lib/path-values-to-graph";

test("pathValuesToGraph returns empty graph", t => {
  t.deepEqual(pathValuesToGraph([]), {});
});

test("pathValuesToGraph sets values", t => {
  t.deepEqual(
    pathValuesToGraph([
      [["list", 0, "name"], "First item"],
      [["list", 1, "name"], "Second item"],
      [["topLevel"], { $type: "atom" }],
    ]),
    {
      list: {
        0: { name: "First item" },
        1: { name: "Second item" },
      },
      topLevel: { $type: "atom" },
    }
  );
});
