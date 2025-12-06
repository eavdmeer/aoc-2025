#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day06');

if (process.argv[2])
{
  day06(process.argv[2])
    .then(console.log);
}

const runop = (a, op, b) => op === '*' ? a * b : a + b;

function solve1(data)
{
  const ldata = data.map(v => v.trim()
    .split(/\s+/).map(n => /^\d+$/.test(n) ? Number(n) : n));

  const [ ops, numbers ] = [ ldata.pop(), ldata ];

  return numbers
    .reduce((a, row) => a.map((v, i) =>
      runop(v, ops[i], row[i])), numbers.shift())
    .reduce((a, v) => a + v, 0);
}

// Source - https://stackoverflow.com/a/73246941
// Posted by NoOorZ24, modified by community. See post 'Timeline' for change
// history
// Retrieved 2025-12-06, License - CC BY-SA 4.0
function intersect(a, b)
{
  const setA = new Set(a);
  return b.filter(value => setA.has(value));
}

function transpose(mat)
{
  return mat.reduce((prev, next) =>
    next.map((item, i) => (prev[i] || []).concat(next[i])), []);
}

const allIndexesOf = (ch, str) =>
{
  const result = [];
  for(let i = 0; i < str.length; i++)
  {
    if (str[i] === ch) { result.push(i); }
  }
  return result;
};

function solve2(data, method = 1)
{
  const ops = data.pop().split(/\s+/);

  if (method === 2)
  {
    // eslint-disable-next-line no-eval
    return eval(transpose(data.map(v => v.split('')))
      .map(v => v.join(''))
      .join('\n')
      .split(/\n\s+\n/)
      .map((v, i) => v.replace(/\s*\n\s*/g, ops[i]))
      .join('+'));
  }

  // Find indices of empty columns
  const empty = data
    .reduce((a, line) => a === null ? allIndexesOf(' ', line) :
      intersect(a, allIndexesOf(' ', line)), null);
  empty.unshift(-1);
  empty.push(data[0].length);

  const numbers = data.map(line =>
  {
    const result = [];
    for (let i = 0; i < empty.length - 1; i++)
    {
      result.push(line.substring(empty[i] + 1, empty[i + 1]));
    }
    return result;
  });

  return transpose(numbers).reduce((a, col, i) =>
  {
    const op = ops[i];
    let result = op === '*' ? 1 : 0;
    for (let i = 0; i < col[0].length; i++)
    {
      result = runop(result, op, Number(col.map(v => v.charAt(i)).join('')));
    }
    return a + result;
  }, 0);
}

export default async function day06(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .split('\n')
    .filter(v => v);

  const part1 = solve1(data);
  const expect1a = 4277556;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 5171061464548;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 3263827;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 10189959087258;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day06', part1, part2, duration: performance.now() - start };
}
