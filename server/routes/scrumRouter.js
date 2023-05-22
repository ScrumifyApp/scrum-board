const express = require('express'); 

const scrumRouter = express.Router();

const scrumController = require('../controllers/scrumController'); 
// get tasks
scrumRouter.post('/', scrumController.getStories, scrumController.getTasks, (req, res) => {
  const result = {
    stories: res.locals.stories,
    tasks: res.locals.tasks
  };

  //console.log('In scrumRouter having returned from GET scrumController.getStory & scrumController.getTasks middleware');
  //console.log('We have brought back result: ', result);
  res.status(200).json(result);
})

// create new task
scrumRouter.post('/task', scrumController.postTask, (req, res) => {
  //console.log('In scrumRouter having returned from POST scrumController.postTask middleware');
  return res.status(200).end('Task added');
})

// create new story
scrumRouter.post('/story', scrumController.postStory, (req, res) => {
  //console.log('In scrumRouter having returned from POST scrumController.postStory middleware');
  return res.status(200).end('Story added');
})

// update task
scrumRouter.patch('/task', scrumController.updateTask, (req, res) => {
  //console.log('In scrumRouter having returned from PATCH scrumController.updateTask middleware');
  return res.status(200).end('Updated task');
})

// delete task
scrumRouter.delete('/task/:id', scrumController.deleteTask, (req, res) => {
  //console.log('In scrumRouter having returned from DELETE scrumController.deleteTask middleware');
  return res.status(200).end('Task Deleted');
})

// delete story
scrumRouter.delete('/story/:id', scrumController.deleteStory, (req, res) => {
  //console.log('In scrumRouter having returned from DELETE scrumController.deleteStory middleware');
  return res.status(200).end('Story Deleted');
})


module.exports = scrumRouter;