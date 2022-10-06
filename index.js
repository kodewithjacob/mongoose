const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Add jsonwebtoken package
const jwt = require("jsonwebtoken");

// Initialize express instance
const app = express();
// Assign port number for the express app
const port = 3000;

// Add body-parser middleware to the app instance
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to mongodb server
mongoose.connect(
  "mongodb+srv://<user>:<password>@kodego.xb5nkku.mongodb.net/?retryWrites=true&w=majority"
);

const Entry = mongoose.model("Entry", {
  note: String,
  date: { type: Date, default: Date.now },
});

// Declare JWT Secret
const JWTSecret = "YHriCvbUYLjWj/bqHYB62Q==";

// Create middleware to check if JWT is present and valid in the request
const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];

  // header.split(" ") = ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoxNjY1MDU3Nzg4NzIxLCJpYXQiOjE2NjUwNTc3ODgsImV4cCI6MTY2NTA2MTM4OH0.r0xFbj9NZUXscQ6UCSj1-tQCcplUIaw7Zh9hDOqCR4Q"]

  // If token is missing, send 401 HTTP Code
  if (token === null) {
    res.sendStatus(401);
  }

  try {
    // If token is valid, add user property to the request object containing the payload
    req.user = jwt.verify(token, JWTSecret);
    // Proceed to the request
    next();
  } catch (error) {
    // If token is invalid, send 403 HTTP Code
    res.sendStatus(403);
  }
};

// Endpoint for generating valid JWT
app.get("/tokens", (req, res) => {
  // Generate signed JWT
  const token = jwt.sign(
    {
      date: Date.now(),
    },
    JWTSecret,
    { expiresIn: "1h" }
  );
  // Send JSON response containing the token
  res.status(200).json({ token });
});

// Endpoint for returning all entries
app.get("/entries", authenticateToken, (req, res) => {
  Entry.find({}, (error, docs) => {
    res.status(200).json(docs);
  });
});

// Endpoint for returning specific entry
app.get("/entries/:id", authenticateToken, (req, res) => {
  Entry.findById(req.params.id, (error, doc) => {
    res.status(200).json(doc);
  });
});

// Endpoint for creating new entries
app.post("/entries", authenticateToken, (req, res) => {
  const entry = new Entry({ note: req.body.note });
  entry.save().then(() => {
    res.status(200).json({ message: "Entry saved successfully" });
  });
});

// Endpoint for updating an entry
app.put("/entries/:id", authenticateToken, (req, res) => {
  Entry.findByIdAndUpdate(req.params.id, { note: req.body.note }, () => {
    res.status(200).json({ message: "Entry updated successfully" });
  });
});

// Entry for deleting an entry
app.delete("/entries/:id", authenticateToken, (req, res) => {
  Entry.findByIdAndDelete(req.params.id, (error) => {
    if (error) {
      res.status(404).json({ message: "Entry does not exists" });
    } else {
      res.status(200).json({ message: "Entry deleted" });
    }
  });
});

// Start the app
app.listen(port, () => {
  console.log(`App is now listening on port ${port}`);
});
