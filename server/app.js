var express  = require('express');
var app = express();
const cors = require('cors')
const path = require ('path')
const multer = require('multer');
var con = require('./connection');
var bodyParser = require('body-parser');
const sessions= require('express-session')
const cookieParser =require("cookie-parser")
app.use(cookieParser())
const storage = multer.memoryStorage(); 
const upload =multer({ storage:multer.memoryStorage()});
const nodemailer = require('nodemailer');

const crypto = require('crypto');

// Function to generate a secure token
function generateToken() {
  return crypto.randomBytes(20).toString('hex'); // Generating a hex-encoded random token
}


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user:"yiyerubyrecovery@gmail.com",
    pass:"ftfx zwcp wpsq cwcr"
  }
})
const sendEmail = (details) => {
  transporter.sendMail(details, (err) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email has been sent successfully!!');
    }
  });
};


app.use(cors());
const oneDay= 1000*60*60*24
var session; 
app.use(sessions({
    secret: 'super-secret-secret-key', // Change this to a strong, unique secret
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));



app.use(express.static(path.join(__dirname, '../public')));



app.get('/', (req, res) => {
  session = req.session;
    if(session.userid){
    res.redirect('/homepage')
  } else {
    res.redirect('/login');
  }
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  var rememberMe = req.body.rememberMe; // Assuming a checkbox with this name in your form

  // Perform authentication logic by querying the database
  con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      return res.send('Database error');
    }

    // Check if any rows were returned (authentication successful)
    if (results.length > 0) {
      // If "Remember Me" is checked, generate a token and send it as a cookie
      if (rememberMe){
      session = req.session;
      session.userid = results[0].username
      }

      // Redirect the user after successful login
      return res.send('<script>alert("Logging In"); window.location.href = "http://localhost:7000/homepage/";</script>');
    } else {
      return res.send('Login failed. Please check your credentials.');
    }
  });
});


app.get('/logout',(req,res) => {

  req.session.destroy();
  res.redirect('/');
});



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
app.get('/adoption', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/DisplayAdopt/displayAdopt.html'));
});
app.get('/adoptionform', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adoptionForm/adoptionForm.html'));
});




app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/DisplayRegister/display.html'));
});

app.post('/display', (req, res) => {
  const searchQuery = req.body.searchQuery; // Get the search query from the request body
  const breedFilter = req.query.breed; // Get the breed filter from the query string
  const genderFilter = req.query.gender;
  const  sizeFilter = req.query.size;
  

  let sql = 'SELECT petname, date, species, breed, gender, size, name, age, address, email, mno, CONVERT(petpic USING utf8) as petpic FROM registeredpet';

  // Add WHERE clause for search query or breed filtering
  if (searchQuery || breedFilter || genderFilter || sizeFilter) {
    sql += ' WHERE';
    const conditions = [];

    if (searchQuery) {
      conditions.push(`petname LIKE '%${searchQuery}%'`);
    }
    if (breedFilter) {
      conditions.push(`breed = '${breedFilter}'`);
    }
    if (genderFilter){
      conditions.push(`gender = '${genderFilter}'`);
    }    
    if (sizeFilter){
      conditions.push(`size = '${sizeFilter}'`);
    }    


    sql += ' ' + conditions.join(' AND ');
  }

  con.query(sql, (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ pets: results });
    }
  });
});


app.get('/breed-options', (req, res) => {
  con.query('SELECT DISTINCT breed FROM registeredpet', (error, results) => {
      if (error) {
          console.error('Error executing SQL query:', error);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          const breedOptions = results.map(row => row.breed);
          res.json({ breed: breedOptions });
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







app.post('/adopt', upload.single('apppic'), function (req, res) {
  const appname = req.body.appname;
  const address1 = req.body.address1;
  const age1 = req.body.age1;
  const response2 = req.body.response2;
  const live = req.body.live;
  const response1 = req.body.response1;
  const gender1 = req.body.gender1;
  const care = req.body.care;
  const appemail = req.body.appemail;
  const mno1 = req.body.mno1;
  const apppic = req.file.buffer.toString('base64'); // Use req.file.buffer to access the file data
  const response3 = req.body.response3;
  const reason = req.body.reason;

  con.connect(function (err) {
    if (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    console.log("Connected!!!")
    var sql = "INSERT INTO appform( appname, address1, age1, response2, live, response1, gender1, care, appemail, mno1,  apppic, response3) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    
    con.query(sql, [ appname, address1, age1, response2, live, response1, gender1, care,appemail, mno1,  apppic, response3, reason], function (err, result) {
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

app.get('/forgot', (req, res, next)=> {
  res.sendFile(path.join(__dirname, '../public/ResetPassword/ResetPassword.html'));
})


app.post('/forgot', (req, res, next) => {
  const email = req.body.email;

  // Validate the email format before querying the database
  // Add more validation as needed

  const sql = 'SELECT * FROM users WHERE email = ?';
  
  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (results.length > 0) {
      // Generate a secure token or link for password reset
      const token = generateToken(); // You should create a function to generate a secure token
      
      // Assuming a route for reset password
      let link = `http://localhost:7000/reset/${results[0].username}/${results[0].email}/${token}`;
      // Now send the link through email
      const mailOptions = {
        from: 'yourEmail@example.com',
        to: email,
        subject: 'Password Reset Link',
        text: `Click this link to reset your password: ${link}`,
      };
      
      sendEmail(mailOptions); // Send the password reset link via email
     res.send('<script>alert("Password reset link has been sent to your email."); window.location.href = "http://localhost:7000/login";</script>');
    } else {
      res.status(404).send('Email address not found in our records.');
    }
  });
});



















app.get('/reset/:username/:email/:token', (req, res, next)=> {
  res.sendFile(path.join(__dirname, '../public/ResetPassword/ChangePassword.html'));
})


app.post('/reset/:username/:email/:token', (req, res, next)=> {
  const { username, email } = req.params;
  const newPassword = req.body.password; 
  const sql = 'UPDATE users SET password = ? WHERE username = ? AND email = ?';
  con.query(sql, [newPassword, username, email], (err, result) => {
    if (err) {
      console.error('Error resetting password:', err);
      return res.status(500).json({ message: 'Error resetting password' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'Password reset successfully' });
  })
  
})


