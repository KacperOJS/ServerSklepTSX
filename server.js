const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

const registeredUsers = [
  {
    name: 'admin',
    password: 'admin',
    email: 'emailadmin',
  },
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('<p>Welcome to the home page!</p>');
});

app.post('/register', (req, res) => {
  const { name, password, email } = req.body;
  const user = { name, password, email };
  registeredUsers.push(user);

  res.status(200).json({ message: 'Account created successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
