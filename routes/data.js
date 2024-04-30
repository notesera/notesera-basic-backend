const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');

  router.get('/all', async (req, res) => {
    try {
      const allData = await Data.find();
      
      res.json(allData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  
  router.get('/:id', async (req, res) => {
    try {
      const data = await Data.findById(req.params.id);
      
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // to get list of colleges
  router.get('/all/colleges', async (req, res) => {
    try {
      const allColleges = await Data.find().distinct('college');
      res.json(allColleges);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // to get years for a specific college
  router.get('/all/:college/years', async (req, res) => {
    try {
      const college = req.params.college;
      const years = await Data.find({ college }).distinct('year');
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // to get types for a specific college and year
  router.get('/all/:college/:year/types', async (req, res) => {
    try {
      const college = req.params.college;
      const year = req.params.year;
      const types = await Data.find({ college, year }).distinct('type');
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Route to get subjects for a specific college, year, and type
  router.get('/all/:college/:year/:type/subjects', async (req, res) => {
    try {
      const { college, year, type } = req.params;

      // Find distinct subjects based on college, year, and type
      const subjects = await Data.find({ college, year, type }).distinct('subject');
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // to get links for a specific college, year, type and Subject
  router.get('/all/:college/:year/:type/:subject/links', async (req, res) => {
    try {
      const college = req.params.college;
      const year = req.params.year;
      const type = req.params.type;
      const subject = req.params.subject;
      const links = await Data.find({ college, year, type, subject }).select('link');
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/add',authMiddleware,isAdmin, async (req, res) => {
    try {
      const { college, year, type, subject, link } = req.body;
      
      const newData = new Data({ college, year, type, subject, link });
      await newData.save();
      
      res.status(201).json({ message: 'Data added successfully', data: newData });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      console.log(error);
    }
  });
  router.delete('/:id',authMiddleware,isAdmin, async (req, res) => {
    try {
      const deletedData = await Data.findByIdAndDelete(req.params.id);
      
      if (!deletedData) {
        return res.status(404).json({ message: 'Data not found' });
      }
      
      res.json({ message: 'Data deleted successfully', data: deletedData });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  router.put('/:id',authMiddleware,isAdmin ,async (req, res) => {
    try {
      const { college, year, type, subject, link } = req.body;
      
      const updatedData = await Data.findByIdAndUpdate(req.params.id, { college, year, type, subject, link }, { new: true });
      
      if (!updatedData) {
        return res.status(404).json({ message: 'Data not found' });
      }
      
      res.json({ message: 'Data updated successfully', data: updatedData });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;