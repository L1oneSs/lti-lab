import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, normalize, tasks } from '../src/grading.mjs';
test('normalization and zero score', () => {
  assert.equal(normalize('  POST  '), 'post');
  assert.equal(grade({ q1: '', q2: '', q3: '' }).scoreGiven, 0);
});
test('maximum and partial result', () => {
  const answers = Object.fromEntries(tasks.map(t => [t.id, t.answer]));
  assert.equal(grade(answers).scoreGiven, 10);
  assert.equal(grade(answers).scoreMaximum, 10);
  answers.q2 = '__wrong__';
  assert.equal(grade(answers).scoreGiven, 7);
});
test('invalid answers cannot become grades', () => {
  assert.throws(() => grade({ q1: 'post', q2: 'object' }));
  assert.throws(() => grade({ q1: [], q2: 'object', q3: 'ags' }));
  assert.throws(() => grade({ q1: 'x'.repeat(201), q2: 'object', q3: 'ags' }));
});

test('HTML answers: case and surrounding whitespace do not affect the grade', () => {
  const result = grade({ q1: ' A ', q2: '\tIMG\n', q3: ' OL ' });
  assert.equal(result.scoreGiven, 10);
  assert.equal(result.scoreMaximum, 10);
});

test('HTML answers: brackets and attributes are not tag names', () => {
  assert.equal(grade({ q1: 'a', q2: '<img>', q3: 'ol' }).scoreGiven, 7);
  assert.equal(grade({ q1: 'a href', q2: 'img src', q3: '<ol>' }).scoreGiven, 0);
});

test('HTML answers: an unordered list is not an ordered list', () => {
  const result = grade({ q1: 'a', q2: 'img', q3: 'ul' });
  assert.equal(result.scoreGiven, 6);
  assert.deepEqual(result.items[2], { id: 'q3', correct: false, points: 0 });
});
