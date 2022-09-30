const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  `mongodb+srv://user:password@kodego.xb5nkku.mongodb.net/?retryWrites=true&w=majority`
);

const Entry = mongoose.model("Entry", {
  note: String,
  date: { type: Date, default: Date.now },
});

// Routes

app.get("/entries", (req, res) => {
  Entry.find({}, function (err, docs) {
    res.status(200).json(docs);
  });
});

app.get("/entries/:id", (req, res) => {
  Entry.findById(req.params.id, function (err, doc) {
    res.status(200).json(doc);
  });
});

app.post("/entries", (req, res) => {
  const entry = new Entry({ note: req.body.note });
  entry.save().then(() => {
    res.status(200).json({ message: "entry added successfully" });
  });
});

app.put("/entries/:id", (req, res) => {
  Entry.findByIdAndUpdate(
    req.params.id,
    { note: req.body.note },
    function (err, doc) {
      res.status(200).json({ message: "entry updated successfully" });
    }
  );
});

app.delete("/entries/:id", (req, res) => {
  Entry.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: "entry deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
