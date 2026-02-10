import { getCommonQuestions } from "entities/interview";
import { QuestionTabScreen } from "page/QuestionTab/ui/QuestionTabScreen";

const QuestionPage = async () => {
  const questions = await getCommonQuestions();
  return <QuestionTabScreen initialQuestions={questions} />;
};

export default QuestionPage;
