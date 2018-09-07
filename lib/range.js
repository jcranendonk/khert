/// Returns an array containing all values from `from` to `to` inclusive. Throws when `from` > `to`.
export function range ({ from, to }) {
  let ix = 0
  const len = to - from + 1
  const result = new Array(len)
  while (ix < len) result[ix] = from + ix++
  return result
}
