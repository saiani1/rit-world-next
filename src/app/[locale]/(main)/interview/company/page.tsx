import { CompanyScreen } from "page/Company/ui/CompanyScreen";
import { getCompanyList } from "entities/interview";

const CompanyPage = async () => {
  const data = await getCompanyList();
  return <CompanyScreen companies={data} />;
};
export default CompanyPage;
