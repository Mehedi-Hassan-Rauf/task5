const express = require('express');
const cors = require('cors');
const { Parser } = require('json2csv');
const { generateUserData } = require('./data/userGenerator');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/data', (req, res) => {
  const { region, errors, seed } = req.query;
  const data = generateUserData(region, parseInt(errors), parseInt(seed), 20);
  res.json(data);
});


app.get('/api/export', (req, res) => {
  const { region, errors, seed } = req.query;
  const data = generateUserData(region, parseInt(errors), parseInt(seed), 20);
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment('user_data.csv');
  res.send(csv);
});

// Test route
app.get("/", (req, res) => {
    res.json("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
