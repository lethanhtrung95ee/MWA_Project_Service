const Account = require('../models/accountModel');
const bcrypt = require("bcrypt");

module.exports.getByUserId = async function (req, res, next) {
    console.log("getByUserId");
    try {
        const {userId} = req.user;
        console.log(userId)
        const results = await Account.findOne({"userId": userId})
        res.json(results);
    } catch (error) {
        next(error);
    }
}

module.exports.add = async function (req, res, next) {
    console.log("add");

    async function validate(body) {
        if (typeof body.userId !== "string") {
            body.userId = ""
        }
        if (typeof body.password !== "string") {
            body.password = ""
        } else {
            //hash password
            await bcrypt
                .hash(body.password, 5)
                .then((hash) => {
                    body.password = hash
                })
        }
        if (typeof body.email !== "string") {
            body.email = ""
        }
        if (typeof body.fullName !== "string") {
            body.fullName = ""
        }
        if (typeof body.dateOfBirth !== "string") {
            body.dateOfBirth = new Date()
        }
        if (typeof body.role !== "string") {
            body.role = ""
        }
        if (typeof body.phoneNumber === "string") {
            try{
                body.phoneNumber = parseInt(body.phoneNumber)
            } catch (e){
                body.phoneNumber = 0
            }
        }
        return body;
    }

    try {
        const body = await validate(req.body)
        await Account.create(body)
        res.json({success:true});
    } catch (error) {
        next(error);
    }
}