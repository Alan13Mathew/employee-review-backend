const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');

//get reviews
router.get('/', async (req, res) => {
  try {
      if (!req.query.userId) {
          // Admin view - get all reviews
          const reviews = await Review.find()
              .populate('employeeId', 'full_name')
              .populate('reviewerId', 'full_name');
          return res.status(200).json(reviews);
      }

      // Employee view - get reviews where they are either the reviewer or the employee
      const reviews = await Review.find({
          $or: [
              { reviewerId: req.query.userId },
              { employeeId: req.query.userId }
          ]
      })
      .populate('employeeId', 'full_name')
      .populate('reviewerId', 'full_name');

      res.status(200).json(reviews);
  } catch (err) {
      res.status(500).json({message: err.message});
  }
});





//create reviews
router.post('/', async (req, res) => {
    try {
      console.log('Received review data:', req.body);
      
      const review = new Review({
        employeeId: new mongoose.Types.ObjectId(req.body.employeeId),
        reviewerId: new mongoose.Types.ObjectId(req.body.reviewerId),
        period: req.body.period,
        dueDate: new Date(req.body.dueDate)
      });
  
      const newReview = await review.save();
      console.log('Review saved:', newReview);
      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ 
        message: error.message,
        stack: error.stack 
      });
    }
  });
  

//submit feedback

router.patch('/:id/feedback', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        review.status = 'completed';
        review.rating = req.body.rating;
        review.feedback = req.body.feedback;

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;