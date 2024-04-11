import {  Affix, Box, Button, Flex, Group, Input, Modal, Switch, Text } from "@mantine/core";
import { useContext, useState } from "react";
import { getHostedZones, handleCreateHostedZone } from "../requests/aws";
import { HostedZonesResponse } from "../requests/interfaces";
import DomainCard from "../components/DomainCard";
import { AuthContext } from "../context/token";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardPage() {
  const { state , setNoti  } = useContext(AuthContext);
  const [data, setData] = useState<HostedZonesResponse | null>();
  const [opened, { open, close }] = useDisclosure(false);

  const [modalState, setModalState] = useState({
    name: "",
    comment: "",
    checked: false,
  });


  return (
    <Box p={"lg"}>
      <h1>Dashboard page</h1>
      <br />
      <p></p>

      <Group>
        <Button
          onClick={async () => setData(await getHostedZones(state.token))}
          disabled={!state.clientConnected}
        >
          Get Hosted Zones
        </Button>

        <Button disabled={!state.clientConnected} onClick={open}>Create</Button>
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

      <Modal opened={opened} onClose={close} title="Create Hosted Zone">
        <Input.Wrapper required label="Name">
          <Input value={modalState.name} onChange={(e)=>setModalState({...modalState , name:e.target.value})}  />
        </Input.Wrapper>

        <Input.Wrapper label="Comments">
          <Input value={modalState.comment} onChange={(e)=>setModalState({...modalState , comment:e.target.value})} />
        </Input.Wrapper>

        
        <Group><Text>Visiblity</Text>
        <Switch
          m="md"
          checked={modalState.checked}
          onLabel="Private"
          offLabel="public"
          onChange={(e)=>setModalState({...modalState , checked : e.currentTarget.checked})}
        /></Group>

        <Button onClick={async()=>{
          const response = await handleCreateHostedZone(state.token , modalState);
          setNoti && setNoti(response.name , 5000);
          setModalState({name: '' , comment : '' , checked : false})
          close()
        }}>Create Now</Button>
      </Modal>

      <Button onClick={()=>{
        setNoti && setNoti("THIS IS CUSTOM NOTI" , 5000)
      }} >Noti</Button>

      {state.errorMsg && <Affix position={{top : '50px' , right : '50px'}}><Text color="red" >{state.errorMsg}</Text></Affix>}
    </Box>
  );
}
