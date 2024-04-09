import {
  Box,
  Button,
  Group,
  Input,
  Table,
} from "@mantine/core";
import {
  DNSConfig,
  ResourceRecord,
  ResourceRecordSet,
} from "../requests/interfaces";
import { handleDelete } from "../requests/aws";
import CustomTooltip from "./Tooltip";
import { useState } from "react";

const RecordsTable = ({
  data,
  token,
  HostedZoneId,
  setLoad,
  setData,
}: {
  data: DNSConfig | null;
  token: string;
  HostedZoneId: string | undefined;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<DNSConfig | null>>;
}) => {
  console.log(data, "DATA");

  const [search, setSearch] = useState<string>("");
  const handleSearch = (search: string) => {
    console.log("HANDLE SEARCH");
    const newData = data?.ResourceRecordSets.filter((record) =>
      record.Name.includes(search)
    );
    console.log("new DATA", newData);
    if (newData) setData({ ResourceRecordSets: newData });
  };



  return (
    <Box
      p={"md"}
      style={{
        border: "2px solid white",
        backgroundColor: "rgba(10,10,10,0.6)",
      }}
    >
      <Group mb={"md"} pb={"md"} style={{ borderBottom: "2px solid white" }}>
        <Group>
          {" "}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
          <Button onClick={() => handleSearch(search)}>Search</Button>
        </Group>
      </Group>

      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              Name
              <CustomTooltip label="name of domain" />
            </Table.Th>
            <Table.Th>
                Type
            </Table.Th>
            <Table.Th>TTL</Table.Th>
            <Table.Th>Records</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
          {/* <br/> */}
        </Table.Thead>

        <Table.Tbody>
          {data?.ResourceRecordSets?.map(
            (record: ResourceRecordSet, index: number) => (
              <Table.Tr key={record.Name + index}>
                <Table.Td>{record.Name}</Table.Td>
                <Table.Td>{record.Type}</Table.Td>
                <Table.Td>{record.TTL}</Table.Td>
                <Table.Td>
                  <ul>
                    {record.ResourceRecords.map(
                      (item: ResourceRecord, index: number) => (
                        <li key={index}>{item.Value}</li>
                      )
                    )}
                  </ul>
                </Table.Td>

                <Table.Td>
                  <Button
                    onClick={() => {
                      handleDelete(token, record, HostedZoneId);
                      setLoad(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#ff2825"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </Button>
                </Table.Td>
              </Table.Tr>
            )
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default RecordsTable;
