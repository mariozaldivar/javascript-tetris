const express = require("express")
const pool = require("./db")


const app = express()
const port = 3000

app.listen(port, () => { console.log("Server has started") });
app.use(express.json());

app.get('/', (req, res) => {

  res.status(200).json({ message: "El servidor está conectado, bienvenido a la Tetris API" })

})

app.post("/getScores", async (req, res) => {

  try {
    const result = await pool.query("SELECT * FROM scores;");
    res.json(result.rows);
  }
  catch (err) {
    console.log(`Error: ${err}`);
    res.sendStatus(500);
  }



})


