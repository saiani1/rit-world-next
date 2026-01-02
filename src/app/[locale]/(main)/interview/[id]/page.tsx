import InterviewDetailScreen from "page/InterviewDetail/ui/InterviewDetailScreen";
import { getInterviewById } from "entities/interview";

const InterviewDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data = await getInterviewById(id);

  return <>{data && <InterviewDetailScreen data={data} />}</>;
};

export default InterviewDetailPage;
