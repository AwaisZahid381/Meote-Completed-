const connectToMongo = require("./db")  // getting the exported function from the db.js
const express = require('express') // getting express js
var cors = require('cors')
connectToMongo(); 

const app = express()
const port = 5000

app.use(cors())
app.use(express.json()) // a middleware use for req.body 

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

