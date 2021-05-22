require("dotenv").config();
const express = require("express");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ 
    extended: true 
}));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var name = req.body.clientName;
  var stringArray = name.split(/(\s+)/);

  var Fname = stringArray[0];
  var Lname = stringArray[2];
  var email = req.body.email;
  var age = req.body.age;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: Fname,
          LNAME: Lname,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);
  const url =
    "https://us1.api.mailchimp.com/3.0/lists/4822e75d2f?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>";
  const options = {
    method: "POST",
    auth: process.env.API_KEY,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function () {
  console.log("Server is up and running on port " + process.env.PORT);
});
