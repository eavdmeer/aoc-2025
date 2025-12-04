#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day04');

if (process.argv[2])
{
  day04(process.argv[2])
    .then(console.log);
}

function removable(data)
{
  const dirs = [
    [ -1, -1 ],
    [ -1, +0 ],
    [ -1, +1 ],
    [ +0, -1 ],
    [ +0, +1 ],
    [ +1, -1 ],
    [ +1, +0 ],
    [ +1, +1 ]
  ];

  const w = data[0].length;
  const h = data.length;

  const good = new Set();

  for (let r = 0; r < h; r++)
  {
    for (let c = 0; c < w; c++)
    {
      if (data[r]?.[c] === '.') { continue; }
      const rolls = dirs.reduce((a, [ dr, dc ]) =>
        a + (data[r + dr]?.[c + dc] === '@' ? 1 : 0), 0);
      if (rolls < 4)
      {
        good.add([ r, c ]);
      }
    }
  }

  return good;
}

function solve1(data)
{
  const good = removable(data);

  return good.size;
}

function solve2(data)
{
  let total = 0;
  let cleanup;

  do
  {
    cleanup = removable(data);
    total += cleanup.size;
    cleanup.forEach(([ r, c ]) => data[r][c] = '.');
  } while (cleanup.size > 0);

  return total;
}

export default async function day04(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(''));

  const part1 = solve1(data);
  const expect1a = 13;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1457;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 43;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 8310;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day04', part1, part2, duration: performance.now() - start };
}
