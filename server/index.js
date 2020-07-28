const ModelController = require('./ml/model')

const init = async (app) => {
	const modelController = new ModelController()

	if (app && app.locals.modelController === undefined) {
		// TODO: Remove this action if not strictly necessary
		// eslint-disable-next-line no-param-reassign
		app.locals.modelController = modelController
		const saveResult = await modelController.model.save(`file://${__basedir}/model`)
		console.log('[server] Model defined\n', saveResult)
	} else {
		console.log('[server] Model already defined')
	}
}

module.exports = {
	init,
}
