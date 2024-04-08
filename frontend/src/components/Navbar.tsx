import { SignedOut, UserButton , SignedIn, useAuth} from '@clerk/clerk-react'
import { Badge , Button } from '@mantine/core'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CreateClient } from '../requests/aws'

import { AuthContext } from '../context/token'

const Navbar = () => {

    const {state , setState} = useContext(AuthContext)
    const {isSignedIn , sessionId , getToken , userId} = useAuth()


  React.useEffect(()=>{

    async function fetchData() {

        console.log("before" , state)
        const tkn = await getToken();
        if(tkn == '' || tkn ==undefined || tkn == null)
            return
        const response = await fetch(
            "http://localhost:5000/aws/getClientStatus",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${state.token}`,
              },
            }
          );
        if(state.token === '' && isSignedIn && sessionId && tkn && setState){
            setState({
                token : tkn,
                isSignedIn : isSignedIn,
                sessionId : sessionId,
                userId : userId,
                clientConnected : response.ok 
            })
        }
      
        

      console.log("After" , state , response.ok)
    }

    fetchData()
  },[getToken, isSignedIn, sessionId, setState, state, userId])


  return (
    <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/">
              <img src="logo.png" alt="Logo" className="logo" />
            </Link>
            <span className="navbar-title">AWS DASHBOARD</span>
          </div>
          <nav className="navbar-links">
            <SignedOut>
              <Link to="/sign-in">Sign In</Link>
            </SignedOut>
            <SignedIn>
              {state.clientConnected ? <Badge mx={'md'} color= 'green'> AWS Client Connected </Badge> : 
              <Button mx={'md'} onClick={async() => {
                const result = await CreateClient(state.token)
                setState && setState({...state , clientConnected : result})
              }}>Connect Client</Button>}
                
              <UserButton afterSignOutUrl="/sign-in" />
            </SignedIn>
          </nav>
        </div>
      </header>
  )
}

export default Navbar