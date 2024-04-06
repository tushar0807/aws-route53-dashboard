import { useAuth } from "@clerk/clerk-react";
import { Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { getHostedZones } from "../requests/aws";
import { HostedZonesResponse } from "../requests/interfaces";
import DomainCard from "../components/DomainCard";

export default function DashboardPage() {
  const { getToken } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<HostedZonesResponse | null>();

  useEffect(() => {
    const fetchToken = async () => {
      const tkn = await getToken();

      setToken(tkn);

      console.log("TOKEN: ", tkn);
    };

    fetchToken();
  }, []);

  return (
    <>
      <h1>Dashboard page</h1>
      <br />
      <p></p>

      <ul>
        <Button onClick={async () => setData(await getHostedZones(token))}>
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
