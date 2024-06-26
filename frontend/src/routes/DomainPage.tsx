// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {  useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDomainsInfo, handleUpload } from "../requests/aws";
import RecordsTable from "../components/RecordsTable";
import { Box, Button, FileButton, Modal } from "@mantine/core";
import { AuthContext } from "../context/token";

import CustomTooltip from "../components/Tooltip";
import { DNSConfig } from "../requests/interfaces";
import { Chart } from "react-google-charts";
import { useDisclosure } from "@mantine/hooks";

const DomainPage = () => {
  const params = useParams();
  const { state , setNoti } = useContext(AuthContext);

  const [data, setData] = useState<DNSConfig | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [load, setLoad] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  

  // const [vizdata, setVizData] = useState<[string , string | number][]>([]);

  const vizDatafunc = ()=>{
    const newData = new Map<string, number>();
    console.log("VIZ DATA CALLED")

      data?.ResourceRecordSets?.map((record) => {
        newData.set(
          record.Type,
          (newData.has(record.Type) ? newData.get(record.Type)! : 0) + 1
        );
      });

      const x : [string , number][] = Array.from(newData, ([name, value]) => [name, value])

      return [
        ["Type", "No. of Records"],
        ...x,
      ]
  } 

  useEffect(() => {
    async function fetchData() {
      console.log("Domains Page", state);

      const response = await getDomainsInfo(state.token, params?.id || "");

      console.log(response, "response");
      setData(response);
      vizDatafunc()

    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, params?.id, load]);

  

  return (
    <Box m={"md"}>
      <Box p={"md"}>
        <FileButton onChange={setFile} accept="json">
          {(props) => (
            <Button {...props}>
              Bulk JSON Upload{" "}
              <CustomTooltip
                label={` JSON File must contain a root object with key "resource_record_sets" , with value as an array of type interface as follows \n
    {
      "resource_record_sets": [
        {
          "Name": "STRING_VALUE", // required
          "Type": "SOA" || "A" || "TXT" || "NS" || "CNAME" || "MX" || "NAPTR" || "PTR" || "SRV" || "SPF" || "AAAA" || "CAA" || "DS", // required
          "SetIdentifier": "STRING_VALUE",
          "Weight": Number("long"),
          "Region": "us-east-1" || "us-east-2" || "us-west-1" || "us-west-2" || "ca-central-1" || "eu-west-1" || "eu-west-2" || "eu-west-3" || "eu-central-1" || "eu-central-2" || "ap-southeast-1" || "ap-southeast-2" || "ap-southeast-3" || "ap-northeast-1" || "ap-northeast-2" || "ap-northeast-3" || "eu-north-1" || "sa-east-1" || "cn-north-1" || "cn-northwest-1" || "ap-east-1" || "me-south-1" || "me-central-1" || "ap-south-1" || "ap-south-2" || "af-south-1" || "eu-south-1" || "eu-south-2" || "ap-southeast-4" || "il-central-1" || "ca-west-1",
          "GeoLocation": {
            "ContinentCode": "STRING_VALUE",
            "CountryCode": "STRING_VALUE",
            "SubdivisionCode": "STRING_VALUE"
          }
        }
      ]
    }
  `}
              />
            </Button>
          )}
        </FileButton>
        {file && (
          <Button
            mx={"md"}
            disabled={!state.clientConnected}
            onClick={async() => {const response = await handleUpload(file, state.token, params.id);
              console.log("BULKKKK" , response , response.$metadata)
              if (Number(response?.$metadata?.httpStatusCode) >= 400) {
                setNoti &&
                  setNoti(
                    "Error\n" + response?.name,
                    "rgba(200,10,10,0.7)",
                    5000*2
                  );
                  setFile(null)
              } else {
                setNoti &&
                  setNoti(
                    "Success \n : Uploaded Successfully",
                    "rgba(9, 146, 104,0.8)",
                    5000
                  );
                  setFile(null)
                  setLoad(!load)
              }
            }}
          >
            Submit
          </Button>
        )}

        <Button disabled={!data?.ResourceRecordSets} onClick={open} style={{ float: "right" }}>
          Visualise
        </Button>
      </Box>
      {data ? (
        <RecordsTable
          data={data}
          setLoad={setLoad}
          token={state.token}
          HostedZoneId={params.id}
          setData={setData}
        />
      ) : (
        <p>No Domain Records Found</p>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title="Domain Type Visualisation"
      >
        <Chart
          chartType="PieChart"
          data={vizDatafunc()}
          options={{is3D : true , title : "Record Type Distribution" , legend : true  }}
          width={"100%"}
          height={"400px"}
        />
      </Modal>
    </Box>
  );
};

export default DomainPage;
