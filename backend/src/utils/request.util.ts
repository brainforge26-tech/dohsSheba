import { Request } from 'express';

/** Safely extracts a single string from req.params */
export const param = (req: Request, key: string): string =>
  Array.isArray(req.params[key]) ? (req.params[key] as any)[0] : (req.params[key] as string) ?? '';

/** Safely extracts a single string from req.query */
export const query = (req: Request, key: string): string | undefined => {
  const val = req.query[key];
  if (val === undefined) return undefined;
  return Array.isArray(val) ? String(val[0]) : String(val);
};

/** Safely extracts a number from req.query with a default */
export const queryNum = (req: Request, key: string, def: number): number => {
  const val = query(req, key);
  const num = val !== undefined ? Number(val) : NaN;
  return isNaN(num) ? def : num;
};
