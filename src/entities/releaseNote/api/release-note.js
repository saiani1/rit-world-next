/**
 * 최신 릴리스 버전 조회
 */
const getLatestReleaseVersion = async (supabase) => {
  const { data: latestRelease } = await supabase
    .from("release_note")
    .select("version")
    .order("update_at", { ascending: false })
    .limit(1)
    .single();

  return latestRelease?.version;
};

/**
 * 릴리스 노트 저장 (한국어)
 */
const saveReleaseNote = async (
  supabase,
  { update_at, version, type, description }
) => {
  const { error } = await supabase.from("release_note").insert([
    {
      update_at,
      version,
      type,
      description,
    },
  ]);
  if (error) throw error;
};

/**
 * 릴리스 노트 번역 저장 (일본어)
 */
const saveReleaseNoteTranslation = async (
  supabase,
  { update_at, version, type, description }
) => {
  const { error } = await supabase.from("release_note_translation").insert([
    {
      update_at,
      version,
      type,
      description,
    },
  ]);
  if (error) throw error;
};

module.exports = {
  getLatestReleaseVersion,
  saveReleaseNote,
  saveReleaseNoteTranslation,
};
