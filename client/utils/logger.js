const logMemory = ({ numTensors, numBytes }, msg) => {
	console.log(`${msg ? `${msg}\n` : ''}tensors: ${numTensors}\tMB: ${numBytes / (1024 * 1024)}`)
}

export {
	logMemory,
	logMemory as default,
}
