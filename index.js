require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// global variable
let urlList = [];

// validURL function
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const original_url = req.body.url;
  // if original_url is not valid return error
  if (!validURL(original_url)) {
    res.json({ error: "invalid url" });
  }

  urlList.push(original_url);
  res.json({ original_url: original_url, short_url: urlList.length });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = req.params.short_url;
  const original_url = urlList[short_url - 1];
  res.redirect(original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
