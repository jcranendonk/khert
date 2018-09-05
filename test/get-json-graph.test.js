import test from "ava";
import jsonGraph from "./fixture";
import { getPathValues, getJsonGraph } from "../lib/get-json-graph";
import { pathValuesToGraph } from "../lib/get-json-graph";

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

test("getPathValues returns primitives", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", 0]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
  ]);
});

test("getJsonGraph returns primitives", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", 0]), {
    list: { 0: { $type: "ref", value: ["videosById", 22] } },
  });
});

test("getJsonGraph returns atoms for undefined values", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", 2]), {
    list: { 2: { $type: "atom" } },
  });
});

test("getJsonGraph follows JSON Graph references when encountered", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1], "name"]), {
    list: {
      0: { $type: "ref", value: ["videosById", 22] },
      1: { $type: "ref", value: ["videosById", 44] },
    },
    videosById: {
      22: { name: "Die Hard" },
      44: { name: "Get Out" },
    },
  });
});

test("getJsonGraph accepts multiple key sets in a single path set", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1], ["name", "rating"]]), {
    list: {
      0: { $type: "ref", value: ["videosById", 22] },
      1: { $type: "ref", value: ["videosById", 44] },
    },
    videosById: {
      22: {
        name: "Die Hard",
        rating: 5,
      },
      44: {
        name: "Get Out",
        rating: 5,
      },
    },
  });
});

test("getJsonGraph only follows JSON Graph references when an attempt is made to look up a key on them", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1]]), {
    list: {
      0: { $type: "ref", value: ["videosById", 22] },
      1: { $type: "ref", value: ["videosById", 44] },
    },
  });
});

test("getJsonGraph returns JSON primitives or undefined if they are encountered during path evaluation", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", "length", "name"]), {
    list: { length: 2 },
  });
});

test("getJsonGraph returns special JSON Graph primitives when encountered during path evaluation", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["videosById", [22, 44], "bookmark"]), {
    videosById: {
      22: {
        bookmark: { $type: "atom", value: 73973 },
      },
      44: {
        bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" },
      },
    },
  });
});

test("getJsonGraph treats special JSON Graph primitives as primitives", t => {
  // We return special primitives when found rather than looking up keys in them. This is similar to the way we wouldn't return the 'length' key of a string.
  t.deepEqual(
    getJsonGraph(jsonGraph, ["videosById", [22, 44], "bookmark", "value"]),
    {
      videosById: {
        22: {
          bookmark: { $type: "atom", value: 73973 },
        },
        44: {
          bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" },
        },
      },
    }
  );
});

test("getJsonGraph follows references recursively", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", -1, "bookmark"]), {
    list: {
      "-1": { $type: "ref", value: ["list", 1] },
      1: { $type: "ref", value: ["videosById", 44] },
    },
    videosById: {
      44: {
        bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" },
      },
    },
  });
});

test("getJsonGraph throws an error if target of path is not a JSON Graph primitive", t => {
  // In other words, throw if the target of path an object without a $type key.
  t.throws(() => getJsonGraph(jsonGraph, ["list"]));
});
