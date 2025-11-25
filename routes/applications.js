const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

// GET /api/applications (with optional id query parameter)
router.get('/', applicationController.getApplications);

// GET /api/applications/first-interview - Get all First Interview applications
router.get('/first-interview', applicationController.getFirstInterviewApplications);

// GET /api/applications/final-interview - Get all Final Interview applications
router.get('/final-interview', applicationController.getFinalInterviewApplications);

// GET /api/applications/rejected - Get all Rejected applications
router.get('/rejected', applicationController.getRejectedApplications);

// GET /api/applications/selected - Get all Selected applications
router.get('/selected', applicationController.getSelectedApplications);

// GET /api/applications/hired - Get all Hired applications
router.get('/hired', applicationController.getHiredApplications);

// POST /api/applications/interview - Submit interview results
router.post('/interview', applicationController.submitInterview);

// PUT /api/applications/update-questions - Update interview questions only
router.put('/update-questions', applicationController.updateQuestions);

// PUT /api/applications/update-status - Update application status
router.put('/update-status', applicationController.updateStatus);

module.exports = router;
