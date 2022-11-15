const express = require("express");
const app = express();
const PORT = 8080;

const { typeError }= require('./middlewares/errors');
const { dbConnection } = require("./config/config")

app.use(express.json())

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

dbConnection()



app.use(typeError)


app.listen(PORT, console.log(`Server started on port ${PORT}`));
