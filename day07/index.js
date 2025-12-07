#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day07');

if (process.argv[2])
{
  day07(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  let beams = [ data[0].indexOf('S') ];

  let splits = 0;

  for (let r = 1; r < data.length; r++)
  {
    beams = beams.map(c => data[r].charAt(c) === '^' ?
      [ c - 1, c + 1 ] :
      c);
    splits += beams.reduce((a, v) => a + (v.length ? 1 : 0), 0);
    beams = beams.flat().filter((v, i, a) => a.indexOf(v) === i);
  }

  return splits;
}

const cache = new Map();

function solve2(data, row = 0, col = data[0].indexOf('S'))
{
  debug({ row, col, ch: data[row]?.charAt(col) });

  const key = row * data[0].length + col;
  if (cache.has(key)) { return cache.get(key); }

  if (row >= data.length) { return 1; }

  const result = data[row].charAt(col) === '^' ?
    solve2(data, row + 1, col - 1) +
      solve2(data, row + 1, col + 1) :
    solve2(data, row + 1, col);

  cache.set(key, result);

  return result;
}

export default async function day07(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);

  const part1 = solve1(data);
  const expect1a = 21;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1524;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 40;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 32982105837605;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day07', part1, part2, duration: performance.now() - start };
}
