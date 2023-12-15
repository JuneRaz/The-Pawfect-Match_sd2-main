const localstrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt');


function initialize(passport,getUsername,){
    const authenticateUsers = async(username,hashedPassword,done) => {
        const user = getUsername(username)
        if(user == null){
            return done(null,false, {message: "No username Found"})
        }
        try{
            if(await bcrypt.compare(hashedPassword, user.hashedPassword)){
                return done(null,user)
            }
            else{
                return done(null,false, {message: "Password incorrect!."})
            }

        }catch (e){
            console.log(e);
            return done(e)

        }
    }
    passport.use(new localstrategy ({usernameField: 'username'}, authenticateUsers))
  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
}

module.exports = initialize;
