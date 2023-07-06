const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Add this line to enable CORS
app.use(bodyParser.json());

let dataObjects = [
  {
    username: 'Rycho',
    password: '123456',
    email: 'kacper@gmail.com',
  },
]; // Array to store the data objects received

app.post('/api/data', (req, res) => {
	const newData = req.body;
	
	// Check if the user profile exists
	const userExists = dataObjects.some((obj) => obj.username === newData.username);
  
	if (userExists) {
	  // User profile exists, handle the appropriate error or display a message
	  res.status(409).json({ success: false, message: 'User profile already exists' });
	} else {
	  // User profile doesn't exist, store the new user data
	  dataObjects.push(newData);
	  console.log('Data received:', newData);
	  res.status(200).json({ success: true, message: 'User profile created' });
	}
  });
  
app.post('/api/data', (req, res) => {
  const newData = req.body;
  dataObjects.push(newData);
  console.log(JSON.stringify(dataObjects, null, 2));
  console.log('Data received:', newData);
  res.sendStatus(200); // Send a success status code
});

app.delete('/api/data/:index', (req, res) => {
  const { index } = req.params;

  // Check if the index is valid
  if (index >= 0 && index < dataObjects.length) {
    // Remove the object at the specified index
    dataObjects.splice(index, 1);

    // Send a response indicating success
    res.json({ success: true });
  } else {
    // Send a response indicating failure
    res.status(404).json({ success: false, message: 'Object not found' });
  }
});

app.get('/api/data', (req, res) => {
  res.json(dataObjects); // Send the stored data objects as a response
});

app.get('/', (req, res) => {
  res.send('<p>Welcome to the home page!</p>'); // Send a simple HTML response
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
