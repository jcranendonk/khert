export function isPrimitive (value) {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'object' && typeof value.$type === 'string')
  )
}

export function isGraphPrimitive (value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.$type === 'string'
  )
}

export function isAtom (value) {
  return value !== null && typeof value === 'object' && value.$type === 'atom'
}

export function isRef (value) {
  return value !== null && typeof value === 'object' && value.$type === 'ref'
}

export function isError (value) {
  return value !== null && typeof value === 'object' && value.$type === 'error'
}
