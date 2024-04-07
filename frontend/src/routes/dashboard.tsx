import { Button, Flex } from "@mantine/core";
import { useContext, useState } from "react";
import { getHostedZones } from "../requests/aws";
import { HostedZonesResponse } from "../requests/interfaces";
import DomainCard from "../components/DomainCard";
import { AuthContext } from "../context/token";

export default function DashboardPage() {
  
  const {state } = useContext(AuthContext)
  const [data, setData] = useState<HostedZonesResponse | null>();


  return (
    <>
      <h1>Dashboard page</h1>
      <br />
      <p></p>

      <ul>
        <Button onClick={async () => setData(await getHostedZones(state.token))}>
          Get Hosted Zones
        </Button>
      </ul>

      {data && (
        <div style={{padding : '8px'}}>
          <h2>Hosted Zones</h2>
          <Flex
            gap="xl"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {data.HostedZones.map((zone) => (
              <div
                key={zone.Id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "10px",
                }}
              >
                <DomainCard data={zone} />
              </div>
            ))}
          </Flex>
        </div>
      )}
    </>
  );
}
