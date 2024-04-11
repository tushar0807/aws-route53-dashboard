import { Badge, Card, Group, Text, Button, Space } from "@mantine/core";
import { HostedZone } from "../requests/interfaces";
import { useNavigate } from "react-router-dom";

const DomainCard = ({ data }: { data: HostedZone }) => {

    const navigate = useNavigate()
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Name : {data.Name}</Text>
        <Badge color="pink" p={'sm'}>{data.Id}</Badge>
      </Group>

      <Text size="sm">DNS Record Count : {data.ResourceRecordSetCount}</Text>
      {data.Config.Comment ? (
        <Text size="sm">Description : {data.Config.Comment}</Text>
      ) : <Space h={'md'} />}
      <Text size="sm">Private Zone : {String(data.Config.PrivateZone)}</Text>

      <Button color="blue" mt="md" radius="md"  onClick={()=>{ 
        const idParts = data.Id.split('/');
        const zoneId = idParts[idParts.length - 1];
        navigate(`/dashboard/${zoneId}`)}}>
        Details
      </Button>
    </Card>
  );
};

export default DomainCard;
