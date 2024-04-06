const { Route53Client, ListHostedZonesCommand, ListResourceRecordSetsCommand } = require("@aws-sdk/client-route-53");
const {
  Route53DomainsClient,
  ListDomainsCommand,
} = require("@aws-sdk/client-route-53-domains");
const { fromEnv ,  } = require("@aws-sdk/credential-providers");
const {Credentials} = require("@aws-sdk/types")

var express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const cors = require('cors')

require("dotenv").config();
var app = express();

const port = 5000;

app.use(cors());

// app.use(clerkAuthMiddleware)

app.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  //   console.log(req.query.userId);
  //   const stsClient = new STSClient({region : 'global'});

  //   var stsParams = {
  //     RoleArn: arn,
  //     DurationSeconds: 3600,
  //     RoleSessionName: "app1", // any string
  //   };

  //   let stsCommand = new AssumeRoleCommand(stsParams);
  //   const stsResp = await stsClient.send(stsCommand);
  //   console.log({ stsResp });
  //   res.json(stsResp)
  //   client = new ConnectClient({
  //     region: Region,
  //     credentials: {
  //       accessKeyId: stsResp.Credentials.AccessKeyId,
  //       secretAccessKey: stsResp.Credentials.SecretAccessKey,
  //       sessionToken: stsResp.Credentials.SessionToken,
  //     },
  //   });

  console.log(req.auth)

  // const response = await assumeRole();

  // console.log(process.env.AWS_ACCESS_KEY_ID);

  res.json({done : "MESSAGE SENT"});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

// openssl s_client -servername keys.example.com -showcerts -connect keys.example.com:443

// openssl s_client -servername smart-cub-63.clerk.accounts.dev -showcerts -connect smart-cub-63.clerk.accounts.dev:443

async function assumeRole() {
  //   const credentials = new fromEnv();

  const route53Client = new Route53Client({
    region: "global",
    credentials: {
      accessKeyId : process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    },
  });

  console.log(process.env.AWS_ACCESS_KEY_ID , process.env.AWS_SECRET_ACCESS_KEY)

  try {
    const command = new ListResourceRecordSetsCommand({HostedZoneId : '/hostedzone/Z00881991F4B0UMEM2P2X' , });
    const response = await route53Client.send(command);
    console.log("Domains:", response);
    return response
  } catch (error) {
    console.error("Error:", error);
    return error
  }

  // console.log(process.env.AWS_ACCESS_KEY_ID)

}
