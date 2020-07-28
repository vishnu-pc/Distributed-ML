#!/usr/bin/env node

const http = require('http')
const app = require('../app')

function run() {
	console.info('Starting server')

	const port = normalizePort(process.env.PORT || '3000')
	app.set('port', port)

	const server = http.createServer(app)

	server.listen(port)
	server.on('error', onError)
	server.on('listening', onListening)

	/**
   * Event listener for HTTP server "error" event.
   */

	function onError(error) {
		if (error.syscall !== 'listen') {
			throw error
		}

		const bind = typeof port === 'string'
			? `Pipe ${port}`
			: `Port ${port}`

		// handle specific listen errors with friendly messages
		switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
		}
	}


	/**
   * Event listener for HTTP server "listening" event.
   */

	function onListening() {
		const addr = server.address()
		const bind = typeof addr === 'string'
			? `pipe ${addr}`
			: `port ${addr.port}`
		console.info(`Listening on ${bind}`)
	}

	/**
   * Normalize a port into a number, string, or false.
   */

	function normalizePort(val) {
		const portVal = parseInt(val, 10)

		// eslint-disable-next-line no-restricted-globals
		if (isNaN(portVal)) {
			// named pipe
			return val
		}

		if (portVal >= 0) {
			// port number
			return portVal
		}

		return false
	}
}

module.exports = run
