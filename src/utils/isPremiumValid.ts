export function isPremiumValid(unixTimestamp: number) {
  const currentUnixTime = Date.now();
  return currentUnixTime < unixTimestamp;
}
