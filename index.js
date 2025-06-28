const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://crowdFunding:f9qyM87LqWSngGbO@cluster0.z1ypfcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("crowdFundingDB");
        const campaignsCollection = database.collection("campaigns");
        const donatedCollection = database.collection("donatedCollection");

        app.get("/campaigns", async (req, res) => {
            const query = campaignsCollection.find();
            const result = await query.toArray();
            res.send(result);
        })
        app.get("/campaign/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await campaignsCollection.findOne(query);
            res.send(result);
        });
        app.get("/donate/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await donatedCollection.findOne(query);
            res.send(result);
        });
        app.get("/donateds", async (req, res)=>{
            const query = donatedCollection.find();
            const result = await query.toArray();
            res.send(result);
        })
        app.post("/campaigns", async (req, res) => {
            const newCampaign = req.body;
            const result = await campaignsCollection.insertOne(newCampaign);
            res.send(result);
        });
        app.post("/donateds", async (req, res)=>{
            const newDonate = req.body;
            const result = await donatedCollection.insertOne(newDonate);
            res.send(result);
        });
        app.put("/campaigns/:id", async (req, res) => {
            const id = req.params.id;
            const updatedCampaign = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    photo: updatedCampaign.photo,
                    title: updatedCampaign.title,
                    campaignType: updatedCampaign.campaignType,
                    date: updatedCampaign.date,
                    amount: updatedCampaign.amount,
                    description: updatedCampaign.description,
                },
            };
            const result = await campaignsCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server in Running...");
})
app.listen(port, () => {
    console.log(`Server in Running on Port ${port}`);
});