/* Iida Peltonen 2022 */

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Täällä ei ole mitään nähtävää!</h1>')
})

//uuden luonti
app.post('/api/persons', (request, response) => {
  const body = request.body

  //jos uudelle hlöllä ei ole annettu nimeä
  if (body.name === '') {
    return response.status(400).json({
      error: 'Nimi puuttuu'
    })
  }
  //jos uudelle hlöllä ei ole annettu numeroa
  if (body.number === '') {
    return response.status(400).json({
      error: 'Numero puuttuu'
    })
  }

/*  

Näitä ei vielä tarvita

//jos uusi hlö on jo  luettelossa
  const existingPerson = persons.find(item => {
    return (
      item.name.toLowerCase() === body.name.toLowerCase()
    )
  }) 

  if (existingPerson) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  } */

  const person = new Person({
    id: body.id,
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

//kaikkien luettelo
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//poisto id:n perusteella
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

//haku id-numerolla
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

//info-sivu
app.get('/info', (request, response) => {
  const today = new Date()
  //ajaksi utc
  const time = today.toUTCString()
  let maara = 0
  Person.find({})
  .then((person) => {
    if (person) {
      maara = person.length
      response.send(
        `<p>Luettelossa on ${maara} henkilön tiedot </p>
        <p> ${time}</p>`
      )
    }
  })
}) 

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


/* 
const mongoose = require('mongoose')
const morgan = require('morgan')

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
)

morgan.token('type', (request, response) => JSON.stringify(request.body))

morgan.token('param', function (request, response, param) {
  return request.params[param]
})

*/