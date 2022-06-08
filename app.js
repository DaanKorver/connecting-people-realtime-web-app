const express = require('express')
const compression = require('express-compression')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 8888
const fs = require('fs')
const task = require('./api/task')(io)
const cards = require('./cards')(io)
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', 'public/views')

// Routes

app.get('/', (req, res) => {
	res.render('index')
})

app.use('/api/task', task)

// Sockets

io.on('connection', socket => {
	console.log('a user connected')
	io.to(socket.id).emit('set-cards', cards.get())

	socket.on('message', msg => {
		io.emit('message', { msg: msg, id: socket.id })
	})

	socket.on('drop', dropInfo => {
		const newCards = cards.get()
		newCards[dropInfo.id].row = dropInfo.target
		fs.writeFileSync(path, JSON.stringify(newCards))
		io.emit('drop', dropInfo)
	})

	socket.on('delete-card', id => {
		const newCards = cards.get()
		console.log(newCards)
		delete newCards[`card${id}`]
		fs.writeFileSync(path, JSON.stringify(newCards))
		io.emit('set-cards', cards.get())
	})
})

server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`)
})
