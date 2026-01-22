import InterviewDetailScreen from "page/InterviewDetail/ui/InterviewDetailScreen";
import { getCompanyList, getInterviewById } from "entities/interview";

const InterviewDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const [interviewData, companyList] = await Promise.all([
    getInterviewById(id),
    getCompanyList(),
  ]);

  return (
    <>
      {interviewData && companyList && (
        <InterviewDetailScreen
          interviewData={interviewData}
          companyList={companyList}
        />
      )}
    </>
  );
};

export default InterviewDetailPage;
