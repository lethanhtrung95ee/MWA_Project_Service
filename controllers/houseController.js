const House = require('../models/houseModel');

function validateContentHouse(body, req) {
    //images
    if (Array.isArray(body.images)) {
        let somethingIsNotString = false;
        body.images.forEach(function (item) {
            if (typeof item !== 'string') {
                somethingIsNotString = true;
            }
        })
        if (!somethingIsNotString && body.images.length > 0) {
            body.images = [];
        }
    }
   
    //address
    if (typeof body.address.home_number !== "string") {
        body.address.home_number = 0
    }
    if (typeof body.address.street !== "string") {
        body.address.street = ""
    }
    if (typeof body.address.city !== "string") {
        body.address.city = ""
    }
    if (typeof body.address.state !== "string") {
        body.address.state = ""
    }
    if (typeof body.address.zipcode !== "string") {
        body.address.zipcode = ""
    }
    //description
    if (typeof body.description.square === "string") {
        try {
            body.description.square = parseInt(body.description.square)
        } catch (e) {
            body.description.square = 0
        }
    } else {
        body.description.square = 0
    }
    if (typeof body.description.prices === "string") {
        try {
            body.description.prices = parseInt(body.description.prices)
        } catch (e) {
            body.description.prices = 0
        }
    } else {
        body.description.prices = 0
    }
    if (typeof body.description.bed === "string") {
        try {
            body.description.bed = parseInt(body.description.bed)
        } catch (e) {
            body.description.bed = 0
        }
    } else {
        body.description.bed = 0
    }
    if (typeof body.description.bath === "string") {
        try {
            body.description.bath = parseInt(body.description.bath)
        } catch (e) {
            body.description.bath = 0
        }
    } else {
        body.description.bath = 0
    }
    if (typeof body.description.propertyDetail !== "string") {
        body.description.propertyDetail = ""
    }
    if (typeof body.description.garages === "string") {
        try {
            body.description.garages = parseInt(body.description.garages)
        } catch (e) {
            body.description.garages = 0
        }
    }
    if (typeof body.description.yearBuilt === "string") {
        try {
            body.description.yearBuilt = parseInt(body.description.yearBuilt)
        } catch (e) {
            body.description.yearBuilt = 0
        }
    } else {
        body.description.yearBuilt = 0
    }
    //publisher
    //init for first create - next time in should be here, so don't need to init again or fix
    //next time agent edit - they just edit their content not this part
    if (!body.publisher) {
        body.publisher = {
            "userId": req.user.userId,
            "fullName": req.user.fullName,
            "email": req.user.email,
            "appointments": []
        }
    }
    //interestedUserIds
    if (Array.isArray(body.interestedUserIds)) {
        let somethingIsNotString = false;
        body.interestedUserIds.forEach(function (item) {
            if (typeof item !== 'string') {
                somethingIsNotString = true;
            }
        })
        if (!somethingIsNotString && body.interestedUserIds.length > 0) {
            body.interestedUserIds = [];
        }
    }
    return body;
}

module.exports.searching = async function (req, res, next) {
    console.log("searching");

    function querySearchingAddress(homeNumber, street, city, state, zipcode) {
        let result = "";
        if (homeNumber) {
            result += `\"${homeNumber}\"`
        }
        if (street) {
            result += `\"${street}\"`
        }
        if (city) {
            result += `\"${city}\"`
        }
        if (state) {
            result += `\"${state}\"`
        }
        if (zipcode) {
            result += `\"${zipcode}\"`
        }
        return result;
    }

    function objectForSearching(querySearching, fromPrice, toPrice, fromSquare, toSquare, bed, bath, owner) {
        const obj = {};
        if (querySearching) {
            obj.$text = {$search: querySearching};
        }
        if (fromPrice) {
            obj["description.prices"] = {$gte: +fromPrice}
        }
        if (toPrice) {
            obj["description.prices"] = {$lte: +toPrice}
        }
        if (fromSquare) {
            obj["description.square"] = {$gte: +fromSquare}
        }
        if (toSquare) {
            obj["description.square"] = {$lte: +toSquare}
        }
        if (bed) {
            obj["description.bed"] = +bed
        }
        if (bath) {
            obj["description.bath"] = +bath
        }
        if (owner) {
            obj["publisher.userId"] = req.user.userId
        }
        return obj;
    }

    try {
        const {
            homeNumber, street, city, state, zipcode, fromPrice, toPrice, fromSquare, toSquare, bed, bath, owner, page
        } = req.query;
        const options = {
            page: parseInt(page),
            limit: 5
        };
        const querySearching = querySearchingAddress(homeNumber, street, city, state, zipcode);
        const obj = objectForSearching(querySearching, fromPrice, toPrice, fromSquare, toSquare, bed, bath, owner)
        const results = await House.paginate(obj, options);
        res.json(results);
    } catch (error) {
        next(error);
    }
}

module.exports.getHouseById = async function (req, res, next) {
    console.log("getHouseById");
    try {
        const {id} = req.params;
        const results = await House.findOne({_id: id})
        res.json(results);
    } catch (error) {
        next(error);
    }
}

module.exports.edit = async function (req, res, next) {
    console.log("edit");
    try {
        const body = validateContentHouse(req.body, req);
        let {id} = req.params;
        await House.updateOne({_id: id}, body, {upsert: true})
        res.json({"success": true});
    } catch (error) {
        next(error);
    }
}

module.exports.add = async function (req, res, next) {
    console.log("add");
    console.log(req.body)
    try {
        const body = validateContentHouse(req.body, req);
        await House.create(body)
        res.json({"success": true});
    } catch (error) {
        console.log("Catch", error)
        next(error);
    }
}

module.exports.createAppointment = async function (req, res, next) {
    console.log("createAppointment");

    function validate(body) {
        if (typeof body.fullName !== "string") {
            body.fullName = ""
        }
        if (typeof body.phoneNumber === "string") {
            try {
                body.phoneNumber = parseInt(body.phoneNumber)
            } catch (e) {
                body.phoneNumber = 0
            }
        }
        if (typeof body.email !== "string") {
            body.email = ""
        }
        if (typeof body.date !== "string") {
            body.date = new Date()
        }
        try {
            body.date = new Date(body.date)
        } catch (e) {
            body.date = new Date()
        }
        return body;
    }

    try {
        const {id} = req.params;
        const body = validate(req.body);
        body.userId = req.user.userId
        await House.updateOne({_id: id}, {$push: {"publisher.appointments": body}})
        res.json({"success": true});
    } catch (error) {
        next(error);
    }
}

module.exports.getAllAppointments = async function (req, res, next) {
    console.log("getAllAppointments");
    try {
        if (req.user.role !== "agent") {
            next("Invalid authorization");
        }
        const userId = req.user.userId
        const result = await House.find({"publisher.userId": userId},{"address":1,"publisher.appointments": 1})
        res.json(result);
    } catch (error) {
        next(error);
    }
}