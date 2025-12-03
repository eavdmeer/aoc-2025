#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day02');

if (process.argv[2])
{
  day02(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  debug('data:', data);

  let result = 0;

  const ranges = data[0]
    .split(',')
    .map(v => v.split('-'))
    .map(([ a, b ]) => [ Number(a), Number(b) ]);
  debug({ ranges });

  ranges.forEach(([ min, max ]) =>
  {
    for (let i = min; i <= max; i++)
    {
      const str = String(i);
      if (str.length % 2 === 0)
      {
        const s1 = str.substring(0, str.length / 2);
        const s2 = str.substring(str.length / 2);

        if (s1 === s2) { result += i; }
      }
    }
  });

  return result;
}

function solve2(data)
{
  debug('data:', data);

  let result = 0;

  const ranges = data[0]
    .split(',')
    .map(v => v.split('-'))
    .map(([ a, b ]) => [ Number(a), Number(b) ]);
  debug({ ranges });

  ranges.forEach(([ min, max ]) =>
  {
    for (let i = min; i <= max; i++)
    {
      const str = String(i);
      for (let l = 1; l <= str.length / 2; l++)
      {
        if (str.length % l) { continue; }
        const parts = Math.ceil(str.length / l);
        let allEqual = true;
        const cmp = str.substr(0, l);
        for (let i = 1, o = l; i < parts; ++i, o += l)
        {
          if (str.substr(o, l) !== cmp)
          {
            allEqual = false;
            break;
          }
        }

        if (allEqual)
        {
          result += i;
          break;
        }
      }
    }
  });

  return result;
}

export default async function day02(target)
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
  const expect1a = 1227775554;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 13108371860;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 4174379265;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 22471660255;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day02', part1, part2, duration: performance.now() - start };
}
