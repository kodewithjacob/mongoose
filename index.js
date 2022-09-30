const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

// Endpoint for returning all entries
app.get("/entries", (req, res) => {
  Entry.find({}, (error, docs) => {
    res.status(200).json(docs);
  });
});

// Endpoint for returning specific entry
app.get("/entries/:id", (req, res) => {
  Entry.findById(req.params.id, (error, doc) => {
    res.status(200).json(doc);
  });
});

// Endpoint for creating new entries
app.post("/entries", (req, res) => {
  const entry = new Entry({ note: req.body.note });
  entry.save().then(() => {
    res.status(200).json({ message: "Entry saved successfully" });
  });
});

// Endpoint for updating an entry
app.put("/entries/:id", (req, res) => {
  Entry.findByIdAndUpdate(req.params.id, { note: req.body.note }, () => {
    res.status(200).json({ message: "Entry updated successfully" });
  });
});

// Entry for deleting an entry
app.delete("/entries/:id", (req, res) => {
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
