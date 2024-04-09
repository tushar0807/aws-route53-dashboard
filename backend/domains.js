// routes.js
const {
  Route53Client,
  ListHostedZonesCommand,
  ListResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommand,
} = require("@aws-sdk/client-route-53");
const { Route53DomainsClient } = require("@aws-sdk/client-route-53-domains");
const { ClerkExpressRequireAuth, clients } = require("@clerk/clerk-sdk-node");
const express = require("express");
const router = express.Router();
const fs = require("fs");

// router.use(ClerkExpressRequireAuth())

let userClientMap = new Map();
const multer = require("multer");

const UPLOADS_DIR = "./uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

function createClient(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, userId) {
  try {
    const route53Client = new Route53Client({
      region: "global",
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const route53DomainsClient = new Route53DomainsClient({
      region: "global",
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    userClientMap.set(userId, {
      r53client: route53Client,
      r53DomainsClient: route53DomainsClient,
      timestamp: Date.now(),
    });
    console.log("Client created successfully");
    return;
  } catch (error) {
    console.log(error);
  }
}

router.post("/createAWSClient", ClerkExpressRequireAuth(), (req, res) => {
  console.log(req.auth.userId, req.body);
  if (!userClientMap.has(req.auth.userId)) {
    createClient(
      req.body.AWS_ACCESS_KEY_ID,
      req.body.AWS_SECRET_ACCESS_KEY,
      req.auth.userId
    );
  }

  if (userClientMap.has(req.auth.userId)) {
    res.json({ msg: "Client Created Successfully" });
    return;
  }

  res.status(400).json({ error: "Invalid Credentials" });
});

router.get("/getClientStatus", ClerkExpressRequireAuth(), (req, res) => {
  console.log("GET CLIENT CALLED", req.auth.userId);
  console.log(userClientMap);

  if (userClientMap.has(req.auth.userId)) {
    res.json({ msg: "Client  Exists" });
    return;
  }
  res.status(400).json({ error: "Create a client" });
});

router.get("/getHostedZones", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("GET HOSTED ZONES CALLED", req.headers);
  if (
    !userClientMap.has(req.auth.userId) &&
    userClientMap.get(req.auth.userId) !== undefined
  ) {
    res.status(500).json({ error: "No AWS Client detected" });
  }

  try {
    const client = userClientMap.get(req.auth.userId).r53client;
    const command = new ListHostedZonesCommand();
    const response = await client.send(command);

    console.log("Hosted Zones:", response);
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json(error);
  }
});

router.get("/getDomainInfo", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("GET DOMAINS INFO CALLED", req.query.domainId, userClientMap);
  if (
    !userClientMap.has(req.auth.userId) ||
    userClientMap.get(req.auth.userId) == undefined
  ) {
    res.status(500).json({ error: "No AWS Client detected" });
    return;
  }

  try {
    const client = userClientMap.get(req.auth.userId).r53client;
    const command = new ListResourceRecordSetsCommand({
      HostedZoneId: req.query.domainId,
    });
    const response = await client.send(command);

    console.log("Domains :", response);
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json(error);
  }
});

router.post(
  "/uploadBulk",
  ClerkExpressRequireAuth(),
  upload.single("file"),
  async (req, res) => {
    const HostedZoneId = req.headers.hostedzoneid;
    if (!req.file || !HostedZoneId) {
      return res
        .status(400)
        .json({ error: "No file uploaded or Hosted ZOne ID not provided" });
    }

    console.log("UPLOAD CALLED", req.auth.userId);

    fs.readFile(req.file.path, "utf8", async (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Error reading file" });
      }

      let dataArray;
      try {
        dataArray = JSON.parse(data);
        const mappedData = dataArray.resource_record_sets.map((record) => ({
          Action: "CREATE",
          ResourceRecordSet: {
            Name: record.Name,
            ResourceRecords: record.ResourceRecords.map((value) => ({
              Value: value.Value,
            })),
            TTL: record.TTL,
            Type: record.Type,
          },
        }));

        console.log("mappedData", mappedData);
        const client = userClientMap.get(req.auth.userId).r53client;
        const command = new ChangeResourceRecordSetsCommand({
          HostedZoneId: HostedZoneId,
          ChangeBatch: {
            Changes: mappedData,
            Comment: "Bulk Upload by AWS R53 DashBoard",
          },
        });
        console.log(mappedData[0].ResourceRecordSet.ResourceRecords);
        const response = await client.send(command);
        console.log("response", response.json());
        res.status(response.metadata.httpStatusCode).json(response.json());
        return;
      } catch (parseError) {
        console.error(
          "Error parsing",
          "message is",
          parseError.message,
          parseError
        );
        return res.json({ error: "Parsing Error" });
      }
    });
  }
);

router.post("/deleteRecord", ClerkExpressRequireAuth(), async (req, res) => {
  const { data, HostedZoneId } = req.body;

  if (
    !userClientMap.has(req.auth.userId) ||
    userClientMap.get(req.auth.userId) == undefined
  ) {
    res.status(500).json({ error: "No AWS Client detected" });
    return;
  }

  const client = userClientMap.get(req.auth.userId).r53client;
  const command = new ChangeResourceRecordSetsCommand({
    HostedZoneId: HostedZoneId,
    ChangeBatch: {
      Changes: [{ Action: "DELETE", ResourceRecordSet: data }],
      Comment: "Delete Record by AWS R53 DashBoard",
    },
  });

  const response = await client.send(command);
  console.log("response", response,response.$metadata.httpStatusCode);
  res.status(response.$metadata.httpStatusCode).json(response);
  return ;
});

module.exports = router;
