#!/usr/bin/env node

import * as fs from 'fs/promises';
import makeDebug from 'debug';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import rref from './rref.js';

const debug = makeDebug('day10');

if (process.argv[2])
{
  day10(process.argv[2])
    .then(console.log);
}

function solve1(data)
{
  const result = data.map(({ lights, buttons }) =>
  {
    const target = parseInt(
      lights.split('').reverse().map(v => v === '.' ? 0 : 1).join('')
      , 2);

    const myButtons = buttons.map(button =>
    {
      const num = Array.from({ length: 16 }, () => 0);
      button.forEach(v => num[15 - v] = 1);
      return parseInt(num.join(''), 2);
    });

    const queue = new MinPriorityQueue(v => v.presses.length);

    queue.push({ value: 0, presses: [] });
    const seen = new Set();

    while (queue.size())
    {
      const { value, presses } = queue.dequeue();

      if (value === target) { return presses.length; }

      if (seen.has(value)) { continue; }
      seen.add(value);

      myButtons.forEach((b, i) =>
      {
        queue.push({ value: value ^ b, presses: [ ...presses, i ] });
      });
    }
    return -1;
  });

  return result.reduce((a, v) => a + v, 0);
}

const same = (a, b) => a.every((x, i) => b[i] === x);

function transpose(matrix)
{
  // Pre-allocate the result array to the correct size
  const transposed = new Array(matrix[0].length);

  for (let j = 0; j < matrix[0].length; j++)
  {
    transposed[j] = new Array(matrix.length);
    for (let i = 0; i < matrix.length; i++)
    {
      transposed[j][i] = matrix[i][j];
    }
  }

  return transposed;
}

function solve2Alt(data)
{
  debug({ data });

  const vars = [ 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

  const result = data.slice(0, 1).map(({ buttons, jolts }) =>
  {
    debug({ buttons });
    const buttonVectors = buttons.map(vals =>
      vals.reduce((a, v) => { a[v] = 1; return a; }, jolts.map(() => 0)));
    const equations = transpose(buttonVectors);

    jolts.forEach((v, i) => equations[i].push(v));

    debug('equations');
    debug(equations.map(row => row.map(val =>
      val.toFixed(0).padStart(5)).join(' ')).join('\n'));

    const R = rref(equations);

    debug('Reduced Row Echelon Form');
    debug(R.map(row => row.map(val =>
      val.toFixed(0).padStart(5)).join(' ')).join('\n'));

    const lastRow = R.map(v => v.at(-1));
    debug({ lastRow });
    const free = [];
    const pivot = [];
    const freeVars = new Map();
    for (let c = 0; c < R[0].length - 1; c++)
    {
      const col = R.map(v => v[c]);
      const solved = col.filter(v => v !== 0).length === 1;
      debug({ col, solved });
      if (! solved)
      {
        free.push(c);
        freeVars.set(c, vars.shift());
      }
      else
      {
        pivot.push(c);
      }
    }
    debug({ pivot, free, freeVars });
    const sum = [];
    R.forEach(row =>
    {
      const parts = [ row.at(-1) ];
      free.forEach(idx =>
      {
        if (row[idx] !== 0)
        {
          const n = row[idx];
          parts.push(`${n < 0 ? '+' : '-'}${Math.abs(n)} * ${freeVars.get(idx)}`);
        }
      });
      sum.push(parts);
    });
    debug(sum);
    debug({ sum: sum.map(v => v.join(' ')).join('+') });

    const s = 3;
    const t = 2;
    debug({ s, t, count: eval(sum.map(v => v.join(' ')).join('+')) });

    return 0;
  });

  debug({ result });

  return result.reduce((a, v) => a + v, 0);
}

function solve2(data, method = 1)
{
  if (method === 2)
  {
    return solve2Alt(data);
  }

  const result = data.map(({ buttons, jolts }) =>
  {
    const queue = new MinPriorityQueue(v => v.presses.length);

    queue.push({ values: jolts.map(() => 0), presses: [] });
    const seen = new Set();

    while (queue.size())
    {
      debug(queue.toArray());
      const { values, presses } = queue.dequeue();

      if (same(values, jolts)) { return presses.length; }

      const key = values.join('-');
      if (seen.has(key)) { continue; }
      seen.add(key);

      buttons.forEach((b, i) =>
      {
        const newValues = [ ...values ];
        b.forEach(idx => newValues[idx] += 1);
        if (newValues.every((n, i) => n <= jolts[i]))
        {
          queue.push({ values: newValues, presses: [ ...presses, i ] });
        }
      });
    }
    return -1;
  });

  return result.reduce((a, v) => a + v, 0);
}

export default async function day10(target)
{
  const start = performance.now();
  debug('starting');

  const buffer = await fs.readFile(target);

  const data = buffer
    .toString()
    .trim()
    .split(/\s*\n\s*/)
    .filter(v => v)
    .map(v => v.split(' '))
    .map(v => ({
      lights: v.shift().replace('[', '').replace(']', ''),
      jolts: v.pop().replace(/[{}]/g, '').split(',').map(Number),
      buttons: v.map(w => w.replace(/[()]/g, '').split(',').map(Number)) }));

  const part1 = solve1(data);
  const expect1a = 7;
  if (target.includes('example') && part1 !== expect1a)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1a}`);
  }
  const expect1b = 396;
  if (target === 'data.txt' && part1 !== expect1b)
  {
    throw new Error(`Invalid part 1 solution: ${part1}. Expecting; ${expect1b}`);
  }

  const part2 = solve2(data);
  const expect2a = 33;
  if (target.includes('example') && part2 !== expect2a)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2a}`);
  }
  const expect2b = 0;
  if (target === 'data.txt' && part2 !== expect2b)
  {
    throw new Error(`Invalid part 2 solution: ${part2}. Expecting; ${expect2b}`);
  }

  return { day: 'day10', part1, part2, duration: performance.now() - start };
}
