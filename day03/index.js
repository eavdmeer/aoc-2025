#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day03');

if (process.argv[2])
{
  day03(process.argv[2])
    .then(console.log);
}

const reducer = (jolts, bank, blen, count) =>
{
  const digits = [];
  let curr = 0;

  while (digits.length < count)
  {
    let max = bank[curr];
    for (let i = curr; i < blen - count + 1 + digits.length; i++)
    {
      if (bank[i] > max)
      {
        curr = i;
        max = bank[i];
      }
    }
    digits.push(max);
    curr++;
  }

  return jolts + Number(digits.join(''));
};

function solve1(data)
{
  return data
    .reduce((jolts, bank) => reducer(jolts, bank, data[0].length, 2), 0);
}

function solve2(data)
{
  return data
    .reduce((jolts, bank) => reducer(jolts, bank, data[0].length, 12), 0);
}

export default async function day03(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split('').map(n => Number(n)));

  const part1 = solve1(data);
  const expect1a = 357;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 17244;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 3121910778619;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 171435596092638;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day03', part1, part2, duration: performance.now() - start };
}
