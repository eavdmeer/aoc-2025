class DisjointSetUnion
{
  #parent;

  #setSize;

  constructor(size)
  {
    // Initialize with private class fields
    this.#parent = Array.from({ length: size }, (_, i) => i);
    this.#setSize = Array.from({ length: size }, () => 1);
  }

  // Find set containing i
  #find(i)
  {
    if (this.#parent[i] === i) { return i; }

    // Path Compression is applied recursively
    this.#parent[i] = this.#find(this.#parent[i]);

    return this.#parent[i];
  }

  // Merges the sets containing i and j.
  union(i, j)
  {
    let rootI = this.#find(i);
    let rootJ = this.#find(j);

    if (rootI !== rootJ)
    {
      // Union by Size: Attach smaller tree to the root
      // of the larger tree.
      if (this.#setSize[rootI] < this.#setSize[rootJ])
      {
        [ rootI, rootJ ] = [ rootJ, rootI ];
      }

      this.#parent[rootJ] = rootI;
      this.#setSize[rootI] += this.#setSize[rootJ];

      return true;
    }

    // Already in the same set
    return false;
  }

  // Public method for finding the root.
  find(i)
  {
    return this.#find(i);
  }

  // Checks if elements i and j are in the same set.
  connected(i, j)
  {
    return this.#find(i) === this.#find(j);
  }

  // Returns the size of the set containing i.
  getSize(i)
  {
    return this.#setSize[this.#find(i)];
  }
}

/* --- Example Usage --- */
/*
console.log('--- Start Example ---');
const dsu = new DisjointSetUnion(10);

dsu.union(1, 2);
dsu.union(3, 4);
dsu.union(1, 4);

console.log('Is 2 connected to 3?', dsu.connected(2, 3));
console.log('Root of 2:', dsu.find(2));
console.log('Size of set containing 3:', dsu.getSize(3));

console.log('--- End Example ---');
*/

export default DisjointSetUnion;
