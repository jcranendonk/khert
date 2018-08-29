// @flow
import test from "ava";
import jsonGraph from "./fixture";
import { getJsonGraph } from "../lib";

test.failing("follow JSON Graph references when encountered", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1], "name"]), {
    list: {
      "0": { $type: "ref", value: ["videosById", 22] },
      "1": { $type: "ref", value: ["videosById", 44] }
    },
    videosById: {
      "22": {
        name: "Die Hard"
      },
      "44": {
        name: "Get Out"
      }
    }
  });
});

test.failing("multiple key sets can appear in a single path set", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1], ["name", "rating"]]), {
    list: {
      "0": { $type: "ref", value: ["videosById", 22] },
      "1": { $type: "ref", value: ["videosById", 44] }
    },
    videosById: {
      "22": {
        name: "Die Hard",
        rating: 5
      },
      "44": {
        name: "Get Out",
        rating: 5
      }
    }
  });
});

test.failing("JSON Graph references only followed when an attempt is made to look up a key on them", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", [0, 1]]), {
    list: {
      "0": { $type: "ref", value: ["videosById", 22] },
      "1": { $type: "ref", value: ["videosById", 44] }
    }
  });
});

test.failing("return JSON primitives (string, number, boolean, null) or undefined if they are encountered during path evaluation", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", "length", "name"]), {
    list: {
      length: 2
    }
  });
});

test.failing("return special JSON Graph primitives (atom, error) when encountered during path evaluation", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["videosById", [22, 44], "bookmark"]), {
    videosById: {
      "22": {
        bookmark: { $type: "atom", value: 73973 }
      },
      "44": {
        bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" }
      }
    }
  });
});

test.failing("special JSON Graph primitives (atom, error) are treated as primitives", t => {
  // We return special primitives when found rather than looking up keys in them. This is similar to the way we wouldn't return the 'length' key of a string.
  t.deepEqual(
    getJsonGraph(jsonGraph, ["videosById", [22, 44], "bookmark", "value"]),
    {
      videosById: {
        "22": {
          bookmark: { $type: "atom", value: 73973 }
        },
        "44": {
          bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" }
        }
      }
    }
  );
});

test.failing("if an attempt is made to look up a key on a reference, and the target of that reference is another reference, the reference’s target reference should be followed recursively", t => {
  t.deepEqual(getJsonGraph(jsonGraph, ["list", -1, "bookmark"]), {
    list: {
      "-1": { $type: "ref", value: ["list", 1] },
      "1": { $type: "ref", value: ["videosById", 44] }
    },
    videosById: {
      "44": {
        bookmark: { $type: "error", value: "Couldn’t retrieve bookmark" }
      }
    }
  });
});

test.failing("error is thrown if target of path is not a JSON Graph primitive (string, null, boolean, number, atom, error, ref, undefined)", t => {
  // In other words, throw if the target of path an object without a $type key.
  t.throws(() => getJsonGraph(jsonGraph, ["list"]));
});
