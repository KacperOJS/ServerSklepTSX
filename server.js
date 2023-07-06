const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

let dataObjects = readData();

app.post('/api/data', (req, res) => {
  const newData = req.body;

  const userExists = dataObjects.some((obj) => obj.username === newData.username);

  if (userExists) {
    res.status(409).json({ success: false, message: 'User profile already exists' });
  } else {
    dataObjects.push(newData);
    console.log('Data received:', newData);

    writeData(dataObjects);

    res.status(200).json({ success: true, message: 'User profile created' });
  }
});

app.delete('/api/data/:index', (req, res) => {
  const { index } = req.params;

  if (index >= 0 && index < dataObjects.length) {
    dataObjects.splice(index, 1);

    writeData(dataObjects);

    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Object not found' });
  }
});

app.get('/api/data', (req, res) => {
  res.json(dataObjects);
});

app.get('/', (req, res) => {
  res.send('<p>Welcome to the home page!</p>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
