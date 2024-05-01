import { FalsyType } from '../types/falsy';

export const filterBoolean = <T>(array: (T | FalsyType)[]): T[] =>
  array.filter(Boolean) as T[];
