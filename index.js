const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  `mongodb+srv://kodego:kodegopassword@kodego.xb5nkku.mongodb.net/?retryWrites=true&w=majority`
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

app.post("/entries", (req, res) => {
  const entry = new Entry({ note: req.body.note });
  entry.save().then(() => {
    res.status(200).json({ message: "entry saved successfully" });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
