const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config({ path: "./src/config/.env" });

const IndexRoute = require("./src/v1/Routes/Index");

const App = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  // Temporarily allowing all origins for testing
  // origin: '*',
};
App.use(cors(corsOptions));
App.use(express.static("src"));
App.use(express.json());

//  App.use(cors("*"));
App.use(bodyParser.json());
App.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//

App.use("/src/v1", IndexRoute);

App.get("/", (req, res) => {
  return res.status(200).json({ message: "Hi, from bangashree." });
});

App.listen(8000, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("port is running");
  }
});
