#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day09');

if (process.argv[2])
{
  day09(process.argv[2])
    .then(console.log);
}

function solve1(areas)
{
  return areas[0][0];
}

function solve2(data, areas)
{
  debug({ data, areas });

  // Sides of the area
  const sides = data.map((p, i, a) =>
    [ p, a[i === data.length - 1 ? 0 : i + 1] ]);

  debug({ sides });

  const inRange = (a1, a2, b1, b2) =>
    !(a1 <= b1 && a1 <= b2 && a2 <= b1 && a2 <= b2) &&
      !(a1 >= b1 && a1 >= b2 && a2 >= b1 && a2 >= b2);

  const intersects = (p1, p2) => sides.some(([ s1, s2 ]) =>
    inRange(s1[1], s2[1], p1[1], p2[1]) &&
    inRange(s1[0], s2[0], p1[0], p2[0]));

  for (const [ size, p1, p2 ] of areas)
  {
    if (! intersects(p1, p2)) { return size; }
  }

  return 0;
}

export default async function day09(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(',').map(Number));

  const area = (p, q) =>
    (1 + Math.abs(p[0] - q[0])) * (1 + Math.abs(p[1] - q[1]));

  const areas = [];
  for (let i = 0; i < data.length; i++)
  {
    const p1 = data[i];
    for (let k = i + 1; k < data.length; k++)
    {
      const p2 = data[k];

      areas.push([ area(p1, p2), p1, p2 ]);
    }
  }
  areas.sort((a, b) => b[0] - a[0]);

  const part1 = solve1(areas);
  const expect1a = 50;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 4759531084;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data, areas);
  const expect2a = 24;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 1539238860;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day09', part1, part2, duration: performance.now() - start };
}
