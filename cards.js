const path = './cards.json'
const fs = require('fs')

if (!fs.existsSync(path)) {
	fs.writeFileSync(path, JSON.stringify({}))
}

let io = null

module.exports = function (importIo) {
	io = importIo
	this.get = () => JSON.parse(fs.readFileSync(path))

	this.update = () => {
		const newCards = JSON.parse(fs.readFileSync(path))
		io.emit('set-cards', newCards)
	}

	this.path = path
	return this
}
