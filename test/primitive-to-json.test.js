import test from 'ava'
import { primitiveToJson } from '../lib/primitive-to-json'

test('primitiveToJson returns undefined for a ref', t =>
  t.is(primitiveToJson({ $type: 'ref', value: ['path'] }), undefined))

test('primitiveToJson returns the value of an atom', t => {
  const value = ['thing', 9]
  t.is(primitiveToJson({ $type: 'atom', value }), value)
})

test('primitiveToJson throws for an error', t =>
  t.throws(() => primitiveToJson({ $type: 'error', value: 'oh no' })))

test('primitiveToJson throws for an unknown JSON Graph type', t =>
  t.throws(() => primitiveToJson({ $type: 'what is this even' })))

test('primitiveToJson returns non-JSON Graph primitive value as-is', t => {
  const value = { hello: 'there', general: 'kenobi' }
  t.is(primitiveToJson(value), value)
})

test('primitiveToJson returns non-JSON Graph primitive as-is', t => {
  const value = 5
  t.is(primitiveToJson(value), value)
})
