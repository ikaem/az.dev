// api\src\utils.js

import crypto from 'crypto';

export const randomString = (bytesSize = 32) =>
  crypto.randomBytes(bytesSize).toString('hex');

export const numbersInRangeObject = (begin, end) => {
  if (end < begin)
    throw Error(`Invalid range: ${end} is smaller than ${begin}`);

  let sum = 0;
  let count = 0;
  for (let i = begin; i <= end; i++) {
    sum += i;
    count++;
  }

  return { sum, count };
};

// api\src\utils.js
export const extractPrefixedColumns = ({ prefixedObject, prefix }) => {
  const prefixRexp = new RegExp(`^${prefix}_(.*)`);
  return Object.entries(prefixedObject).reduce(
    (acc, [key, value]) => {
      const match = key.match(prefixRexp);
      if (match) {
        // with this 1, we get only the part of the name without the prefix
        acc[match[1]] = value;
      }
      return acc;
    },
    // no values in the initial acc
    {}
  );
};
