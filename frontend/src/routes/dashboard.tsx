import {
  Affix,
  Box,
  Button,
  Flex,
  Group,
  Input,
  Modal,
} from "@mantine/core";
import { useContext, useState } from "react";
import { getHostedZones, handleCreateHostedZone } from "../requests/aws";
import { HostedZonesResponse } from "../requests/interfaces";
import DomainCard from "../components/DomainCard";
import { AuthContext } from "../context/token";
import { useDisclosure } from "@mantine/hooks";
import Notifications from "../components/Notification";

export default function DashboardPage() {
  const { state, setNoti } = useContext(AuthContext);
  const [data, setData] = useState<HostedZonesResponse | null>();
  const [opened, { open, close }] = useDisclosure(false);

  const [modalState, setModalState] = useState({
    name: "",
    comment: "",
  });

  return (
    <Box p={"lg"}>
      <h1>Dashboard page</h1>
      <br />
      <p></p>

      <Group>
        <Button
          onClick={async () => {
            const response = await getHostedZones(state.token);
            
            if (response?.$metadata?.httpStatusCode >= 400) {
              setNoti &&
                setNoti(
                  "Error\n" + response.name,
                  "rgba(200,10,10,0.7)",
                  5000
                );
            } else {
              const response = await getHostedZones(state.token);
              setData(response);
              setNoti &&
                setNoti(
                  "Success \n : Hosted Zones Listed",
                  "rgba(9, 146, 104,0.8)",
                  5000
                );
            }
            setData(response);
          }}
          disabled={!state.clientConnected}
        >
          Get Hosted Zones
        </Button>

        <Button disabled={!state.clientConnected} onClick={open}>
          Create
        </Button>
      </Group>

      {data && (
        <div style={{ padding: "8px" }}>
          <h2>Hosted Zones</h2>
          <Flex
            gap="xl"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {data?.HostedZones?.map((zone) => (
              <div
                key={zone.Id}
                style={{
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

      <Modal opened={opened} onClose={close} title="Create Hosted Zone">
        <Input.Wrapper required label="Name">
          <Input
            value={modalState.name}
            onChange={(e) =>
              setModalState({ ...modalState, name: e.target.value })
            }
          />
        </Input.Wrapper>

        <Input.Wrapper label="Comments" my={'md'}>
          <Input
            value={modalState.comment}
            onChange={(e) =>
              setModalState({ ...modalState, comment: e.target.value })
            }
          />
        </Input.Wrapper>


        <Button
          onClick={async () => {
            const response = await handleCreateHostedZone(
              state.token,
              modalState
            );
            if (response?.$metadata?.httpStatusCode >= 400) {
              setNoti &&
                setNoti(
                  "Error :" + response.name,
                  "rgba(200,10,10,0.7)",
                  5000
                );
            } else {
              const response = await getHostedZones(state.token);
              setData(response);
              setNoti &&
                setNoti(
                  "Success : Hosted Zone Created Successfully",
                  "rgba(9, 146, 104,0.8)",
                  5000
                );
            }

            setModalState({ name: "", comment: "" });
            close();
          }}
        >
          Create Now
        </Button>
      </Modal>

      {state.errorMsg && (
        <Affix position={{bottom : '24px' , right : '24px'}}>
          <Notifications msg={state.errorMsg.msg} color={state.errorMsg.color}  />
        </Affix>
      )}
    </Box>
  );
}
