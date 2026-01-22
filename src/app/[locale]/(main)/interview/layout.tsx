import { Title } from "shared/ui";
import InterviewTabs from "./InterviewTabs";

type InterviewLayoutProps = {
  children: React.ReactNode;
};

const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  return (
    <>
      <div>
        <Title name="Interview" />
        <InterviewTabs />
        <div className="mt-6">{children}</div>
      </div>
    </>
  );
};

export default InterviewLayout;
