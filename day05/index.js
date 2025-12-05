#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day05');

if (process.argv[2])
{
  day05(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  const [ ranges, products ] = data;

  return products
    .filter(v => ranges
      .some(([ min, max ]) => v >= min && v <= max)).length;
}

function solve2(data)
{
  const [ ranges ] = data;

  const sorted = ranges.toSorted((a, b) => a[0] - b[0]);

  let [ cl, cr ] = sorted.shift();
  const joined = [];
  while (sorted.length)
  {
    const [ l, r ] = sorted.shift();
    if (r < cl || l > cr)
    {
      // debug('Entirely to the left or right.');
      joined.push([ cl, cr ]);
      cl = l; cr = r;
    }
    else
    {
      cl = l < cl && (l < cl || r > cr) ? l : cl;
      cr = r > cr && (l < cl || r > cr) ? r : cr;
    }
  }

  // Push the block we were working on
  joined.push([ cl, cr ]);

  return joined.reduce((a, [ l, r ]) => a + 1 + r - l, 0);
}

export default async function day05(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split('\n\n')
    .map(v => v
      .split(/\s*\n\s*/)
      .map(w => w.includes('-') ?
        w.split('-').map(Number) :
        Number(w))
    );

  const part1 = solve1(data);
  const expect1a = 3;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 563;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 14;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 338693411431456;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day05', part1, part2, duration: performance.now() - start };
}
