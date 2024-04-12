import { SignedOut, UserButton, SignedIn, useAuth } from "@clerk/clerk-react";
import {
  Badge,
  Box,
  Button,
  Group,
  Image,
  Input,
  Modal,
  Text,
} from "@mantine/core";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CreateClient } from "../requests/aws";

import { AuthContext } from "../context/token";
import { useDisclosure } from "@mantine/hooks";

import Logo from "../assets/dns_manager.png";

const Navbar = () => {
  const { state, setState } = useContext(AuthContext);
  const { isSignedIn, sessionId, getToken, userId } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const [clientState, setClientState] = useState({
    access_key: "",
    secret_key: "",
  });

  React.useEffect(() => {
    async function fetchData() {
      console.log("before", state);
      const tkn = await getToken();
      if (tkn == "" || tkn == undefined || tkn == null) return;
      const response = await fetch(
        "http://localhost:5000/aws/getClientStatus",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      if  ((!state.clientConnected && response.ok  ||  (state.token === "")) && isSignedIn && sessionId && tkn && setState) {
        setState(() => ({
          token: tkn,
          isSignedIn: isSignedIn,
          sessionId: sessionId,
          userId: userId,
          clientConnected: response.ok,    
        })
      );
      }

      console.log("After", state, response.ok);
    }

    fetchData();

    
  }, [getToken, isSignedIn, sessionId, setState, state, userId]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Image src={Logo} w={'8rem'} h={'3rem'} alt="Logo" className="logo" />
          <Link to="/">
            <Box mx={"md"} className="navbar-title">
              AWS DASHBOARD
            </Box>
          </Link>
        </div>

        <Link to="/dashboard">
          <Text>Dashboard</Text>
        </Link>
        <nav className="navbar-links">
          <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut>
          <SignedIn>
            {state.clientConnected ? (
              <Badge mx={"md"} color="green">
                {" "}
                AWS Client Connected{" "}
              </Badge>
            ) : (
              <Button mx={"md"} onClick={open}>
                Connect Client
              </Button>
            )}

            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </nav>
      </div>
      <Modal opened={opened} onClose={close}>
        <Group>
          <Input.Wrapper label="Access Key" required>
            {" "}
            <Input
              value={clientState.access_key}
              onChange={(e) =>
                setClientState({ ...clientState, access_key: e.target.value })
              }
            />
          </Input.Wrapper>
        </Group>
        <Group my={"lg"}>
          <Input.Wrapper label="Secret Key" required>
            {" "}
            <Input
              value={clientState.secret_key}
              onChange={(e) =>
                setClientState({ ...clientState, secret_key: e.target.value })
              }
            />
          </Input.Wrapper>
        </Group>
        <Button
          onClick={async () => {
            const result = await CreateClient(
              state.token,
              clientState.access_key,
              clientState.secret_key
            );

            console.log("GETCLIENTSTATUS" , result);
            setState && setState({ ...state, clientConnected: result });
            close();
          }}
        >
          Create Client
        </Button>
      </Modal>
    </header>
  );
};

export default Navbar;
