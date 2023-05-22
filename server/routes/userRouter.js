const express = require('express'); 

const userRouter = express.Router();

const userController = require('../controllers/userController'); 

//user login
userRouter.post('/login',
  userController.verifyUser,
  userController.getTeams,
  (req, res) => {
	// console.log('login working');
	res.status(200).json(res.locals);
})

//user signup
userRouter.post('/signup',
  userController.checkUsername,
  userController.createUser,
  (req, res) => {
  // console.log('signup working');
  res.status(200).json(res.locals);
})

//Creates a new team and adds a user to it
userRouter.post('/create-team',
  userController.createTeam,
  userController.joinTeam,
  userController.getTeams,
  (req, res) => {
    // console.log('--Sending data from POST request from /api/user/create-team route--');
    // console.log('res.locals from create-team route', JSON.stringify(res.locals));
    return res.status(200).json(res.locals);
  }
);

//A user joins the specific team attached to the request parameter
userRouter.post('/join-team/:team_id',
  userController.getTeams,
  userController.joinTeam,
  userController.getTeams,
  (req, res) => {
    // console.log('--Sending data from POST request from /api/user/join-team route--');
    // console.log('res.locals from join-team route', JSON.stringify(res.locals));
    return res.status(200).json(res.locals);
  }
);


module.exports = userRouter;