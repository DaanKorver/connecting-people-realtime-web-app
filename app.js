const express = require('express')
const compression = require('express-compression')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 8888
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

app.use(compression())
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', 'public/views')

app.get('/', (req, res) => {
	res.render('index')
})

// Sockets

const path = './cards.json'

if (!fs.existsSync(path)) {
	fs.writeFileSync(path, JSON.stringify({}))
}

let cards = JSON.parse(fs.readFileSync(path))

io.on('connection', socket => {
	console.log('a user connected')

	io.to(socket.id).emit('set-cards', cards)

	socket.on('message', msg => {
		io.emit('message', { msg: msg, id: socket.id })
	})

	socket.on('drop', dropInfo => {
		cards[dropInfo.id].row = dropInfo.target
		fs.writeFileSync(path, JSON.stringify(cards))
		io.emit('drop', dropInfo)
	})
})

// Api Routes

const api = express.Router()

api.post('/task', async (req, res) => {
	const cards = JSON.parse(fs.readFileSync(path))
	const cardId = uuidv4()
	cards[`card${cardId}`] = { cardId, ...req.body, row: 0 }
	fs.writeFileSync(path, JSON.stringify(cards))
	updateCards()
	res.json({ status: 'Sucess' })
})

app.use('/api', api)

// functions

function updateCards() {
	cards = JSON.parse(fs.readFileSync(path))
	io.emit('set-cards', cards)
}

server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`)
})
