const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors)
app.use(express.json())
morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

const phonebookEntries = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

// Maybe listening to / will make Render work..?
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/persons/', (request, response) => {
    response.json(phonebookEntries)
})

app.get('/api/persons/:id', (request, response) => {
    const person = phonebookEntries.find(e => e.id == request.params.id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send({ error: "no such id" })
    }
})

app.post('/api/persons/', (request, response) => {
    if (!request.body.name) {
        return response.status(400).send({ error: "name field is required" })
    } else if (!request.body.number) {
        return response.status(400).send({ error: "number field is required" })
    } else if (phonebookEntries.some(e => e.name == request.body.name)) {
        return response.status(400).send({ error: "name already exists" })
    } else {
        const id = Math.floor(Math.random() * 100000)
        phonebookEntries.push({ id: id, name: request.body.name, number: request.body.number })
        return response.status(201).send()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const deleteIndex = phonebookEntries.findIndex(e => e.id == request.params.id)
    if (deleteIndex >= 0) {
        phonebookEntries.splice(deleteIndex, 1)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    const date = Date().toString()
    response.end(`Phonebook has info for ${phonebookEntries.length} people\n${date}`
    )
})
