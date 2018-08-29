// @flow
export type JsonGraph = {};
export type Key = string | boolean | number | null;
export type Path = Key[];
export type Range = { from: number, to: number };
export type KeySet = Key | Range | (Key | Range)[];
export type PathSet = KeySet[];

export { getJsonGraph } from "./get-json-graph";
export { getJson } from "./get-json";
