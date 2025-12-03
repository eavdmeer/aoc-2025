import * as fs from 'fs/promises';

/**
 * Program to find the highest 12-digit number from a sequence
 * and calculate the sum of the results using a greedy approach.
 * * Uses BigInt for safe calculation of large numbers.
 */

// --- Input Sequences ---
const content = await fs.readFile(process.argv[2]);
const numberSequences = content.toString().split('\n');

/*
const numberSequences = [
  '987654321111111',
  '811111111111119',
  '234234234234278',
  '818181911112111'
];
*/

const targetLength = 12;

/**
 * Finds the largest possible number of a specified length that can be formed
 * by selecting digits from the input sequence while maintaining their
 * relative order.
 * This uses a greedy algorithm.
 * * @param {string} sequence The input string of digits.
 * @param {number} length The required length of the output number.
 * @returns {string} The highest number string of the target length.
 */
function findLargestNumber(sequence, length)
{
  let resultDigits = '';
  // The index in the sequence to start searching from
  let startIndex = 0;

  // Loop until we have selected the required number of digits
  for (let digitsNeeded = length; digitsNeeded > 0; digitsNeeded--)
  {

    // Calculate the maximum index we can search up to.
    // We must ensure that after picking a digit at this index, there are
    // still enough characters remaining in the sequence to pick the rest of
    // the digits.
    // sequence.length - digitsNeeded is the number of characters we can skip
    const maxSearchIndex = sequence.length - digitsNeeded;

    let maxDigit = '-1';
    let maxIndex = -1;

    // Search the current window for the largest digit
    // We iterate from our current position (startIndex) up to the calculated
    // limit (maxSearchIndex)
    for (let i = startIndex; i <= maxSearchIndex; i++)
    {
      const currentDigit = sequence[i];

      if (currentDigit > maxDigit)
      {
        maxDigit = currentDigit;
        maxIndex = i;

        // Optimization: If we find the highest possible digit (9), we can
        // stop searching the current window immediately and select it.
        if (maxDigit === '9')
        {
          break;
        }
      }
    }

    // Append the largest digit found in the window
    resultDigits += maxDigit;

    // Update the starting index for the next search to be immediately after the digit we just picked
    startIndex = maxIndex + 1;
  }

  return resultDigits;
}

/**
 * Main function to process the sequences, find the largest numbers, and calculate their sum.
 */
function solveOptimization()
{
  console.log(`--- Highest ${targetLength}-Digit Number Selector ---`);
  console.log(`Target Number Length: ${targetLength}\n`);

  let totalSum = BigInt(0);
  const results = [];

  for (const sequence of numberSequences)
  {
    if (sequence.length < targetLength)
    {
      console.error(`Error: Sequence "${sequence}" is too short (length ${sequence.length}). Skipping.`);
      continue;
    }

    // 1. Find the largest number string
    const highestNumberString = findLargestNumber(sequence, targetLength);

    // 2. Convert to BigInt and add to the total sum
    const highestNumberBigInt = BigInt(highestNumberString);
    totalSum += highestNumberBigInt;

    results.push({
      input: sequence,
      result: highestNumberString,
      bigInt: highestNumberBigInt.toString()
    });
  }

  console.log('--- Calculation Results ---');
  results.forEach((r, index) =>
  {
    console.log(`\nSequence ${index + 1}: ${r.input}`);
    console.log(`\tHighest ${targetLength}-Digit Number: ${r.result}`);
    // For clarity, show the BigInt conversion
    console.log(`\tBigInt Value: ${r.bigInt}`);
  });

  console.log('\n==================================');
  console.log(`SUM of all ${targetLength}-Digit Numbers (BigInt):`);
  console.log(`${totalSum.toString()}`);
  console.log('==================================');
}

// Execute the main function
const start = performance.now();
solveOptimization();
console.log('Duration:', performance.now() - start, 'ms');
