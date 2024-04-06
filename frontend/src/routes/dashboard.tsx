import { useAuth } from "@clerk/clerk-react";



export default function DashboardPage() {

  const { getToken } = useAuth();

  const fetchDataFromExternalResource = async () => {
    const token = await getToken({skipCache : true ,  template : "JWT_AWS_Route53"});

    try {
      const token = await getToken()
      const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // mode: 'cors',
        },
      })

      console.log(response.json())

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      console.log("RESULT: " ,result)
    } catch (err) {
      console.log("ERROR: " , err)
    }
    
    // Add logic to fetch your data
    console.log("TOKEN: " ,token )
  }

  fetchDataFromExternalResource()

  return (
    <>
      <h1>Dashboard page</h1>
      <p>This is a protected page.</p>
    </>
  );
}
