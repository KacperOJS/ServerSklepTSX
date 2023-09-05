const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const UsersDB ={
	users:require('./data.json'),
	setUsers:function(data){
		this.users=data;
	}
}
const app = express();
const PORT = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());


const jwt = require('jsonwebtoken');
const { log } = require('console');

require('dotenv').config();
const fsPromises = require('fs').promises

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
const handleLogin = async (req, res) => {
	const { username, password } = req.body;
	const finduser = UsersDB.users.find(
	  (person) => person.username === username && person.password === password
	);
  
	if (!finduser) {
	  return res.status(401).json({ error: 'Invalid credentials' });
	}
  
	try {
	  const accessToken = jwt.sign(
		{ username: finduser.username },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '30s' }
	  );
  
	  const refreshToken = jwt.sign(
		{ username: finduser.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	  );
  
	  // Update the user's refreshToken
	  const updatedUsers = UsersDB.users.map((person) =>
		person.username === username ? { ...person, refreshToken } : person
	  );
	  UsersDB.setUsers(updatedUsers);
  
	  // Write updated users data to file
	  writeData(updatedUsers);
  
	  res.json({ accessToken });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: 'Internal server error' });
	}
  };
  
  const getallUsers = async (req,res)=> {
		const users = await UsersDB.users.map((user)=>{
			const u=user;
			return (`${u.username} ${u.password} ${u.email}`);

		})
	
		// If no users 
		if (!users?.length) {
			return res.status(400).json({ message: 'No users found' })
		}
	
		res.json(users)
	
  }

app.get('/userinfos',getallUsers)  
  app.post('/login', handleLogin);

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
