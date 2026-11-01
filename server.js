require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

let db;

const url = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DATABASE || 'succulentsdb'

app.set('view engine', 'ejs')

//lets Express read HTML form submissions 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//retrieves the existing plant docs from MongoDB and displays them
app.get('/', (req, res) => {
  db.collection('succulents').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {succulents: result})
  })
})

//save the new plant that was submitted through the form
app.post('/succulents', (req, res) => {
  const succulent = {
    nickname: req.body.nickname, 
    species: req.body.species, 
    location: req.body.location, 
    sunlight: req.body.sunlight, 
    wateringFreq: Number(req.body.wateringFreq), 
    lastWatered: req.body.lastWatered, 
    waterCount: 0, 
    favorite: false, 
    health: req.body.health, 
    healthNote: req.body.healthNote
  }
  db.collection('succulents').insertOne(succulent, (err, result) => {
    if (err) return console.log(err)

      console.log('saved to the database')
      res.redirect('/')
  })
})

//route for watering
  app.put('/succulents/:id/water', (req, res) => {
    const id = req.params.id

    if(!ObjectID.isValid(id)) {
      return res.send('Invalid plant ID')
    }
    const today = new Date().toISOString().slice(0, 10)
//updates an existing plant
    db.collection('succulents').findOneAndUpdate({
      _id: new ObjectID(id)}, 
      {
        $set: {
          lastWatered: today
        }, 
      $inc: {
        waterCount: 1
      }
    }, 
    {returnOriginal: false}, 
    (err, result) => {
      if (err) return console.log(err)

      if (!result.value){
      return res.send('Plant not found. Please try again later.')
    }
    res.json(result.value)
    }
  )
  })

  //favorite plants route
  app.put('/succulents/:id/favorites', (req, res) => {
    const id = req.params.id
    if (!ObjectID.isValid(id)) {
      return res.send('This is an invalid plan ID. Please check spelling.')
    }

    db.collection('succulents').findOne({
      _id: new ObjectID(id) }, 
      (err, succulent) => {
        if (err) return console.log(err) 

        if(!succulent){
          return res.send('Plant was not found, Please try again later')
        }

        db.collection('succulents').findOneAndUpdate({
          _id: new ObjectID(id) }, 
          {
            $set: {
              favorite: !succulent.favorite
            }
          }, 
          {returnOriginal: false}, 
          (err, result) => {
            if (err) return console.log(err)

              res.json (result.value)
        })
    })
  })

  app.put('/succulents/:id/health', (req, res) => {
    const id= req.params.id 
    const health = req.body.health

    if (!ObjectID.isValid(id)) {
       return res.send('This is not a valid plant id, please check your spelling.')
    }

    db.collection('succulents').findOneAndUpdate({ _id: new ObjectID(id)}, 
  {
    $set: {
      health: health
    }
  }, 
  {returnOriginal: false}, 
  (err, result) => {
    if (err) return console.log(err)

      if (!result.value){
        return res.send('Plant could not be found. Please try again later.')
      }
      res.json(result.value)
  })
  })

  //editing route 
  app.put('/succulents/:id/edit', (req, res) => {
     const id= req.params.id 
    

    if (!ObjectID.isValid(id)) {
       return res.send('This is not a valid plant id, please check your spelling.')
    }

    db.collection('succulents').findOneAndUpdate({ _id: new ObjectID(id)}, 
  {
    $set: {
      location: req.body.location, 
      lastWatered: req.body.lastWatered, 
      healthNote: req.body.healthNote
    }
  }, 
  {returnOriginal: false}, 
  (err, result) => {
    if (err) return console.log(err)

      if (!result.value){
        return res.send('Plant could not be found. Please try again later.')
      }
      res.json(result.value)
  })
  })

  //delete route
app.delete('/succulents/:id', (req, res) => {
     const id= req.params.id 
    

    if (!ObjectID.isValid(id)) {
       return res.send('This is not a valid plant id, please check your spelling.')
    }

    db.collection('succulents').findOneAndDelete({ _id: new ObjectID(id)}, 
    (err, result) => {
      if (err) return console.log(err)

        if (!result.value){
          return res.send('Plant could not be found. Please try again later.')
        }
        res.send('Plant successfully deleted.')
    })
  })
  
  

  
  //add routes before this point
if (!url){
  throw new Error('MONGODB_URI must be set before starting the server')
}

MongoClient.connect(url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}, 
(error, client) => {
  if(error){
    throw error 
  }
  db = client.db(dbName)
  app.listen(3000, () => {
    console.log(`Connected to ${dbName} and listening on port 3000`)
  })
})
  

// if (!url){
//   throw new Error('MONGODB_URI must be set before starting the server')
// }




