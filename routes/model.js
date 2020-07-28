const express = require('express')
const path = require('path')
const multer = require('multer')

const router = express.Router()

// Model storage
// Useful to add conditional logic before storing the model
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, path.join(__basedir, 'model'))
	},
	filename(req, file, cb) {
		const filename = file.fieldname
		cb(null, filename)
	},
})
const upload = multer({ storage })


/* GET current model and weights. */
router.use('/get', express.static(path.join(__basedir, 'model')))

/** Save new model */
router.post('/save', upload.any(), (req, res) => {
	console.log('model', req.files)
	res.sendStatus(200)
})

module.exports = router
