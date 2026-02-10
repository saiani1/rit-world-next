import { CompanyDetailScreen } from "page/CompanyDetail/ui/CompanyDetailScreen";
import { getCompanyById } from "entities/interview";

type Props = {
  params: {
    id: string;
  };
};

const CompanyDetailPage = async ({ params }: Props) => {
  const companyData = await getCompanyById(params.id);

  return (
    <>{companyData && <CompanyDetailScreen companyData={companyData} />}</>
  );
};

export default CompanyDetailPage;
