const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//midlewere
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://cardoctor-bd.web.app",
        "https://cardoctor-bd.firebaseapp.com",
    ],
    credentials: true,
}))




const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.BD_PASSWORD}@cluster0.0zrlznh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // Get a handle to the database
    const database = client.db("Restaurant_Management");
    const  products= database.collection("foods");

    app.get('/products',async(req,res)=>{
        const result = await products.find().toArray()
        res.send(result);
    })
    app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const quary={_id: new ObjectId(id)}
        const result = await products.findOne(quary);
        res.send(result)
    })

    app.post('/product',async(req,res)=>{
        const newProduct = req.body;
        const result = await products.insertOne(newProduct);
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Resturant Management Server is Running')
})

app.listen(port, () => {
    console.log(`Resturant Management Server listening on port ${port}`)
})