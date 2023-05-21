const express = require('express'); 

const userRouter = express.Router();

const userController = require('../controllers/userController'); 

//Creates a new team and adds a user to it
userRouter.post('/create-team',
  userController.createTeam,
  userController.joinTeam,
  (req, res) => {
    // console.log('--Sending data from POST request from /api/user/create-team route--');
    return res.status(200).json(res.locals);
  }
);

//A user joins the specific team attached to the request parameter
userRouter.post('/join-team/:team_id',
userController.joinTeam,
  (req, res) => {
    // console.log('--Sending data from POST request from /api/user/join-team route--');
    return res.status(200).json(res.locals);
  }
);


module.exports = userRouter;