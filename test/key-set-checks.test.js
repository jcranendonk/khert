import test from "ava";
import { isKey, isRange } from "../lib/key-set-checks";

test("isKey returns true for string", t => t.true(isKey("x")));
test("isKey returns true for boolean", t => t.true(isKey(true)));
test("isKey returns true for number", t => t.true(isKey(5)));
test("isKey returns true for null", t => t.true(isKey(null)));
test("isKey returns false for Array", t => t.false(isKey([])));
test("isKey returns false for Object", t => t.false(isKey({})));
test("isKey returns false for undefined", t => t.false(isKey(undefined)));

test("isRange returns true for range object", t =>
  t.true(isRange({ from: 5, to: 3 })));
test("isRange returns false for range object with incorrect field type for to", t => {
  t.false(isRange({ from: 5, to: null }));
  t.false(isRange({ from: 5, to: "3" }));
  t.false(isRange({ from: 5, to: [] }));
});
test("isRange returns false for range object with incorrect field type for from", t => {
  t.false(isRange({ from: null, to: 3 }));
  t.false(isRange({ from: "5", to: 3 }));
  t.false(isRange({ from: [], to: 3 }));
});
test("isRange returns false for range object missing to", t =>
  t.false(isRange({ from: 5 })));
test("isRange returns false for range object missing from", t =>
  t.false(isRange({ to: 3 })));
test("isRange returns false for non-range object", t => t.false(isRange({})));
