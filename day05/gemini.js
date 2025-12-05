import { readFile } from 'fs/promises';

/**
 * Efficiently calculates the total number of unique integers by merging
 * overlapping ranges.
 * Time Complexity: O(N log N) due to sorting, where N is the number of
 * ranges.
 * @param {Array<Array<number>>} ranges - An array of [start, end] integer
 * pairs.
 * @returns {number} The total count of unique integers.
 */
const findUniqueIntegersEfficiently = ranges =>
{
  if (!ranges || ranges.length === 0)
  {
    return 0;
  }

  // 1. Sort the ranges by their starting number (ascending)
  const sortedRanges = ranges.sort((a, b) => a[0] - b[0]);

  const mergedRanges = [];
  let currentMergedRange = sortedRanges[0];

  // 2 & 3. Iterate and Merge
  for (let i = 1; i < sortedRanges.length; i++)
  {
    const nextRange = sortedRanges[i];

    const [ currentStart, currentEnd ] = currentMergedRange;
    const [ nextStart, nextEnd ] = nextRange;

    // Check for overlap or adjacency (nextStart <= currentEnd + 1)
    if (nextStart <= currentEnd + 1)
    {
      // Merge by extending the end of the current merged range
      // currentMergedRange is still a reference to the array inside mergedRanges (or the initial one).
      currentMergedRange[1] = Math.max(currentEnd, nextEnd);
    }
    else
    {
      // No overlap, the current merged range is finished. Start a new one.
      mergedRanges.push(currentMergedRange);
      currentMergedRange = nextRange;
    }
  }

  // Ensure the final range is added to the result list
  mergedRanges.push(currentMergedRange);

  // 4. Calculate Total Count
  let totalCount = 0;
  mergedRanges.forEach(range =>
  {
    // Count is (End - Start + 1)
    totalCount += range[1] - range[0] + 1;
  });

  // Example output for clarity (template-curly-spacing applied)
  console.log(`Total count of unique integers (Efficient): ${totalCount}`);

  return totalCount;
};

const content = await readFile(process.argv[2]);

const ranges = content
  .toString()
  .split('\n\n')
  .at(0)
  .split('\n')
  .map(v => v.split('-').map(Number));

const start = performance.now();
findUniqueIntegersEfficiently(ranges);
console.log(`Time spent: ${performance.now() - start}ms`);
