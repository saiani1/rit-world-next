export type ReleaseNoteType = {
  id: string;
  update_at: string;
  type: ("ADDED" | "CHANGED" | "FIXED")[];
  description: string;
  version: string;
};
