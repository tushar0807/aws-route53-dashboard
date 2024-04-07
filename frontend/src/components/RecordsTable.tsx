import { Box, Table } from "@mantine/core";
import { DNSConfig, ResourceRecord, ResourceRecordSet } from "../requests/interfaces";

const RecordsTable = ({ data }: { data: DNSConfig | null }) => {
  console.log(data, "DATA");

  return (
    <Box p={"md"} style={{ border : '2px solid white'}}>
      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>TTL</Table.Th>
            <Table.Th>Records</Table.Th>
          </Table.Tr>
          {/* <br/> */}
        </Table.Thead>
        
        <Table.Tbody>
          {data?.ResourceRecordSets?.map((record: ResourceRecordSet , index : number) => (
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
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default RecordsTable;
