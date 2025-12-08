#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';

import DisjointSetUnion from './dsu.js';

const debug = makeDebug('day08');

if (process.argv[2])
{
  day08(process.argv[2])
    .then(console.log);
}

// Google optimization using a disjoin set union for efficiently tracking
// edges.
function fsolve1(distances, data, count = 10)
{
  const dsu = new DisjointSetUnion(data.length);
  let tried = 0;

  for (const [ p1, p2 ] of distances)
  {
    dsu.union(p1, p2);
    tried++;
    // Stop when we have tried to connect 'count' points
    if (tried >= count)
    {
      break;
    }
  }

  // Collect the sizes of all sets (circuits)
  const rootSizes = new Map();
  for (let i = 0; i < data.length; i++)
  {
    const root = dsu.find(i);
    // The DSU's setSize array already holds the correct size for the root
    rootSizes.set(root, dsu.getSize(root));
  }

  // Sort the unique set sizes and calculate the product of the top 3
  const sortedSizes = [ ...rootSizes.values() ]
    .toSorted((a, b) => b - a);

  return sortedSizes
    .slice(0, 3)
    .reduce((a, v) => a * v, 1);
}

function fsolve2(distances, data)
{
  const dsu = new DisjointSetUnion(data.length);
  let lastEdge = null;

  for (const [ p1, p2 ] of distances)
  {
    // Union returns true if a merge actually happened.
    // We only care about the *last* edge that connects everything.
    if (dsu.union(p1, p2))
    {
      // After a successful union, check if everything is connected.
      // Everything is connected if the largest set size equals the
      // total number of data points.
      if (dsu.getSize(p1) === data.length)
      {
        lastEdge = [ p1, p2 ];
        break;
      }
    }
  }

  if (!lastEdge)
  {
    // Should not happen for a connected graph, but good practice.
    return 0;
  }

  // The result is based on the data associated with the points
  // of the last connected edge.
  return data[lastEdge[0]][0] * data[lastEdge[1]][0];
}
// End of Google optimization

const dist = (p, q) =>
  (p[0] - q[0]) ** 2 +
  (p[1] - q[1]) ** 2 +
  (p[2] - q[2]) ** 2;

function solve1(distances, data, count = 10, method = 2)
{
  if (method === 2)
  {
    return fsolve1(distances, data, count);
  }
  const connected = new Set();
  const circuits = [];
  let current = 0;

  const key = (p1, p2) => p1 << 16 | p2;

  while (connected.size < count)
  {
    const [ p1, p2 ] = distances[current++];
    const k = key(p1, p2);
    if (connected.has(k)) { continue; }
    connected.add(k);

    const havep1 = circuits.findIndex(v => v.includes(p1));
    const havep2 = circuits.findIndex(v => v.includes(p2));

    if (havep1 >= 0 && havep2 >= 0)
    {
      if (havep1 === havep2)
      {
        // Already in a circuit
        connected.add(k);
        continue;
      }
      // Connect two circuits into p1.
      circuits[havep1].push(...circuits[havep2]);
      // Remove p2.
      circuits.splice(havep2, 1);
    }
    else if (havep1 >= 0)
    {
      circuits[havep1].push(p2);
    }
    else if (havep2 >= 0)
    {
      circuits[havep2].push(p1);
    }
    else
    {
      circuits.push([ p1, p2 ]);
    }
  }

  return circuits
    .toSorted((a, b) => b.length - a.length)
    .slice(0, 3)
    .map(v => v.length)
    .reduce((a, v) => a * v, 1);
}

function solve2(distances, data, method = 2)
{
  if (method === 2)
  {
    return fsolve2(distances, data);
  }
  const connected = new Set();
  const circuits = [];
  let last;
  let current = 0;

  const key = (p1, p2) => p1 << 16 | p2;

  while (circuits[0]?.length !== data.length)
  {
    const [ p1, p2 ] = distances[current++];
    const k = key(p1, p2);
    if (connected.has(k)) { continue; }
    connected.add(k);

    const havep1 = circuits.findIndex(v => v.includes(p1));
    const havep2 = circuits.findIndex(v => v.includes(p2));

    if (havep1 >= 0 && havep2 >= 0)
    {
      if (havep1 === havep2)
      {
        // Already in a circuit
        connected.add(k);
        continue;
      }
      // Connect two circuits into p1.
      circuits[havep1].push(...circuits[havep2]);
      // Remove p2.
      circuits.splice(havep2, 1);
    }
    else if (havep1 >= 0)
    {
      circuits[havep1].push(p2);
    }
    else if (havep2 >= 0)
    {
      circuits[havep2].push(p1);
    }
    else
    {
      circuits.push([ p1, p2 ]);
    }
    last = [ p1, p2 ];
  }

  return data[last[0]][0] * data[last[1]][0];
}

export default async function day08(target)
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

  const t1 = performance.now();
  const distances = [];

  for (let i = 0; i < data.length; i++)
  {
    const p1 = data[i];
    for (let k = i + 1; k < data.length; k++)
    {
      const p2 = data[k];

      distances.push([ i, k, dist(p1, p2) ]);
    }
  }
  const t1a = performance.now();
  distances.sort((a, b) => a[2] - b[2]);
  const t2 = performance.now();

  const count = target.includes('example') ? 10 : 1000;
  const part1 = solve1(distances, data, count);
  const expect1a = 40;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 57970;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(distances, data);
  const expect2a = 25272;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 8520040659;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return {
    day: 'day08',
    part1,
    part2,
    duration: performance.now() - start,
    distances: t2 - t1,
    sort: t1a - t1
  };
}
