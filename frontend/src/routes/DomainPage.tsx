import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { getDomainsInfo } from "../requests/aws";
import RecordsTable from "../components/RecordsTable";


const DomainPage = () => {
  const params = useParams();
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const tkn = await getToken();

      const response = await getDomainsInfo(tkn, params?.id || "");
      console.log(response);
    }

    fetchData();
  }, [getToken, params.id]);

  console.log(params);

  return <div>
    DomainPage
    <RecordsTable />
    </div>;
};

export default DomainPage;
