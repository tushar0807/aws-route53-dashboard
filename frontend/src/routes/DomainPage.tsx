import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDomainsInfo, handleUpload } from "../requests/aws";
import RecordsTable from "../components/RecordsTable";
import { Box, Button, FileButton } from "@mantine/core";
import { AuthContext } from "../context/token";

const DomainPage = () => {
  const params = useParams();
  const {state } = useContext(AuthContext)

  const [data, setData] = useState(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchData() {

      const response = await getDomainsInfo(state.token, params?.id || "");

      console.log(response , "response");
      setData(response)
    }

    fetchData();
  }, [state, params.id]);

  console.log(params);

  return (
    <Box m={'md'}>
      <Box p={'md'}>
      <FileButton onChange={setFile} accept="json">
        {(props) => <Button {...props}>Bulk JSON Upload</Button>}
      </FileButton>
      {file && <Button mx={'md'} disabled={!state.clientConnected} onClick={()=>handleUpload(file,state.token,params.id)}>Submit</Button>}
      </Box>
      <RecordsTable data={data} />
    </Box>
  );
};

export default DomainPage;
