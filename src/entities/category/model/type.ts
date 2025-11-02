export type CategoryType = {
  id: string;
  title: string;
  parent_id: string;
  depth: number;
  notice_ko?: string;
  notice_jp?: string;
};
