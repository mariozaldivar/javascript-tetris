const express = require("express")
const app = express()


app.listen(3000)

app.get('/', (req, res) => {

  res.status(500).json({ message: "Error" })


})
