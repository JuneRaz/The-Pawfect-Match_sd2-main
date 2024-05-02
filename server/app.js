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
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const jwt = require('jsonwebtoken')







const crypto = require('crypto');

// Function to generate a secure token
function generateToken() {
  return crypto.randomBytes(20).toString('hex'); // Generating a hex-encoded random token
}

const secretKey = '123123123123asdasdkljqwheihasjkdhkdjfhiuhq983e12heijhaskjdkasbd812hyeijahsdkb182h3jaksd';



 

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


function notAuthenticated(req,res,next){
  if(req.cookies.UserRegistered){
    return res.redirect('/homepage');
  }
  next();
}

const loggedIn = (req, res, next) => {
  // Check if the user is authenticated (assuming JWT is used for authentication)
  if (req.cookies.UserRegistered) {
      try {
          const decoded = jwt.verify(req.cookies.UserRegistered, secretKey);

          // Assuming you have a 'newuser' table with a unique identifier 'id'
          con.query('SELECT * FROM newuser WHERE id = ?', [decoded.id], (err, result) => {
              if (err || result.length === 0) {
                 
                  return res.redirect('/login'); 
                  
              }
              req.user = result[0];
              return next();
          });
      } catch (err) {
 
          return res.redirect('/login'); 
      
      }
  } else {
    
      return res.redirect('/login'); 
      
  }
};


const logout = (req, res)=>{
  res.clearCookie("UserRegistered");
  res.redirect("/login");
}












app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const jwtExpire = '3h';


  if (!username || !password) {
    return res.json({ status: "error", error: "Please check your credentials" });
  } else {
    con.query('SELECT * FROM newuser WHERE username = ?', [username], (error, results) => {
      if (error) throw error;

      if (!results[0] || !bcrypt.compareSync(password, results[0].password)) {
        return res.json({ status: "error", error: "Incorrect Email or password" });
      } else {
        const token = jwt.sign({ id: results[0].id }, secretKey, {
          expiresIn: jwtExpire
        });

        const cookieOptions = {
          maxAge: 1000 * 60 * 60 * 4, // 1 hour in milliseconds
          httpOnly: true
        }

        res.cookie("UserRegistered", token, cookieOptions);
        return res.send('<script>alert("Logging In"); window.location.href = "/homepage";</script>');
      }
    });
  }
});

app.get('/logout', logout)

app.get('/DevInfo', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Developer.html'));
});
app.get('/drinne', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Drinne.html'));
});
app.get('/ethan', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Ethan.html'));
});
app.get('/flores', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Flores.html'));
});
app.get('/justine', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Justine.html'));
});

app.get('/mike', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Devinfo/Mike.html'));
});



app.get('/SurrenderedPets', loggedIn, (req, res) => {
  res.render('pets');
});

app.get('/LandingPage', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/LandingPage/LandingPage.html'));
});
app.get('/homepage', loggedIn, (req, res) => {
  if(req.user){
    res.sendFile(path.join(__dirname, '../public/HomePage/homepage.html'));
  }else{
    res.sendFile(path.join(__dirname, '../public/user/Signup.html'));
  }
 
}); 
app.get('/ack',loggedIn,(req, res) => {
  res.sendFile(path.join(__dirname, '../public/HomePage/ack.html'));
});

app.get('/surrender',loggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, '../public/surrender/index.html'));
});
app.get('/login', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/user/Signup.html'));
});
app.get('/adoption', loggedIn,(req, res) => {
  res.sendFile(path.join(__dirname, '../public/DisplayAdopt/displayAdopt.html'));
});
app.get('/adoptionform',loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adoptionForm/adoptionForm.html'));
});
app.get('/profile',loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ProfilePage/profile.html'));
});
app.get('/update',loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Update/update.html'));
});
app.get('/description',loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Update/updes.html'));
});

app.get('/Service', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/DonationPage/DonationPage.html'));
});

app.get('/Updatesel',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/UpdatePet/updatepet.html'));
});

app.get('/Forum',loggedIn,(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/Forum/index.html'));
});



app.post('/description',loggedIn, (req,res)=>{
  const userID = req.user.id;
  const newDescription = req.body.description;

  let sql = "UPDATE newuser SET description = ? WHERE id = ?";
  con.query(sql, [newDescription, userID], function(err, result) {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }

    console.log("1 record updated");
    return res.send('<script>alert("Bio Info Updated"); window.location.href = "/profile";</script>');
  });
})


app.get('/updateProfpic',loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Update/upprof.html'));
});
app.post('/updateProfdets', loggedIn, upload.single('profilePicture'), (req, res) => {
  const userID = req.user.id;
  const newpic = req.file.buffer.toString('base64');
  const fname = req.body.fname;
  const ageu = req.body.ageu;
  const ugen = req.body.ugen;
  const addu = req.body.addu;
  const umno = req.body.umno;

  let sql = "UPDATE newuser SET fname=?, ageu=?, ugen=?, addu=?, umno=?, profpic=? WHERE id=?";
  const values = [fname, ageu, ugen, addu, umno, newpic, userID];

  con.query(sql, values, function(err, result) {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }

    return res.send('<script>alert("Profile Info Updated"); window.location.href = "/profile";</script>');
  });
});


app.post('/profile',loggedIn,(req,res) =>{
  const userId = req.user.id;
  let sql = 'SELECT username, email,account,description,fname,ageu,ugen,addu,umno,CONVERT(profpic USING utf8) as profpic FROM newuser WHERE id = ?';

  con.query (sql,[userId], (err, results)=>{
    if (err){
      console.error('Error executing SQL query:', err);
      res.status(500).json({ err: 'Internal server error' });
    }else {
      res.json({ appdata: results });
    }
  });
});




app.get('/display', notAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/DisplayRegister/display.html'));
});

app.post('/display', (req, res) => {
  const searchQuery = req.body.searchQuery; // Get the search query from the request body
  const breedFilter = req.query.breed; // Get the breed filter from the query string
  const genderFilter = req.query.gender;
  const  sizeFilter = req.query.size;
  

  let sql = 'SELECT id, petname, date, species, breed, gender, size, name, age, address, email, mno, CONVERT(petpic USING utf8) as petpic FROM registeredpet';

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



app.post('/displaypost', loggedIn, (req, res) => {
  const userEmail = req.user.email;

  

  let sql = 'SELECT id, petname, date, species, breed, gender, size, name, age, address, mno,email, CONVERT(petpic USING utf8) as petpic FROM registeredpet WHERE email =?';



  con.query(sql, [userEmail],(error, results) => {
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
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;



  // Check if the password and password confirmation match
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Password and password confirmation do not match' });
  }

  // Check if the email already exists in the database
  const checkEmailQuery = "SELECT * FROM newuser WHERE email = ?";
  con.query(checkEmailQuery, [email], function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      // Email already exists, return an error
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Check if the username already exists in the database
    const checkUsernameQuery = "SELECT * FROM newuser WHERE username = ?";
    con.query(checkUsernameQuery, [username], function (error, usernameResults) {
      if (error) throw error;

      if (usernameResults.length > 0) {
        // Username already exists, return an error
        return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
      }

      // Email and username are unique, proceed with hashing the password and registration
      bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) throw err;

        const insertUserQuery = "INSERT INTO newuser (username, email, password) VALUES (?, ?, ?)";
        con.query(insertUserQuery, [username, email, hashedPassword], function (error, result) {
          if (error) throw error;
          res.status(200).json({ message: 'Account registered successfully' });
        });
      });
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
  const apppic = req.file.buffer.toString('base64');
  const response3 = req.body.response3;
  const reason = req.body.reason;
  const email = req.body.email;
  con.connect(function (err) {
    if (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    console.log("Connected!!!")
    var sql = "INSERT INTO appform( appname, address1, age1, response2, live, response1, gender1, care, appemail, mno1, apppic, response3, reason) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    con.query(sql, [appname, address1, age1, response2, live, response1, gender1, care, appemail, mno1, apppic, response3, reason], function (err, result) {
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
        return;
      }

      if (result.insertId) {
        const token = generateToken();
        const sanitizedAppName = appname.replace(/\s/g, '_');
        let link = `http://localhost:7000/applicantForm/${sanitizedAppName}/${appemail}/${token}`;
        const mailOptions = {
          from: 'yourEmail@example.com',
          to: email, // Specify your adoption email address
          subject: 'New Adoption Application',
          text: `A new adoption application has been submitted.\n\nApplicant Name: ${appname}\nApplicant Email: ${appemail}\n... click this link to view my application form(${link})`,
        };
        sendEmail(mailOptions); 
        res.status(200).json({ message: 'Your application form has been sent to the recipient' });
      } else {
        res.status(404).send('Error inserting data into the database.');
      }
    });
  });
});

app.get('/applicantForm/:appname/:appemail/:token', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/adoptionForm/applicantform.html'));
});

app.post('/applicantForm/:appname/:appemail/:token', (req, res, next) => {
  const { appemail } = req.params;
  

  let sql = 'SELECT appname, address1, age1, response2, live, response1, gender1, care, mno1, response3, reason, CONVERT(apppic USING utf8) as appic FROM appform WHERE appemail = ? ';
  con.query(sql, [appemail],(error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ appdata: results });
    }
  });
});




app.get('/forgot', notAuthenticated, (req, res, next)=> {
  res.sendFile(path.join(__dirname, '../public/ResetPassword/ResetPassword.html'));
})


app.post('/forgot',  (req, res, next) => {
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




app.get('/delete-pet', function (req, res) {
  con.connect(function (error) {
      var sql = "DELETE FROM registeredpet WHERE id=?";
      var id = req.query.id;
      con.query(sql, [id], function (error, result) {
          if (error) {
              console.log(error);
              res.json({ success: false, message: 'Deletion failed' });
          } else {
            res.json({ success: true, message: 'Deletion successful' });  
            //res.end('<script>window.close();</script>');
          }
         
      });
  });
});    


app.get('/fave-pet', loggedIn, function(req,res){
  const userID = req.user.id;
  const petID = req.query.id;
  con.connect(function(error) {
    if (error) {
      console.log(error);
      res.json({ success: false, message: 'Database connection failed' });
      return;
    }
    
    var sql = "INSERT INTO favorite (pet, user) VALUES (?, ?)";
    con.query(sql, [petID, userID], function(error, result) {
      if (error) {
        console.log(error);
        res.json({ success: false, message: 'Adding to favorites failed' });
      } else {
        res.end('<script>alert("Added to favorites"); window.close();</script>');
        // Optionally close the window if adding to favorites was successful
        //res.end('<script>window.close();</script>');
      }
    })
  })
})






app.post('/Updatesel',loggedIn,upload.single('petpic'), (req,res)=>{
  const species = req.body.species;
  const petname = req.body.petname;
  const breed = req.body.breed;
  const gender = req.body.gender;
  const size = req.body.size;
  const petpic = req.file.buffer.toString('base64');

  let sql = "UPDATE registeredpet SET species = ?, breed = ?, gender = ?, size= ?, petpic=? WHERE petname = ?";
  const values = [species, breed,gender,size,petpic,petname];
  con.query(sql, values, function(err, result) {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }

    return res.send('<script>alert("Pet info Updated"); window.location.href = "/profile";</script>');
  });
  
})



/*
app.post('/display-fave', loggedIn, (req, res) => {
  const userId = req.user.id; // Assuming you can get the user ID from the request

  const selectFavoriteQuery = "SELECT pet FROM favorite WHERE user = ?";
  const selectRegisteredPetQuery = "SELECT petname, date, species, breed, gender, size, CONVERT(petpic USING utf8) as petpic FROM registeredpet WHERE id = ?";

  con.query(selectFavoriteQuery, [userId], (error, favoriteResults) => {
    if (error) {
      console.error("Error selecting favorite: ", error);
      return res.status(500).json({ error: "Error selecting favorite" });
    }

    // Assuming you process favoriteResults here and get the pet id
    const petId = favoriteResults[0].pet;

    // Fetch pet details using pet id
    con.query(selectRegisteredPetQuery, [petId], (error, petResults) => {
      if (error) {
        console.error("Error selecting pet details: ", error);
        return res.status(500).json({ error: "Error selecting pet details" });
      }

      // Assuming you process petResults here

      res.status(200).json({ favorite: favoriteResults, pet: petResults });
    });
  });
});
*/


app.post('/display-fave', loggedIn, (req, res) => {
  const userID = req.user.id;
  let sql = `
    SELECT 
      rp.id, rp.petname, rp.date, rp.species, rp.breed, rp.gender, rp.size, rp.name, 
      rp.age, rp.address, rp.mno, rp.email, CONVERT(rp.petpic USING utf8) as petpic
    FROM 
      registeredpet rp
    INNER JOIN 
      favorite f ON rp.id = f.pet
    WHERE 
      f.user = ?;
  `;

  con.query(sql, [userID], (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ pets: results });
    }
  });
});


app.get('/delete-fave', function (req, res) {
  con.connect(function (error) {
      var sql = "DELETE FROM favorite WHERE pet=?";
      var id = req.query.id;
      con.query(sql, [id], function (error, result) {
          if (error) {
              console.log(error);
              res.json({ success: false, message: 'Deletion failed' });
          } else {
            res.end('<script>alert("Selected fave deleted"); window.close();</script>');
            
            //res.json({ success: true, message: 'Selected fave deleted' });  
            //res.end('<script>window.close();</script>');
          }
         
      });
  });
});    

app.post('/publish', loggedIn, upload.single('imageup'), function (req, res) {
  const userID = req.user.id;
  const comment = req.body.comment;
  const username = req.user.fname;
  
  //const imageup = req.file.buffer.toString('base64');
  
  con.connect(function (error) {
    if (error) {
      console.log(error);
      res.json({ success: false, message: 'Database connection failed' });
      return;
    }
    
    var sql = "INSERT INTO discussion ( post, user,userid) VALUES ( ?, ?,?)";
    con.query(sql, [ comment, username,userID], function (error, result) {
      if (error) {
        console.log(error);
        res.json({ success: false, message: 'Publishing failed' });
      } else {
        res.end('<script>alert("Post have been publish"); window.location.href = "/Forum";</script>');
        // Optionally close the window if adding to favorites was successful
        //res.end('<script>window.close();</script>');
      } 
    });
  });
});

app.post('/userDiscussion',loggedIn,(req,res) =>{
  const userId = req.user.id;
  let sql = 'SELECT post,user FROM discussion';

  con.query (sql,[userId], (err, results)=>{
    if (err){
      console.error('Error executing SQL query:', err);
      res.status(500).json({ err: 'Internal server error' });
    }else {
      res.json({ appdata: results });
    }
  });
});


/*
app.post('/Mydiscussion', loggedIn, (req, res) => {
  let sql = `
      SELECT 
          nu.fname, 
          CONVERT(nu.profpic USING utf8) as profpic,
          d.id,
          d.date,
          d.post
      FROM 
          newuser nu
      INNER JOIN 
          discussion d ON nu.id = d.userid
      WHERE
          d.parent_comment = ''; -- Add condition to retrieve only posts, not comments
  `;

  con.query(sql, (err, results) => {
      if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json({ appdata: results });
      }
  });
});

*/

app.post('/publishComment', loggedIn, upload.single('imageup'), function (req, res) {
  const userID = req.user.id;
  const pubComment = req.body.pubcomment;
  const username = req.user.fname;
  const postId = req.body.postId;


  
 
  con.connect(function (error) {
    if (error) {
      console.log(error);
      res.json({ success: false, message: 'Database connection failed' });
      return;
    }
    
    var sql = "INSERT INTO discussion ( post, user,userid,parent_comment) VALUES ( ?, ?,?,?)";
    con.query(sql, [ pubComment, username,userID,postId], function (error, result) {
      if (error) {
        console.log(error);
        res.json({ success: false, message: 'Publishing failed' });
      } else {
        res.end('<script>alert("Comment have been publish"); window.location.href = "/Forum";</script>');
        // Optionally close the window if adding to favorites was successful
        //res.end('<script>window.close();</script>');
      } 
    });
  });
});



/*
app.get('/getPostComments/:postId',loggedIn, function (req, res) {
  const postId = req.params.postId;

       let sql = `
      SELECT 
          nu.fname, 
          CONVERT(nu.profpic USING utf8) as profpic,
          d.id,
          d.date,
          d.post
      FROM 
          newuser nu
      INNER JOIN 
          discussion d ON nu.id = d.userid
      WHERE
          d.parent_comment = ?;
  `;

  con.query(sql, [postId],(err, results) => {
      if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json({ comments: results });
      }
  });
});
*/

app.post('/discussion', loggedIn, (req, res) => {
  // Check if the request body contains a postId
  if (req.body.postId) {
      // If postId is present, fetch comments for the post
      const postId = req.body.postId;
      let sql = `
          SELECT 
              nu.fname, 
              CONVERT(nu.profpic USING utf8) as profpic,
              d.id,
              d.user,
              d.date,
              d.post
          FROM 
              newuser nu
          INNER JOIN 
              discussion d ON nu.id = d.userid
          WHERE
              d.parent_comment = ?;
      `;

      con.query(sql, [postId], (err, results) => {
          if (err) {
              console.error('Error executing SQL query:', err);
              res.status(500).json({ error: 'Internal server error' });
          } else {
              res.json({ comments: results });
          }
      });
  } else {
      // If postId is not present, fetch all posts
      let sql = `
          SELECT 
              nu.fname, 
              CONVERT(nu.profpic USING utf8) as profpic,
              (SELECT COUNT(*) FROM discussion d2 WHERE d2.parent_comment = d.id) AS total_rows_with_parent_comment,
              d.id,
              d.date,
              d.post
          FROM 
              newuser nu
          INNER JOIN 
              discussion d ON nu.id = d.userid
          WHERE
              d.parent_comment = ''; -- Add condition to retrieve only posts, not comments
      `;

      con.query(sql, (err, results) => {
          if (err) {
              console.error('Error executing SQL query:', err);
              res.status(500).json({ error: 'Internal server error' });
          } else {
              res.json({ appdata: results });
          }
      });
  }
});









const port = 7000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

