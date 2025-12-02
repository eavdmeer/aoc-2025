#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

const debug = makeDebug('day01');

const posmod = (v, n) => (v % n + n) % n;

if (process.argv[2])
{
  day01(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  debug('data:', data);
  let position = 50;
  let result = 0;

  data
    .map(v => Number(v.replace('L', '-').replace('R', '')))
    .forEach(d =>
    {
      position = posmod(position + d, 100);
      if (position === 0) { result++; }
    });

  return result;
}

function solve2(data)
{
  debug('data:', data);
  let position = 50;
  let result = 0;

  const clicks = data
    .map(v => [ v.substring(0, 1) === 'L' ? -1 : 1, Number(v.substring(1)) ]);

  clicks.forEach(([ delta, steps ]) =>
  {
    for (let i = 0; i < steps; i++)
    {
      position += delta;
      if (position === 100) { position = 0; }
      if (position === -1) { position = 99; }
      if (position === 0) { result++; }
    }
  });

  return result;
}

export default async function day01(target)
{
  const start = Date.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v);

  const part1 = solve1(data);
  const expect1a = 3;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 1011;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 6;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 5937;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day01', part1, part2, duration: Date.now() - start };
}
