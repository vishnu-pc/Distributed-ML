const statusLog = []

const createLogRecordEle = ({ msg, iteration, timestamp }) => {
	const ele = document.createElement('div')
	ele.className = 'log-record'
	ele.innerHTML = `${timestamp.toLocaleTimeString()} | ${iteration !== undefined ? `Iteration ${iteration} | ` : ''}${msg}`
	return ele
}

export function status(msg, iteration) {
	const currentStatus = {
		msg,
		iteration,
		timestamp: new Date(),
	}

	console.log(currentStatus)

	statusLog.push(currentStatus)
	document.getElementById('status').prepend(createLogRecordEle(currentStatus))
}

export default status
