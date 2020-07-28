/* eslint-disable no-await-in-loop */
import * as tf from '@tensorflow/tfjs'
import { MnistData } from './ml/mnist'
import { Chart } from './utils/chart'
import { status } from './utils/status'
import { logMemory } from './utils/logger'
import { ModelController } from './ml/model'
import { MAX_ITERATIONS } from './config'

const trainChart = new Chart('training', 'Accuracy during training')
const statsChart = new Chart('stats', 'Model Accuracy Globally', 'bar')

async function main() {
	const model = new ModelController()
	statsChart.addDataset('Accuracy')

	// Load the data
	status('Downloading Dataset')
	const mnistData = new MnistData()
	await mnistData.load()

	let iteration = 0
	while (iteration < MAX_ITERATIONS) {
		let datapoint = 0

		// Load Model
		status('Downloading latest Model', iteration)
		await model.loadModel()
		logMemory(tf.memory(), 'loadModel')

		// Get Data
		status('Loading train data', iteration)
		trainChart.addDataset(iteration)
		const { xs, labels } = mnistData.getTrainData()

		logMemory(tf.memory(), 'getTrainData')

		// Train model
		status('Training Model', iteration)
		await model.trainModel(xs, labels, {
			onBatchEnd: async (batch, logs) => {
				trainChart.addPoint(logs.acc, datapoint) // Choose metric to plot
				datapoint += 1
				await tf.nextFrame()
			},
			// eslint-disable-next-line no-loop-func
			onEpochEnd: (epoch) => {
				// chart.addPoint(epoch, logs.acc) // Choose the metric to plot here
				status(`Completed Epoch ${epoch}`, iteration)
			},
		})

		logMemory(tf.memory(), 'trainModel')

		// Testing model
		status(`Iteration ${iteration} | Testing Model`)
		const { xs: testXs, labels: testLabels } = mnistData.getTestData()
		const accuracy = await model.testModel(testXs, testLabels)
		ModelController.dispose({ xs, labels })
		ModelController.dispose({ testXs, testLabels })

		// Save model
		status('Saving Model', iteration)

		// Add stats for the latest iteration. will be 0 if model was dumped
		const [, stats] = await model.saveModel({ accuracy })
		const { history, dump } = stats
		const latestStat = history.pop()
		statsChart.addPoint(dump ? 0 : latestStat.accuracy, stats.globalIteration)

		logMemory(tf.memory(), 'saveModel')
		status(`Iteration ${iteration} Complete`)

		iteration += 1
	}
}

main()
