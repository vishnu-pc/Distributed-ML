// eslint-disable-next-line no-underscore-dangle
global.__basedir = __dirname

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')

const indexRouter = require('./routes/index')
const modelRouter = require('./routes/model')
const server = require('./server')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
	src: path.join(__dirname, 'client'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true, // true = .sass and false = .scss
	sourceMap: true,
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/model', modelRouter)

server.init(app)

module.exports = app
