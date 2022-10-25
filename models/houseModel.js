const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const HouseSchema = new mongoose.Schema({
    images:[String],
    address: {
        home_number: Number,
        street: String,
        city: String,
        state: String,
        zipcode: Number
    },
    description: {
        typeOfBuilding: String,
        square: Number,
        prices: Number,
        bed: Number,
        bath: Number,
        propertyDetail: String,
        garages: Number,
        yearBuilt: Number
    },
    publisher:{
        userId: String,
        fullName: String,
        email: String,
        appointments: [{
            userId: String,
            fullName: String,
            phoneNumber: Number,
            email: String,
            appointmentDate: Date
        }]
    },
    interestedUserIds: [String]
}, { versionKey: false });

HouseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('houses', HouseSchema);