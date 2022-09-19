const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {

    response.send(`Phonebook has info for ${persons.length} people\n ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const found = persons.find(person => person.id === id)
    if(found){
        response.json(found)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{

    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(404).end()
})


const generateId = (max) => Math.floor(Math.random() * max)

app.post('/api/persons', (request, response) => {

    const body = request.body

    //Check if request body is empty:
    if(!body.name || !body.number){//undefined == false
        return response.status(400).json({
            error:'Some information is missing'
        })
    }else{
        const hasName = persons.find(person => person.name === body.name)
        if(hasName){
            return response.status(400).json({
                error:'name must be unique'
            })
        }
    }

    const newRecord = {
        id: generateId(10000),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(newRecord)
    response.json(newRecord)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})