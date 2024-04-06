// routes.js
const { Route53Client, ListHostedZonesCommand, ListResourceRecordSetsCommand } = require('@aws-sdk/client-route-53');
const { Route53DomainsClient } = require('@aws-sdk/client-route-53-domains');
const { ClerkExpressRequireAuth, clients } = require('@clerk/clerk-sdk-node');
const express = require('express');
const router = express.Router();



// router.use(ClerkExpressRequireAuth())


let userClientMap = new Map();


function createClient(AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY , userId){
    
    try {
        const route53Client = new Route53Client({
            region: "global",
            credentials: {
              accessKeyId : AWS_ACCESS_KEY_ID,
              secretAccessKey : AWS_SECRET_ACCESS_KEY
            },
          });

          const route53DomainsClient = new Route53DomainsClient({
            region : "global",
            credentials: {
                accessKeyId : AWS_ACCESS_KEY_ID,
                secretAccessKey : AWS_SECRET_ACCESS_KEY
              },
          })

    
          userClientMap.set(userId ,  {'r53client' :  route53Client , 'r53DomainsClient' : route53DomainsClient , 'timestamp' : Date.now()})
          console.log("Client created successfully")
          return
        
    } catch (error) {
        console.log(error)
        
    }
    
}


router.post('/createAWSClient' , ClerkExpressRequireAuth(),  (req,res) => {

    console.log(req.auth.userId , req.body)
    if(!userClientMap.has( req.auth.userId)){
        createClient(req.body.AWS_ACCESS_KEY_ID , req.body.AWS_SECRET_ACCESS_KEY , req.auth.userId)
    }

    if(userClientMap.has( req.auth.userId)){
        res.json({"msg" : "Client Created Successfully"})
        return
    }

    res.status(400).json({ "error" : "Invalid Credentials"})
    
})

router.get('/getClientStatus' , ClerkExpressRequireAuth() ,(req,res)=>{
    console.log("GET CLIENT CALLED" , req.auth.userId)
    console.log(userClientMap)
    
    if(userClientMap.has(req.auth.userId)){
        res.json({"msg" : "Client  Exists"})
        return
    }
    res.status(400).json({ "error" : "Create a client"})
})



router.get('/getHostedZones', ClerkExpressRequireAuth() ,async(req, res) => {
    
    console.log("GET HOSTED ZONES CALLED" , req.headers)
    if(!userClientMap.has(req.auth.userId) ){
        res.status(500).json({"error" : "No AWS Client detected"})
    }

    try {
        const client = userClientMap.get(req.auth.userId).r53client
        const command = new ListHostedZonesCommand();
        const response = await client.send(command);
        
        console.log("Hosted Zones:", response);
        res.json(response)
      } catch (error) {
        console.error("Error:", error);
        res.status(401).json(error)
      }

});

router.get('/getDomainInfo' , ClerkExpressRequireAuth() , async(req,res)=>{
    console.log("GET DOMAINS INFO CALLED" , req.query.domainId , userClientMap)
    if(!userClientMap.has(req.auth.userId) ){
        res.status(500).json({"error" : "No AWS Client detected"})
    }

    try {
        const client = userClientMap.get(req.auth.userId).r53client
        const command = new ListResourceRecordSetsCommand({'HostedZoneId' : req.query.domainId});
        const response = await client.send(command);
        
        console.log("Domains :", response);
        res.json(response)
      } catch (error) {
        console.error("Error:", error);
        res.status(401).json(error)
      }

})


module.exports = router;
