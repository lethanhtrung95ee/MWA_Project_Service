const jwt = require('jsonwebtoken');
const Account = require('../models/accountModel');
const bcrypt = require('bcrypt');

module.exports.login = async function (req, res, next) {
    console.log("login");
    const {userId, password} = req.body;

    const userDb = await Account.findOne({userId});
    if (userDb) {
        bcrypt.compare(password, userDb.password, (err, isMatch) => {
            if (err) {
                next({ error: err });
            } else if (!isMatch) {
                console.log(`Password not matched!!!`);
                next({ error: "Login failed!" });
            } else {
                console.log(`${userDb.roles} Seeker Password matches!`);
                const token = jwt.sign({ userId: userDb.userId, fullName: userDb.fullName, email: userDb.email, role: userDb.role },
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: process.env.EXPIRES_IN}, null);
                console.log(`${userDb.role} token: ${token}`)
                return res.status(200).json({success:true, token: token });
            }
        });
    } else {
        console.log(`Email not matched!!!`);
        next({error: "Login failed!"});
    }
}