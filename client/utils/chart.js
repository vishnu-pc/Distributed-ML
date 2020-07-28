import ChartJS from 'chart.js'

const MAX_NUM_DATASETS = 4

class Chart {
	constructor(id, title = 'Chart', type = 'line') {
		const ctx = document.getElementById(id).getContext('2d')
		this.labels = []
		this.datasets = []
		this.chart = new ChartJS(ctx, {
			type,
			data: {
				labels: this.labels,
				datasets: this.datasets,
			},
			options: {
				title: {
					display: true,
					text: title,
				},
			},
		})
	}

	addPoint(y, X) {
		const datasetIndex = this.datasets.length - 1
		const dataLength = this.datasets[0].data ? this.datasets[0].data.length : 0
		const x = X || dataLength

		if (!datasetIndex) {
			this.labels.push(x)
			this.datasets[datasetIndex].data.push({ x, y })
		} else {
			this.datasets[datasetIndex].data[this.dataPointer] = { x, y }
			this.dataPointer += 1
		}
		this.chart.update()
	}

	addDataset(name = '-') {
		const datasetLength = this.labels.length
		const r = Math.round(Math.random() * 255)
		const b = Math.round(Math.random() * 255)
		const g = Math.round(Math.random() * 255)
		const dataset = {
			label: name,
			backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
			borderColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
			data: datasetLength ? new Array(datasetLength) : [],
		}

		this.dataPointer = 0
		this.datasets.push(dataset)

		// Prevent dataset from growing exponentially big
		if (this.datasets.length > MAX_NUM_DATASETS) {
			this.datasets.shift()
		}

		this.chart.update()
	}
}

export {
	Chart,
	Chart as default,
}
