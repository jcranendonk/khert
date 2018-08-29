// @flow
export function isPrimitive(value: mixed): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "object" && typeof value.$type === "string")
  );
}

export function isAtom(value: mixed): boolean {
  return value !== null && typeof value === "object" && value.$type === "atom";
}

export function isRef(value: mixed): boolean {
  return value !== null && typeof value === "object" && value.$type === "ref";
}

export function isError(value: mixed): boolean {
  return value !== null && typeof value === "object" && value.$type === "error";
}
