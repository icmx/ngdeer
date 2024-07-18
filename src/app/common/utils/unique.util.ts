export type UniqueOptions<T> = {
  by?: (value: T) => unknown;
};

export type UniqueResult<T> = (value: T) => boolean;

export const unique = <T>({
  by = (value) => value,
}: UniqueOptions<T>): UniqueResult<T> => {
  const valuesByIds = new Map<unknown, T>();

  return (value: T) => {
    const identifier = by(value);

    if (valuesByIds.has(identifier)) {
      return false;
    }

    valuesByIds.set(identifier, value);

    return true;
  };
};
