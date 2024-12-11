const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    full_name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role: {type:String, enum: ['admin', 'employee'], default: 'employee'},
    position: {type:String, required:true}
},{timestamps: true}
);

module.exports = mongoose.model('Employee', EmployeeSchema);