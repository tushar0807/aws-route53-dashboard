import * as React from 'react'
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/clerk-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Badge, Button } from '@mantine/core'
import { CreateClient } from '../requests/aws'
 
export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()

  const [token , setToken] = React.useState<string | null>(null)
 
 
  React.useEffect(() => {
    if ( isLoaded && !userId) {
      navigate("/sign-in")
    }
  }, [isLoaded, navigate, userId])

  const { getToken } = useAuth()

  const [clientStatus , setClientStatus] = React.useState(false)

  React.useEffect(()=>{

    async function fetchData() {
      const tkn = await getToken()

      const response = await fetch(
        "http://localhost:5000/aws/getClientStatus",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tkn}`,
          },
        }
      );

      setClientStatus(response.ok)
      setToken(tkn)
      
    }

    fetchData()
  },[])
 
  if (!isLoaded) return "Loading..."
 
  return (
    <>
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
              {clientStatus ? <Badge mx={'md'} color= 'green'> AWS Client Connected </Badge> : 
              <Button mx={'md'} onClick={() => CreateClient(token)}>Connect Client</Button>}
                
              <UserButton afterSignOutUrl="/sign-in" />
            </SignedIn>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
    
  )
}