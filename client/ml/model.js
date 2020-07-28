import * as tf from '@tensorflow/tfjs'
import { BATCH_SIZE, EPOCH, LEARNING_RATE } from '../config'

class ModelController {
	async loadModel() {
		const model = await tf.loadLayersModel('/model/get/model.json')

		if (this.oldModel) {
			tf.dispose(this.oldModel)
		}

		// If a model exists, keep its reference so that we can save it
		if (this.model) {
			this.oldModel = this.model
		}

		this.optimizer = tf.train.sgd(LEARNING_RATE)

		this.model = model
		return model
	}

	async saveModel(currentStat) {
		let result

		// Send back the stats
		const response = await fetch('/stats', {
			method: 'POST',
			body: JSON.stringify({
				...currentStat,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const serverStats = await response.json()

		if (serverStats && !serverStats.dump) {
			// Save the old model if it exists
			if (this.oldModel) {
				result = await this.oldModel.save(tf.io.http('./model/save'))
				this.oldModel = null
			} else {
				result = await this.model.save(tf.io.http('./model/save'))
			}
		}


		return [result, serverStats]
	}

	async trainModel(inputs, labels, callbacks) {
		// Prepare the model for training.
		this.model.compile({
			optimizer: this.optimizer,
			loss: 'categoricalCrossentropy',
			metrics: ['accuracy'],
		})

		return this.model.fit(inputs, labels, {
			batchSize: BATCH_SIZE,
			epochs: EPOCH,
			shuffle: true,
			callbacks,
		})
	}

	async testModel(inputs, labels) {
		const testResult = await this.model.evaluate(inputs, labels)
		const testAccPercent = testResult[1].dataSync()[0] * 100

		return testAccPercent.toFixed(1)
	}

	static dispose(container) {
		return tf.dispose(container)
	}
}


export {
	ModelController,
	ModelController as default,
}
