const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("dabase connection");
  });

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
