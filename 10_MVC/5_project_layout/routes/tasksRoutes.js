const express = require('express')
const router = express.Router()

const TasksController = require('../controllers/TaskController')

router.get('/add', TasksController.createTask)
router.get('/', TasksController.showTasks)

module.exports = router
