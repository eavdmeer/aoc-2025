import fs from 'fs/promises';

/**
 * Calculates the total sum of all numbers within the specified ranges
 * that are formed by repeating a sequence of digits at least twice (R >= 2).
 * * @returns {string} The total sum as a string (since it's a BigInt).
 */
async function calculateRepeatedSequenceSum(fileName)
{
  // Input string for the comma-separated ranges
  const content = await fs.readFile(fileName);
  const rangesStr = content.toString();

  // 1. Parse the ranges using BigInt
  const ranges = rangesStr.split(',').map(rangeStr =>
  {
    const [ startStr, endStr ] = rangeStr.split('-');
    return { start: BigInt(startStr), end: BigInt(endStr) };
  });

  const maxVal = ranges.reduce((max, range) => range.end > max ? range.end : max, 0n);

  // Set to store unique found numbers (BigInts)
  const foundNumbers = new Set();

  // 2. Iterate and find all unique repeated-sequence numbers
  // R = repetition count, k = sequence length
  for (let R = 2; R <= 10; R++)
  {
    for (let k = 1; k <= Math.floor(10 / R); k++)
    {

      // Calculate min/max sequence values for sequence S
      const minSValue = BigInt(10) ** BigInt(k - 1);
      const maxSValue = BigInt(10) ** BigInt(k) - 1n;

      for (let sValue = minSValue; sValue <= maxSValue; sValue++)
      {
        // Construct N by repeating the string representation of S
        const nValue = BigInt(sValue.toString().repeat(R));

        if (nValue > maxVal)
        {
          break;
        }

        // Check if nValue is in any of the ranges
        for (const range of ranges)
        {
          if (nValue >= range.start && nValue <= range.end)
          {
            foundNumbers.add(nValue);
            break;
          }
        }
      }
    }
  }

  // 3. Calculate the total sum of the unique found numbers
  let totalSum = 0n;
  for (const num of foundNumbers)
  {
    totalSum += num;
  }

  // Return the total sum as a string
  return totalSum.toString();
}

// Execute and log the result
const start = performance.now();
console.log(await calculateRepeatedSequenceSum(process.argv[2]));
console.log('Duration:', performance.now() - start);
