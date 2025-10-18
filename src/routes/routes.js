const express = require('express');
const authController = require('../controllers/authController');
const candidateController = require('../controllers/candidateController');
const voteController = require('../controllers/voteController');
const electionController = require('../controllers/electionController');
const router = express.Router();

// User routes
router.post('/register', authController.registerUser);
// router.post('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/validate-login', authController.validateLogin);
// This is the CORRECT line for your routes.js file
// CORRECT
router.post('/verifyEmail', authController.verifyEmail);

// Election routes
router.post('/elections', electionController.createElection);
router.get('/elections', electionController.getAllElections);
router.get('/election/:id', electionController.getElectionById);
router.put('/elections/:id', electionController.updateElection);
router.delete('/elections/:id', electionController.deleteElection);
router.get('/elections/:electionId/results', electionController.getElectionResults);

// Candidate routes
router.post('/candidates/:electionId', candidateController.addCandidateToElection);
router.get('/candidate/:id', candidateController.getCandidateById);
router.get('/candidates/:electionId', candidateController.getCandidatesByElection);
router.put('/candidates/:electionId/:candidateId', candidateController.updateCandidateInElection);
router.delete('/candidates/:electionId/:candidateId', candidateController.deleteCandidateFromElection);

// Vote routes
router.post('/votes', voteController.vote);
router.get('/my-votes', voteController.getMyVotes);

module.exports = router;
