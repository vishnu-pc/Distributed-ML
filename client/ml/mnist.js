/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs'
import { NUM_DATA_SETS } from '../config'
import { getRandomInt } from '../utils/misc'

export const IMAGE_H = 28
export const IMAGE_W = 28
const IMAGE_SIZE = IMAGE_H * IMAGE_W
const NUM_CLASSES = 10
const NUM_TOTAL_DATASET_ELEMENTS = 65000
const NUM_TOTAL_TRAIN_ELEMENTS = 55000

// const NUM_DATASET_ELEMENTS = Math.round(NUM_TOTAL_DATASET_ELEMENTS / NUM_DATA_SETS)
const NUM_TRAIN_ELEMENTS = Math.round(NUM_TOTAL_TRAIN_ELEMENTS / NUM_DATA_SETS)
// const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS

const MNIST_IMAGES_SPRITE_PATH = './data/mnist_images.png'
const MNIST_LABELS_PATH = './data/mnist_labels_uint8'

/**
 * A class that fetches the sprited MNIST dataset and provide data as
 * tf.Tensors.
 */
export class MnistData {
	async load() {
		// Make a request for the MNIST sprited image.
		const img = new Image()
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const imgRequest = new Promise((resolve) => {
			img.crossOrigin = ''
			img.onload = () => {
				img.width = img.naturalWidth
				img.height = img.naturalHeight

				const datasetBytesBuffer = new ArrayBuffer(NUM_TOTAL_DATASET_ELEMENTS * IMAGE_SIZE * 4)

				const chunkSize = 5000
				canvas.width = img.width
				canvas.height = chunkSize

				for (let i = 0; i < NUM_TOTAL_DATASET_ELEMENTS / chunkSize; i += 1) {
					const datasetBytesView = new Float32Array(
						datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
						IMAGE_SIZE * chunkSize,
					)
					ctx.drawImage(
						img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
						chunkSize,
					)

					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

					for (let j = 0; j < imageData.data.length / 4; j += 1) {
						// All channels hold an equal value since the image is grayscale, so
						// just read the red channel.
						datasetBytesView[j] = imageData.data[j * 4] / 255
					}
				}
				this.datasetImages = new Float32Array(datasetBytesBuffer)

				resolve()
			}
			img.src = MNIST_IMAGES_SPRITE_PATH
		})

		const labelsRequest = fetch(MNIST_LABELS_PATH)
		const [, labelsResponse] = await Promise.all([imgRequest, labelsRequest])

		this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())

		// Slice the the images and labels into train and test sets.
		this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TOTAL_TRAIN_ELEMENTS)
		this.testLabels = this.datasetLabels.slice(NUM_CLASSES * NUM_TOTAL_TRAIN_ELEMENTS)
	}

	/**
   * Get all training data as a data tensor and a labels tensor.
   *
   * @returns
   *   xs: The data tensor, of shape `[numTrainExamples, 28, 28, 1]`.
   *   labels: The one-hot encoded labels tensor, of shape
   *     `[numTrainExamples, 10]`.
   */
	getTrainData() {
		const datasetIndex = getRandomInt(NUM_DATA_SETS)

		const [a, b] = [datasetIndex, datasetIndex + 1]
		const trainImages = this.datasetImages.slice(a * IMAGE_SIZE * NUM_TRAIN_ELEMENTS, b * IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
		const trainLabels = this.datasetLabels.slice(a * NUM_CLASSES * NUM_TRAIN_ELEMENTS, b * NUM_CLASSES * NUM_TRAIN_ELEMENTS)

		const xs = tf.tensor4d(
			trainImages,
			[trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1],
		)
		const labels = tf.tensor2d(
			trainLabels, [trainLabels.length / NUM_CLASSES, NUM_CLASSES],
		)
		return { xs, labels }
	}

	/**
   * Get all test data as a data tensor a a labels tensor.
   *
   * @param {number} numExamples Optional number of examples to get. If not
   *     provided,
   *   all test examples will be returned.
   * @returns
   *   xs: The data tensor, of shape `[numTestExamples, 28, 28, 1]`.
   *   labels: The one-hot encoded labels tensor, of shape
   *     `[numTestExamples, 10]`.
   */
	getTestData(numExamples) {
		let xs = tf.tensor4d(
			this.testImages,
			[this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1],
		)
		let labels = tf.tensor2d(
			this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES],
		)

		if (numExamples != null) {
			xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1])
			labels = labels.slice([0, 0], [numExamples, NUM_CLASSES])
		}
		return { xs, labels }
	}
}
