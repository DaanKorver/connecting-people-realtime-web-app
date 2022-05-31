const express = require('express')
const compression = require('express-compression')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 8888

app.use(compression())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', 'public/views')

app.get('/', (req, res) => {
	res.render('index')
})

io.on('connection', socket => {
	console.log('a user connected')
})

server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`)
})
