import test from "ava";
import { isAtom, isError, isPrimitive, isRef, isGraphPrimitive } from "../lib/value-checks";

test("undefined is primitive", t => t.true(isPrimitive(undefined)));
test("null is primitive", t => t.true(isPrimitive(null)));
test("empty string is primitive", t => t.true(isPrimitive("")));
test("string is primitive", t => t.true(isPrimitive("x")));
test("0 is primitive", t => t.true(isPrimitive(0)));
test("number is primitive", t => t.true(isPrimitive(5)));
test("boolean true is primitive", t => t.true(isPrimitive(true)));
test("boolean false is primitive", t => t.true(isPrimitive(false)));
test("ref is primitive", t => t.true(isPrimitive({ $type: "ref" })));
test("atom is primitive", t => t.true(isPrimitive({ $type: "atom" })));
test("error is primitive", t => t.true(isPrimitive({ $type: "error" })));
test("object is not primitive", t => t.false(isPrimitive({})));
test("array is not primitive", t => t.false(isPrimitive([])));

test("ref is graph primitive", t => t.true(isGraphPrimitive({ $type: "ref" })));
test("atom is graph primitive", t => t.true(isGraphPrimitive({ $type: "atom" })));
test("error is graph primitive", t => t.true(isGraphPrimitive({ $type: "error" })));
test("undefined is not graph primitive", t => t.false(isGraphPrimitive(undefined)));
test("null is not graph primitive", t => t.false(isGraphPrimitive(null)));
test("JS primitive is not graph primitive", t => t.false(isGraphPrimitive("x")));
test("object is not graph primitive", t => t.false(isGraphPrimitive({})));
test("array is not graph primitive", t => t.false(isGraphPrimitive([])));

test("atom is atom", t => t.true(isAtom({ $type: "atom" })));
test("non-atom is not atom", t => t.false(isAtom({ $type: "ref" })));
test("null is not atom", t => t.false(isAtom(null)));
test("object is not atom", t => t.false(isAtom({})));
test("primitive is not atom", t => t.false(isAtom(5)));

test("ref is ref", t => t.true(isRef({ $type: "ref" })));
test("non-ref is not ref", t => t.false(isRef({ $type: "atom" })));
test("null is not ref", t => t.false(isRef(null)));
test("object is not ref", t => t.false(isRef({})));
test("primitive is not ref", t => t.false(isRef(5)));

test("error is error", t => t.true(isError({ $type: "error" })));
test("non-error is not error", t => t.false(isError({ $type: "atom" })));
test("null is not error", t => t.false(isError(null)));
test("object is not error", t => t.false(isError({})));
test("primitive is not error", t => t.false(isError(5)));
