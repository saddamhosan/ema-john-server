const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express()
const port=process.env.PORT ||4000


// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require('express/lib/response');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n9adr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run (){
    try{
        await client.connect()
        const productsCollection = client.db("ema-john").collection("products");
        app.get('/products',async(req,res)=>{
            const query={}
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const cursor=productsCollection.find(query) 
            let result
        if(page||size){
            result =await cursor.skip(page*size).limit(size).toArray()
        }else{
            result= await cursor.toArray()
        }
          
            res.send(result)
        })

        app.get('/productsCount',async(req,res)=>{
            const count=await productsCollection.estimatedDocumentCount()
            res.send({count})
        })

        app.post('/productsByKeys',async(req,res)=>{
            console.log(req.body);
            const keys=req.body
            const ids = keys.map((id) => ObjectId(id));
            const query={_id:{$in:ids}}
            const cursor = productsCollection.find(query); 
            const result=await cursor.toArray()
            res.send(result)
        })


    } finally{
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
   res.send("welcome to express") 
})

app.listen(port,()=>{
    console.log("listing to port",port);
})