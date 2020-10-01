const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo990.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJhon").collection("products");
  const orderCollection = client.db("emaJhon").collection("orders");
   console.log('database connected')


   app.post('/addProducts', (req, res) =>{
        const products = req.body

        productCollection.insertMany(products)
        .then(result =>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
   })
   
   app.get('/products', (req, res) =>{
       productCollection.find({})
       .toArray((err, documents) =>{
           res.send(documents)
       })
   })

   app.get('/products/:key', (req, res) =>{
        productCollection.find({key: req.params.key})
        .toArray((err, documents) =>{
            res.send(documents[0])
        })
    })

    app.post('/productByKeys', (req, res) =>{
       const productKeys = req.body;
       productCollection.find( { key: {$in : productKeys}} )
       .toArray((err, documents) =>{
           res.send(documents)
       })
    })



    app.post('/addOrder', (req, res) =>{
        const order = req.body

        orderCollection.insertOne(order)
        .then(result =>{
            res.send(insertedCount > 0)
        })
   })



});


app.listen(process.env.PORT || port);