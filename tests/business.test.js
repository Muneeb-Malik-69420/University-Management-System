import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grade, isValidAssessment, isValidFeeAmount, feeTotals } from '../shared/business.js';

test('grades include the exact lower boundary for each band', () => {
  for (const [score, expected] of [[0,'F'],[49.99,'F'],[50,'D'],[59.99,'D'],[60,'C'],[69.99,'C'],[70,'B'],[79.99,'B'],[80,'A'],[89.99,'A'],[90,'A+'],[100,'A+']]) {
    assert.equal(grade(score), expected, `score ${score}`);
  }
});
test('invalid grades cannot silently produce a passing grade', () => {
  for (const score of [-1,100.01,NaN,Infinity,-Infinity,'90',null,undefined]) {
    assert.throws(() => grade(score), RangeError);
  }
});
test('assessments allow zero, full marks, decimals and non-100 totals', () => {
  for (const result of [{marks:0,total:50},{marks:50,total:50},{marks:37.5,total:50},{marks:10000,total:10000}]) {
    assert.equal(isValidAssessment(result), true);
  }
  assert.equal(grade(37.5 / 50 * 100), 'B');
});
test('assessments reject impossible marks and invalid totals', () => {
  for (const result of [{marks:51,total:50},{marks:-1,total:100},{marks:0,total:0},{marks:1,total:-1},{marks:1,total:10001},{marks:NaN,total:100},{marks:1,total:Infinity},{marks:'80',total:100}]) {
    assert.equal(isValidAssessment(result), false);
  }
});
test('fees accept positive amounts up to the limit with at most two decimal places', () => {
  for (const amount of [0.01,0.29,1234.56,10000000]) assert.equal(isValidFeeAmount(amount), true);
  for (const amount of [0,-1,1.005,0.001,10000000.01,NaN,Infinity,'100',null]) assert.equal(isValidFeeAmount(amount), false);
});
test('fee totals reconcile paid and outstanding amounts without decimal drift', () => {
  const fees = [{amount:0.1,status:'Paid'},{amount:0.2,status:'Paid'},{amount:50.45,status:'Unpaid'}];
  const original = structuredClone(fees);
  assert.deepEqual(feeTotals(fees), {total:50.75,collected:0.3,outstanding:50.45});
  assert.deepEqual(fees, original);
});
test('empty, entirely unpaid and entirely paid fee ledgers reconcile', () => {
  assert.deepEqual(feeTotals([]), {total:0,collected:0,outstanding:0});
  assert.deepEqual(feeTotals([{amount:100,status:'Unpaid'}]), {total:100,collected:0,outstanding:100});
  assert.deepEqual(feeTotals([{amount:100,status:'Paid'}]), {total:100,collected:100,outstanding:0});
});
test('invalid fee records are rejected instead of corrupting totals', () => {
  for (const fee of [{amount:-10,status:'Unpaid'},{amount:1.005,status:'Paid'},{amount:100,status:'Unknown'}]) {
    assert.throws(() => feeTotals([fee]), RangeError);
  }
});
