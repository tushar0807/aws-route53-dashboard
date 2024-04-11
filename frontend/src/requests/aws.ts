import { ResourceRecord, ResourceRecordSet } from "./interfaces";

export const CreateClient = async (token: string | null , access_key : string , secret_key : string) => {
  
  console.log(access_key , secret_key)
  const response = await fetch("http://localhost:5000/aws/createAWSClient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      AWS_SECRET_ACCESS_KEY: secret_key,
      AWS_ACCESS_KEY_ID: access_key,
    }),
  });
  return response.ok;
};

export const getHostedZones = async (token: string | null) => {
  console.log("GHZ", token);
  try {
    const response = await fetch("http://localhost:5000/aws/getHostedZones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    console.log("HZ", error);
    return error;
  }
};

export const getClientStatus = async (token: string | null) => {
  try {
    const response = await fetch("http://localhost:5000/aws/getClientStatus", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error) {
    console.log("GET STATUS ERROR : ", error);
    return error;
  }
};

export const getDomainsInfo = async (token: string | null, id: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/aws/getDomainInfo?domainId=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  } catch (error) {
    console.log("GET STATUS ERROR : ", error);
    return error;
  }
};

export const handleUpload = async (
  file: File,
  token: string | null,
  hostedDomain: string | undefined
) => {
  console.log(file);
  if (file.size && hostedDomain) {
    const formData = new FormData();
    formData.append("file", file);

    console.log("sending request");

    fetch("http://localhost:5000/aws/uploadBulk", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        HostedZoneId: hostedDomain,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("File uploaded successfully.");
          // Optionally, you can perform further actions upon successful upload
        } else {
          console.error("Error uploading file:", response.statusText);
          // Handle error
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle error
      });
  } else {
    console.error("No file selected.");
    // Handle case where no file is selected
  }
};

export const handleDelete = async (
  token: string | null,
  data: ResourceRecordSet,
  hostedZoneId: string | undefined
) => {
  console.log(token, data, hostedZoneId);
  try {

    const response = await fetch("http://localhost:5000/aws/deleteRecord", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        HostedZoneId: hostedZoneId,
        data : data
      }),
    });


    const responseData = await response.json();
    return responseData.ok
  } catch (error) {
    console.error("Error:", error);
  }
};


export const handleCreateHostedZone = async (
  token: string | null,
  data : unknown
) => {
  console.log(token, data);
  try {

    const response = await fetch("http://localhost:5000/aws/createHostedZone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data : data
      }),
    });

    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.error("Error:", error);
    return error
  }
};

export const UpdateRecord = async(token : string ,HostedZoneId : string | undefined , data : {Name : string , Type : string , TTL : number , ResourceRecords : ResourceRecord[]} ) =>{

  try {

    const response = await fetch("http://localhost:5000/aws/updateRecord", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data : data,
        HostedZoneId
      }),
    });

    const responseData = await response.json();
    return responseData.ok
  } catch (error) {
    console.error("Error:", error);
  }

} 

