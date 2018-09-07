import { isGraphPrimitive, isAtom, isRef, isError } from './value-checks'

/// Transforms JSON Graph primitives to their respective JSON representation, which
/// may be `undefined` or a thrown error.
export function primitiveToJson (value) {
  if (isGraphPrimitive(value)) {
    if (isRef(value)) return undefined
    if (isAtom(value)) return value.value
    if (isError(value)) throw new Error(value.value)
    throw new Error(`Unknown JSON Graph primitive type: ${value.$type}`)
  }

  return value
}
