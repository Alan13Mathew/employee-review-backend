const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    employeeId: {type:mongoose.Schema.Types.ObjectId, ref: 'Employee', required:true},
    reviewerId: {type:mongoose.Schema.Types.ObjectId, ref: 'Employee', required:true},
    period: {type:String, required:true},
    status: {type:String, enum: ['pending', 'completed'], default: 'pending'},
    rating: {type:Number, min:1, max:5},
    feedback: {type:String},
    createdAt: {type:Date, default: Date.now},
    dueDate: {type:Date, required:true}
},{timestamps: true}
);

module.exports = mongoose.model('Review', ReviewSchema);