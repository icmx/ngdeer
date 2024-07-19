export type Comment = {
  id: string;
  rootId: null | string;
  postId: string;
  branch: null | Comment[];
  branchSize: null | number;
  username: string
  timestamp: number;
  text: string;
};
