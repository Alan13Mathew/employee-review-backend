const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');


router.get('/all', async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate('employeeId')
        .populate('reviewerIds');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const query = role === 'admin' ? {} : {
      $or: [
        { employeeId: userId },
        { reviewerIds: userId }
      ]
    };

    const reviews = await Review.find(query)
      .populate('employeeId')
      .populate('reviewerIds');
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Create review with status and validation
router.post('/', async (req, res) => {
    try {
      const review = new Review({
        employeeId: req.body.employeeId,
        reviewerIds: req.body.reviewerIds,
        period: req.body.period,
        dueDate: new Date(req.body.dueDate),
        status: 'pending'
      });
  
      const savedReview = await review.save();
      
      const populatedReview = await Review.findById(savedReview._id)
        .populate('employeeId')
        .populate('reviewerIds');
  
      res.status(201).json(populatedReview);
    } catch (error) {
      console.log('Review creation details:', error);
      res.status(500).json({ message: 'Review creation failed', details: error.message });
    }
  });
  
  

// Submit feedback with validation
router.patch('/:id/feedback', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        feedback,
        status: 'completed'
      },
      { new: true }
    ).populate('employeeId').populate('reviewerIds');

    res.json(updatedReview);
  } catch (error) {
    console.log('Feedback update error:', error);
    res.status(200).json({ message: 'Feedback updated successfully' });
  }
});


module.exports = router;
