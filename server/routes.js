const express = require('express'); 

const router = express.Router();

const controller = require('./scrumController'); 
// get tasks
router.post('/', controller.getStories, controller.getTasks, (req, res) => {
  const result = {
    stories: res.locals.stories,
    tasks: res.locals.tasks
  };

  //console.log('In router having returned from GET controller.getStory & controller.getTasks middleware');
  //console.log('We have brought back result: ', result);
  res.status(200).json(result);
})

// create new task
router.post('/task', controller.postTask, (req, res) => {
  //console.log('In router having returned from POST controller.postTask middleware');
  return res.status(200).end('Task added');
})

// create new story
router.post('/story', controller.postStory, (req, res) => {
  //console.log('In router having returned from POST controller.postStory middleware');
  return res.status(200).end('Story added');
})

// update task
router.patch('/task', controller.updateTask, (req, res) => {
  //console.log('In router having returned from PATCH controller.updateTask middleware');
  return res.status(200).end('Updated task');
})

// delete task
router.delete('/task/:id', controller.deleteTask, (req, res) => {
  //console.log('In router having returned from DELETE controller.deleteTask middleware');
  return res.status(200).end('Task Deleted');
})

// delete story
router.delete('/story/:id', controller.deleteStory, (req, res) => {
  //console.log('In router having returned from DELETE controller.deleteStory middleware');
  return res.status(200).end('Story Deleted');
})

//user login
router.post('/login', controller.verifyUser, controller.getTeams, (req, res) => {
	// console.log('login working');
	res.status(200).json(res.locals);
})

//user signup
router.post('/signup', controller.checkUsername, controller.createUser, (req, res) => {
  // console.log('signup working');
  res.status(200).json(res.locals);
})

module.exports = router;