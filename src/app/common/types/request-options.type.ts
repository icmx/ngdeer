export type RequestWithPath<P extends string> = {
  path: {
    [key in P]: string;
  };
};

export type RequestWithParams<P extends Record<string, string[] | string>> = {
  params?: P;
};
