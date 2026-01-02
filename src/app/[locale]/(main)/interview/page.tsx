import InterviewScreen from "page/Interview/ui/InterviewScreen";
import { getInterviewList } from "entities/interview";

const InterviewPage = async () => {
  const data = await getInterviewList();

  return <>{data && <InterviewScreen data={data} />}</>;
};

export default InterviewPage;
