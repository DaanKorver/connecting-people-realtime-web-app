const express = require('express')
const router = express.Router()
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
let io = null

module.exports = function (importIo) {
	io = importIo
	this.router = router
	return router
}

const cardsObj = require('../cards')(io)

// POST
router.post('/', async (req, res) => {
	const cards = JSON.parse(fs.readFileSync(cardsObj.path))
	const cardId = uuidv4()
	cards[`card${cardId}`] = { cardId, ...req.body, row: 0 }
	fs.writeFileSync(cardsObj.path, JSON.stringify(cards))
	cardsObj.update()
	res.json({ status: 'Sucess' })
})
