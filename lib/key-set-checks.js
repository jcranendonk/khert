/// Returns a value indicating whether `maybeKey` is a key, as opposed to a range or key/range array.
export function isKey(maybeKey) {
  return (
    typeof maybeKey === "string" ||
    typeof maybeKey === "boolean" ||
    typeof maybeKey === "number" ||
    maybeKey === null
  );
}

/// Returns a value indicating whether `maybeRange` is a range, as opposed to a key or key/range array.
export function isRange(maybeRange) {
  return (
    typeof maybeRange === "object" &&
    typeof maybeRange.from === "number" &&
    typeof maybeRange.to === "number"
  );
}
