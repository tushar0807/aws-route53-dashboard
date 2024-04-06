const { Route53Client, ListHostedZonesCommand, ListResourceRecordSetsCommand } = require("@aws-sdk/client-route-53");
const {
  Route53DomainsClient,
  ListDomainsCommand,
} = require("@aws-sdk/client-route-53-domains");
const { fromEnv ,  } = require("@aws-sdk/credential-providers");
const {Credentials} = require("@aws-sdk/types")

var express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const cors = require('cors');
const  router = require("./domains");
const bodyParser = require("body-parser");

require("dotenv").config();
var app = express();

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// app.use(clerkAuthMiddleware)


app.use('/aws', router)

app.get("/", async (req, res) => {

  res.json({done : "MESSAGE SENT"});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});


async function assumeRole() {

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

}
