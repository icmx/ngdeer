export const EXCLUDE_FALSY = [undefined, null, false, 0, ''];

export type ToParamsOptions = {
  exclude?: unknown[];
};

export const toParams = <T extends Record<string, unknown>>(
  record: T,
  options?: ToParamsOptions,
): Partial<T> => {
  const exclude = options?.exclude || EXCLUDE_FALSY;

  const entries = Object.entries(record).filter(([, value]) => {
    return !exclude.includes(value);
  });

  return Object.fromEntries(entries) as Partial<T>;
};
