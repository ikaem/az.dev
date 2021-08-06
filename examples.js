import DataLoader from 'dataloader';

const userLoader = new DataLoader((userIds) => {
  // this is a batch-loading function
  // it accepts an array of ids
  return getUsersByIds(userIds);
});

// these two functions will be batched into a single SQL statemnt becuase they happen in the same frame of execution - in the same tick
const promiseA = userLoader.load(1);
const promiseB = userLoader.load(2);

// something else happens here

// this call will have Dataloader use a memoization cache of .load() calls
// because user 1 has already been fetched from the database
const promiseC = userLoader.load(3);
