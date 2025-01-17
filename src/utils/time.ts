/**
 * Turns an amount of time as a number (in ms) to a time string
 * @param duration The number of ms
 * @returns The amount of time as "n seconds" if duration < 60000, ""
 */
export const formatDuration = (duration: number): string => {
  // Convert the time to seconds
  duration /= 1000;
  // If it is less than a minute
  if (duration < 60) {
    const d = Math.floor(duration);
    return `${d.toString()} second${d > 1 ? 's' : ''}`;
  }

  // Convert the time to minutes
  duration /= 60;
  // If it is less than an hour
  if (duration < 60) {
    const d = Math.floor(duration);
    return `${d.toString()} minute${d > 1 ? 's' : ''}`;
  }

  // Convert the time to hours
  duration /= 60;
  // If it is less than a day
  if (duration < 24) {
    const d = Math.floor(duration);
    return `${d.toString()} hour${d > 1 ? 's' : ''}`;
  }

  // Convert the time to days
  duration /= 24;
  const d = Math.floor(duration);
  return `${d.toString()} day${d > 1 ? 's' : ''}`;
}