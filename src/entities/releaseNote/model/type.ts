export type ReleaseNoteType = {
  id: string;
  update_at: string;
  type: "ADDED" | "CHANGED";
  description: string;
  version: string;
};
