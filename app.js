const express = require('express')
const compression = require('express-compression')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 8888
const fs = require('fs')

app.use(compression())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', 'public/views')

app.get('/', (req, res) => {
	res.render('index')
})

// Sockets

let rawCards = fs.readFileSync('./cards.json')
let cards = JSON.parse(rawCards)

io.on('connection', socket => {
	console.log('a user connected')

	io.to(socket.id).emit('set-cards', cards)

	socket.on('message', msg => {
		io.emit('message', { msg: msg, id: socket.id })
	})

	socket.on('drop', dropInfo => {
		cards[dropInfo.id].row = dropInfo.target
		fs.writeFileSync('./cards.json', JSON.stringify(cards))
		io.emit('drop', dropInfo)
	})
})

server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`)
})
