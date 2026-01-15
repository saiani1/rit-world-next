import { CompanyDetailScreen } from "page/CompanyDetail/ui/CompanyDetailScreen";
import { getCompanyById, getInterviewList } from "entities/interview";

type Props = {
  params: {
    id: string;
  };
};

const CompanyDetailPage = async ({ params }: Props) => {
  const [companyData, interviewList] = await Promise.all([
    getCompanyById(params.id),
    getInterviewList(params.id),
  ]);

  return (
    <>
      {companyData && interviewList && (
        <CompanyDetailScreen
          companyData={companyData}
          interviewList={interviewList}
        />
      )}
    </>
  );
};

export default CompanyDetailPage;
