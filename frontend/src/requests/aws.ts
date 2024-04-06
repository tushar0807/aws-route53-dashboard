export const CreateClient = async (token: string | null) => {
  const response = await fetch("http://localhost:5000/aws/createAWSClient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      AWS_SECRET_ACCESS_KEY: "ZWsnFbbdd0jRYVfnf5M8wcou2cgU6p+g/0NUTEnV",
      AWS_ACCESS_KEY_ID: "AKIAZQ3DTRG3EUFQZBMZ",
    }),
  });
  return response;
};

export const getHostedZones = async (token : string | null) => {

  console.log("GHZ" ,token)
  try {
    const response = await fetch("http://localhost:5000/aws/getHostedZones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("HOSTED ZONES: ", response.json());
    return response.json()
  } catch (error) {
    console.log("HZ", error);
    return error
  }
};


export const getClientStatus = async (token : string | null) => {
    try {
      const response = await fetch("http://localhost:5000/aws/getClientStatus", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.json()
    } catch (error) {
        console.log("GET STATUS ERROR : " , error)
      return error
    }
  };

  export const getDomainsInfo = async (token : string | null , id : string) => {
    try {
      const response = await fetch(`http://localhost:5000/aws/getDomainInfo?domainId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.json()
    } catch (error) {
        console.log("GET STATUS ERROR : " , error)
      return error
    }
  };

  
