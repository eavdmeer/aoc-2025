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

function solve1(operands, data)
{
  return data
    .reduce((a, row) => a.map((v, i) =>
      runop(v, operands[i], row[i])), data.shift())
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

function solve2(data)
{
  const operands = data.pop().split(/\s+/);

  const empty = data
    .reduce((a, line) => a === null ? allIndexesOf(' ', line) :
      intersect(a, allIndexesOf(' ', line)), null);
  empty.unshift(0);

  const numbers = data.map(line =>
  {
    const result = [];
    for (let i = 0; i < empty.length; i++)
    {
      result.push(line.substring(empty[i] ? 1 + empty[i] : 0,
        empty[i + 1] ?? line.length));
    }
    return result;
  });

  return transpose(numbers).reduce((a, col, i) =>
  {
    const op = operands[i];
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

  const orgdata = buffer
    .toString()
    .split('\n')
    .filter(v => v);

  const data = orgdata
    .map(v => v.trim().split(/\s+/).map(n => /^\d+$/.test(n) ? Number(n) : n));

  const input = [ data.pop(), data ];
  const part1 = solve1(...input);
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

  const part2 = solve2(orgdata);
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
