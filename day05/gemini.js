import { readFile } from 'fs/promises';

/**
 * Efficiently calculates the total number of unique integers by merging
 * overlapping ranges. The time complexity is O(N log N), where N is the
 * number of ranges.
 * @param {Array<Array<number>>} ranges - An array of [start, end] integer
 * pairs.
 * @returns {number} The total count of unique integers.
 */
function findUniqueIntegersEfficiently(ranges)
{
  if (!ranges || ranges.length === 0)
  {
    return 0;
  }

  // 1. Sort the ranges based on the starting number. This is crucial
  // for enabling the linear-time merging process.
  const sortedRanges = ranges.sort((a, b) => a[0] - b[0]);

  const mergedRanges = [];
  // Initialize the merging process with the first range
  let currentMergedRange = sortedRanges[0];

  // 2 & 3. Iterate through the remaining ranges and merge overlaps
  for (let i = 1; i < sortedRanges.length; i++)
  {
    const nextRange = sortedRanges[i];

    const [ currentStart, currentEnd ] = currentMergedRange;
    const [ nextStart, nextEnd ] = nextRange;

    // Check for overlap or adjacency (e.g., [5, 7] and [8, 10] merge)
    if (nextStart <= currentEnd + 1)
    {
      // Merge by extending the end of the current merged range to the
      // maximum end seen so far
      currentMergedRange[1] = Math.max(currentEnd, nextEnd);
    }
    else
    {
      // No overlap. Push the complete range and start a new merged range.
      mergedRanges.push(currentMergedRange);
      currentMergedRange = nextRange;
    }
  }

  // The final range being constructed must be added to the result list
  mergedRanges.push(currentMergedRange);

  // 4. Calculate Total Count
  let totalCount = 0;
  // Sum the counts of integers in each disjoint merged range.
  // Count for [start, end] is (end - start + 1).
  mergedRanges.forEach(range => totalCount += range[1] - range[0] + 1);

  // Print the resulting disjoint ranges and the final count.
  console.log(`Total count of unique integers (Efficient): ${totalCount}`);

  return totalCount;
}

/**
 * Executes a function and measures its runtime in milliseconds.
 * @param {function} func - The function to execute.
 * @param {Array<any>} args - Arguments to pass to the function.
 */
function executeAndMeasureTime(func, args)
{
  // Use high-resolution timer for precise measurement
  const start = process.hrtime.bigint();

  // Call the function
  func(args);

  const end = process.hrtime.bigint();

  // Convert nanoseconds to milliseconds (1 million nanoseconds = 1 ms)
  const runtimeMs = Number(end - start) / 1e6;

  console.log(`Runtime: ${runtimeMs} ms`);
}

// --- Execution ---
const content = await readFile(process.argv[2]);

const ranges = content
  .toString()
  .split('\n\n')
  .at(0)
  .split('\n')
  .map(v => v.split('-').map(Number));

executeAndMeasureTime(findUniqueIntegersEfficiently, ranges);
