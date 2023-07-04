const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors'); 
const app = express();
const PORT = 5000;



app.get('/', (req, res) => {
	res.send('<p>Welcome to the home page!</p>' ); // Send a simple HTML response
  });
  
  app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
  });
  
