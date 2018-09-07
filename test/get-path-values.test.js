import test from "ava";
import jsonGraph from "./fixture";
import { getPathValues } from "../lib/get-path-values";

test("getPathValues returns primitives", t => {
  t.deepEqual(getPathValues(jsonGraph, ["videosById", 22, "name"]), [
    [["videosById", "22", "name"], "Die Hard"],
  ]);
});

test("getPathValues returns atoms for undefined values", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", 2]), [
    [["list", "2"], { $type: "atom" }],
  ]);
});

test("getPathValues accepts arrays of keys", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", [0, 1]]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
    [["list", "1"], { $type: "ref", value: ["videosById", 44] }],
  ]);
});

test("getPathValues accepts ranges", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", { from: 0, to: 1 }]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
    [["list", "1"], { $type: "ref", value: ["videosById", 44] }],
  ]);
});

test("getPathValues follows JSON Graph references when encountered", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", 0, "name"]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
    [["videosById", "22", "name"], "Die Hard"],
  ]);
});

test("getPathValues does not follows JSON Graph references unless needed", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", 0]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
  ]);
});

test("getPathValues accepts multiple key sets in a single path set", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", [0, 1], ["name", "rating"]]), [
    [["list", "0"], { $type: "ref", value: ["videosById", 22] }],
    [["list", "1"], { $type: "ref", value: ["videosById", 44] }],
    [["videosById", "22", "name"], "Die Hard"],
    [["videosById", "22", "rating"], 5],
    [["videosById", "44", "name"], "Get Out"],
    [["videosById", "44", "rating"], 4],
  ]);
});

test("getPathValues returns JSON primitives if they are encountered during path evaluation", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", "length", "name"]), [
    [["list", "length"], 2],
  ]);
});

test("getPathValues returns special JSON Graph primitives when encountered during path evaluation", t => {
  t.deepEqual(getPathValues(jsonGraph, ["videosById", [22, 44], "bookmark"]), [
    [["videosById", "22", "bookmark"], { $type: "atom", value: 73973 }],
    [
      ["videosById", "44", "bookmark"],
      { $type: "error", value: "Couldn’t retrieve bookmark" },
    ],
  ]);
});

test("getPathValues treats special JSON Graph primitives as primitives", t => {
  // We return special primitives when found rather than looking up keys in them.
  // This is similar to the way we wouldn't return the 'length' key of a string.
  t.deepEqual(
    getPathValues(jsonGraph, ["videosById", [22, 44], "bookmark", "value"]),
    [
      [["videosById", "22", "bookmark"], { $type: "atom", value: 73973 }],
      [
        ["videosById", "44", "bookmark"],
        { $type: "error", value: "Couldn’t retrieve bookmark" },
      ],
    ]
  );
});

test("getPathValues follows references recursively", t => {
  t.deepEqual(getPathValues(jsonGraph, ["list", -1, "bookmark"]), [
    [["list", "-1"], { $type: "ref", value: ["list", 1] }],
    [["list", "1"], { $type: "ref", value: ["videosById", 44] }],
    [
      ["videosById", "44", "bookmark"],
      { $type: "error", value: "Couldn’t retrieve bookmark" },
    ],
  ]);
});

test("getPathValues throws an error if target of path is not a JSON Graph primitive", t => {
  // In other words, throw if the target of path is an array or an object without a $type key.
  t.throws(() => getPathValues(jsonGraph, ["list"]));
});
