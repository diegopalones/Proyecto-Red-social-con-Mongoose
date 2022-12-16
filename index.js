const express = require("express");
const cors = require('cors')
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;

const { dbConnection } = require("./config/config");

const { typeError } = require("./middlewares/errors");

app.use(express.json());
app.use(cors())
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

dbConnection();


app.use(typeError);

app.listen(PORT, console.log(`Server started on port ${PORT}`));
