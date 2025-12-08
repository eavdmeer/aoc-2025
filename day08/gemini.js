import { readFile } from 'fs/promises';

/*
 * The following code implements Kruskal's algorithm to find the
 * Minimum Spanning Tree (MST) and identify the last (longest)
 * edge added, using a Disjoint Set Union (DSU) structure.
 */

const content = await readFile(process.argv[2]);
const COORDS = content
  .toString()
  .trim()
  .split('\n')
  .map(line => line.split(',').map(Number))
  .reduce((a, v, i) => { a[`p${i}`] = v; return a; }, {});

// Coordinates in (x, y, z) format
/*
const COORDS = {
  p00: [ 162, 817, 812 ], p01: [ 57, 618, 57 ],
  p02: [ 906, 360, 560 ], p03: [ 592, 479, 940 ],
  p04: [ 352, 342, 300 ], p05: [ 466, 668, 158 ],
  p06: [ 542, 29, 236 ], p07: [ 431, 825, 988 ],
  p08: [ 739, 650, 466 ], p09: [ 52, 470, 668 ],
  p10: [ 216, 146, 977 ], p11: [ 819, 987, 18 ],
  p12: [ 117, 168, 530 ], p13: [ 805, 96, 715 ],
  p14: [ 346, 949, 466 ], p15: [ 970, 615, 88 ],
  p16: [ 941, 993, 340 ], p17: [ 862, 61, 35 ],
  p18: [ 984, 92, 344 ], p19: [ 425, 690, 689 ]
};
*/

let parent;

/**
 * Calculates the 3D Euclidean distance between two points.
 * @param {number[]} p1 - The coordinates of the first point.
 * @param {number[]} p2 - The coordinates of the second point.
 * @return {number} The distance.
 */
function euclideanDistance(p1, p2)
{
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Finds the representative (root) of the set containing element i.
 * Implements path compression.
 * @param {number} i - The index of the element.
 * @return {number} The root of the set.
 */
function find(i)
{
  if (parent[i] === i)
  {
    return i;
  }

  parent[i] = find(parent[i]);

  return parent[i];
}

/**
 * Unites the sets containing elements i and j.
 * @param {number} i - The index of the first element.
 * @param {number} j - The index of the second element.
 * @return {boolean} True if a union occurred, False if they were
 * already in the same set (a cycle was formed).
 */
function union(i, j)
{
  const rootI = find(i);
  const rootJ = find(j);

  if (rootI !== rootJ)
  {
    parent[rootI] = rootJ;

    return true;
  }

  return false;
}

/**
 * Main function to run Kruskal's algorithm.
 */
function solveMST()
{
  console.time('MST Calculation');
  const labels = Object.keys(COORDS);
  const coordinates = Object.values(COORDS);
  const N = labels.length;

  // Initialize DSU parent array
  parent = Array.from({ length: N }, (v, i) => i);

  // 1. Calculate all distances (edges)
  const edges = [];
  for (let i = 0; i < N; i++)
  {
    for (let j = i + 1; j < N; j++)
    {
      const dist = euclideanDistance(coordinates[i], coordinates[j]);
      // Store: [distance, index_u, index_v]
      edges.push([ dist, i, j ]);
    }
  }

  // 2. Sort all edges by distance (ascending)
  edges.sort((a, b) => a[0] - b[0]);

  // 3. Kruskal's Algorithm to find the MST
  const mstEdges = [];
  let edgesCount = 0;
  for (const edge of edges)
  {
    const dist = edge[0];
    const u = edge[1];
    const v = edge[2];

    if (union(u, v))
    {
      // Store: [distance, label_u, label_v]
      mstEdges.push([ dist, labels[u], labels[v] ]);
      edgesCount++;
      // Stop when N-1 edges are found
      if (edgesCount === N - 1)
      {
        break;
      }
    }
  }

  // 4. Identify the last connected edge
  const lastEdge = mstEdges[mstEdges.length - 1];
  const maxDist = lastEdge[0];
  const pU = lastEdge[1];
  const pV = lastEdge[2];

  console.timeEnd('MST Calculation');

  console.log('The two points connected last are:');
  console.log(`${pU} and ${pV}`);
  console.log(`Distance: ${maxDist}`);
  console.log(`Solution: ${COORDS[pU][0] * COORDS[pV][0]}`);
}

solveMST();
