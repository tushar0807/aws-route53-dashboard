import {
  Box,
  Button,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
  Table,
} from "@mantine/core";
import {
  DNSConfig,
  ResourceRecord,
  ResourceRecordSet,
} from "../requests/interfaces";
import { handleDelete, UpdateRecord } from "../requests/aws";
import CustomTooltip from "./Tooltip";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "react-router-dom";

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
  
  const [search, setSearch] = useState<string>("");


  const handleSearch = (search: string) => {
    const newData = data?.ResourceRecordSets.filter((record) =>
      record.Name.includes(search)
    );
    console.log("new DATA", newData);
    if (newData) setData({ ResourceRecordSets: newData });
  };

  const [opened, { open, close }] = useDisclosure(false);

  const {id} = useParams()

  

  const [editData, setEditData] = useState<ResourceRecordSet>({
    Name: "",
    Type: "",
    TTL: "",
    ResourceRecords: [
      { Value: "192.0.2.1" }
    ]
  }
);

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
        <Table.Th>Type
          <CustomTooltip label = "The type specifies whether this is a public hosted zone (for routing traffic on the internet) or a private hosted zone (for routing traffic within and among VPCs)." />
        </Table.Th>
        <Table.Th>TTL 
          <CustomTooltip label = "in seconds" />
        </Table.Th>
        <Table.Th>Records
          <CustomTooltip label = "Route 53 assigns name servers when you create a hosted zone. The assigned name servers can't be changed." />
        </Table.Th>
        <Table.Th>Modify</Table.Th>
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
                  <Button onClick={()=>{
                    setEditData({
                      Name : record.Name,
                      TTL : record.TTL,
                      Type : record.Type,
                      ResourceRecords : record.ResourceRecords
                    });
                    open();
                  }} mx={"lg"}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="1.5em"
                      width="1.5em"
                    >
                      <path d="M6.3 12.3l10-10a1 1 0 011.4 0l4 4a1 1 0 010 1.4l-10 10a1 1 0 01-.7.3H7a1 1 0 01-1-1v-4a1 1 0 01.3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 012 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2h6a1 1 0 010 2H4v14h14v-6z" />
                    </svg>
                  </Button>
                </Table.Td>
              </Table.Tr>
            )
          )}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title="Edit Record">
        <Input.Wrapper required label="Name">
          <Input
            value={editData.Name}
            onChange={(e) => setEditData({ ...editData, Name: e.target.value })}
          />
        </Input.Wrapper>

        <Select my={'md'}
          label="Type"
          placeholder="Pick value"
          data={["SOA", "A", "TXT", "NS", "CNAME", "MX", "NAPTR", "PTR", "SRV", "SPF", "AAAA", "CAA", "DS"]}
          value={editData.Type}
          onChange={(e)=>{setEditData({...editData , Type : e ? e : ''})}}
        />

        <Input.Wrapper label="TTL" my={'md'}>
          <NumberInput
            value={editData.TTL}
            onChange={(e) => {
              console.log(e);
              setEditData({ ...editData, TTL: String(e) });
            }}
          />
        </Input.Wrapper>

        <Button my='lg' onClick={async ()=>{
          const resp = await UpdateRecord(token ,id , {Name : editData.Name , Type : editData.Type , TTL : Number(editData.TTL), ResourceRecords : editData.ResourceRecords});
          console.log(resp)
          close();
          setLoad(true);
        }} >Update</Button>
      </Modal>
    </Box>
  );
};

export default RecordsTable;
