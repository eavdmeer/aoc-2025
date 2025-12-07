import { readFile } from 'fs/promises';

/**
 * Calculates the number of possible paths a tachyon beam can take
 * through the grid using dynamic programming.
 *
 * The beam starts at 'S' and moves only downward.
 * - Empty space ('.') or 'S': beam continues directly down.
 * - Splitter ('^'): beam splits to the immediate left and right cells.
 */
function calculatePaths(grid)
{
  const M = grid.length;
  const N = grid[0].length;

  // Initialize the paths table P[r][c]
  const P = Array(M).fill(0).map(
    () => Array(N).fill(0)
  );

  // 1. Base Case: Find 'S' and set initial path count
  const startC = grid[0].indexOf('S');
  P[0][startC] = 1;

  // 2. Dynamic Programming
  for (let r = 1; r < M; r++)
  {
    for (let c = 0; c < N; c++)
    {
      let paths = 0;
      const cellAbove = grid[r - 1][c];

      // A. Direct Travel (if space above is '.' or 'S')
      // This is for the beam coming down from (r-1, c) to (r, c).
      if (cellAbove === '.' || cellAbove === 'S')
      {
        paths += P[r - 1][c];
      }

      // B. Splitter from Right (Splitter at r-1, c+1 splits left)
      if (c < N - 1 && grid[r - 1][c + 1] === '^')
      {
        paths += P[r - 1][c + 1];
      }

      // C. Splitter from Left (Splitter at r-1, c-1 splits right)
      if (c > 0 && grid[r - 1][c - 1] === '^')
      {
        paths += P[r - 1][c - 1];
      }

      P[r][c] = paths;
    }
  }

  // 3. Final Result
  return P[M - 1].reduce((a, v) => a + v, 0);
}

const startTime = performance.now();
const content = await readFile(process.argv[2]);
const grid = content.toString().split('\n');
const count = calculatePaths(grid);
const endTime = performance.now();

console.log(`Total number of possible paths: ${count}`);
console.log(`Run Time: ${endTime - startTime} milliseconds`);
