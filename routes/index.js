const express = require('express')

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Express' })
})

router.get('/stats', (_, res) => {
	const { modelController } = res.app.locals
	res.json(modelController.stats)
})

router.post('/stats', (req, res) => {
	const { modelController } = res.app.locals
	modelController.updateStats(req.body)

	res.json(modelController.stats)
})

module.exports = router
