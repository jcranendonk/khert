import test from 'ava'
import { range } from '../lib/range'

test('range returns array', t =>
  t.deepEqual(range({ from: 3, to: 5 }), [3, 4, 5]))
test('range returns array with single value when to == from', t =>
  t.deepEqual(range({ from: 3, to: 3 }), [3]))
test('range throws when from > to', t =>
  t.throws(() => range({ from: 5, to: 3 })))
