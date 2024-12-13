const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Review = require('../models/Review');

//get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});


//get employee by email
router.get('/email/:email', async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.params.email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

//get employee by id
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});



//create employee
router.post('/', async (req, res) => {
    try {
        const employee = new Employee({
            full_name: req.body.full_name,
            email: req.body.email,
            position: req.body.position,
            role: req.body.role,
            password: req.body.password
        });
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

//update employee
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

//delete employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
    
}); 


//update employee password
// Update employee password
router.patch('/:id/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation checks
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Verify current password matches
        if (employee.password !== currentPassword) {
            return res.status(400).json({ 
                message: 'Current password is incorrect' 
            });
        }

        // Update password
        employee.password = newPassword;
        await employee.save();

        res.status(200).json({ 
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;