import { InterviewList } from "page/Interview/ui/InterviewList";
import { InterviewUploadSection } from "page/Interview/ui/InterviewUploadSection";
import { getInterviewList } from "entities/interview";

const RecordPage = async () => {
  const data = await getInterviewList();

  return (
    <>
      {data && (
        <>
          <InterviewUploadSection />
          <InterviewList data={data} />
        </>
      )}
    </>
  );
};

export default RecordPage;
