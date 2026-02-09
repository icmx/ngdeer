export const toUnique = <T>(
  extractor: (value: T) => unknown = (value) => value,
): ((value: T) => boolean) => {
  const ids = new Set<unknown>();

  return (value) => {
    const id = extractor(value);

    if (ids.has(id)) {
      return false;
    }

    ids.add(id);

    return true;
  };
};
