
/**
 * Attempts to parse a string as a JSON object
 * @param object 
 * @returns 
 */
export const attemptJsonParse = (object: string | null): object | null => {
  if (typeof object !== 'string') return null;
  try {
    const parsed = JSON.parse(object);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    return null;
  }
  return null;
}