var con = require('./connection');
var express  = require('express');
var app = express();
const path = require ('path')
var bodyParser = require('body-parser');
const cors = require('cors')
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload =multer({ storage:multer.memoryStorage()});


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));



app.use(express.static(path.join(__dirname, '../public')));

app.get('/SurrenderedPets', (req, res) => {
  res.render('pets');
});

app.get('/LandingPage', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/LandingPage/LandingPage.html'));
});
app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/HomePage/homepage.html'));
});
app.get('/surrender', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/surrender/index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/user/Signup.html'));
});



app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/DisplayRegister/display.html'));
});

app.post('/display', (req, res) => {
  con.query('SELECT * FROM registeredpet', (error, results) => {
    if (error) {
      // Handle the error (e.g., log it or send an error response to the client)
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Send the results as a JSON response to the client
      res.json({ pets: results });
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Perform authentication logic by querying the database
  con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      return res.send('Database error');
    }

    // Check if any rows were returned (authentication successful)
    if (results.length > 0) {
      res.send('<script>alert("Logging In"); window.location.href = "http://localhost:7000/homepage/";</script>');
    } else {
      res.send('Login failed. Please check your credentials.');
    }
  });
});


app.post('/register', function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const plainPassword = req.body.password;
  const account = req.body.account;

  // Hash the password using bcrypt
  /* bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
      
  });*/
  con.connect(function (error) {
      if (error) throw error;
      const sql = "INSERT INTO users (username, email, password, account) VALUES (?, ?, ?, ?)";
      con.query(sql, [username, email, plainPassword, account], function (error, result) {
          if (error) throw error;
          console.log("Registered Successfully");
      });
  });
});



app.post('/insert', upload.single('petpic'), function (req, res) {
  const date = req.body.date;
  const name = req.body.name;
  const address = req.body.address;
  const age = req.body.age;
  const species = req.body.species;
  const petname = req.body.petname;
  const breed = req.body.breed;
  const gender = req.body.gender;
  const size = req.body.size;
  const email = req.body.email;
  const mno = req.body.mno;
  const petpic = req.file.buffer.toString('base64'); // Use req.file.buffer to access the file data

  con.connect(function (err) {
    if (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    console.log("Connected!!!")
    var sql = "INSERT INTO registeredpet(date, name, address, age, species, petname, breed, gender, size, email, mno, petpic) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    con.query(sql, [date, name, address, age, species, petname, breed, gender, size, email, mno, petpic], function (err, result) {
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
        return;
      }

      console.log("1 record inserted");
      res.status(200).json({ message: 'Record inserted successfully' });
    });
  });
});


const port = 7000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




/*
app.post('/login', function (req, res) {
  const enteredUsername = req.body.username;
  const enteredPassword = req.body.password;
  const sql = "SELECT password FROM users WHERE username = ? LIMIT 1";

  con.query(sql, [enteredUsername], function (error, result) {
      if (error) throw error;

      if (result.length === 1) {
         

              if (enteredPassword) {
                  // Passwords match, user is authenticated
                  // Proceed with login logic, for example, you can redirect the user to a dashboard page
                  res.send('<script>alert("Login successful! Redirecting to dashboard..."); </script>'); 
              } else {
                  // Passwords don't match, show an error or redirect back to login page
                  res.send('<script>alert("Invalid username or password")');
              }
          
      } else {
          // User not found, show an error or redirect back to login page
          res.send('<script>alert("User not found");');
      }
  });
});*/
