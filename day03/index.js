#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day03');

if (process.argv[2])
{
  day03(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  return data
    .reduce((a, jolts) =>
    {
      const digits = [ 0, 0 ];
      for (let i = 0; i < jolts.length; i++)
      {
        if (i + 1 < jolts.length && jolts[i] > digits[0])
        {
          digits[0] = jolts[i];
          digits[1] = Math.max(...jolts.slice(i + 1));
        }
      }
      return a + 10 * digits[0] + digits[1];
    }, 0);
}

function solve2(data)
{
  debug({ data });

  const jlen = data[0].length;

  return data
    .reduce((a, jolts) =>
    {
      const digits = [];
      let curr = 0;

      while (digits.length < 12)
      {
        const range = jolts.slice(curr, jlen - 11 + digits.length);
        let max = range[0];
        let idx = 0;
        for (let i = 0; i < range.length; i++)
        {
          if (range[i] > max)
          {
            idx = i;
            max = range[i];
          }
        }
        digits.push(max);
        curr += idx + 1;
      }

      return a + Number(digits.join(''));
    }, 0);
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
