/* Iida Peltonen 2022 */

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
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
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  Person.find({})
    .then((result) => {
      if(person) {
        result.forEach((person) => {
          persons.concat(person.name, person.number)
      })
    }
    else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error));

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

  const person = new Person({
    id: body.id,
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

  /*  

Näitä ei vielä tarvita, ovat myös frontissa

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

//kaikkien luettelo
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//poisto id:n perusteella
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//haku id-numerolla
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//vanhan päivitys
app.put("/api/persons/:id", (request, response, next) => {
  console.log("body", request.body);
  const body = request.body;
  Person.findByIdAndUpdate(request.params.id, {
    name: body.name,
    number: body.number,
  })
    .then((result) => {
      response.json(result))
    })
    .catch((error) => next(error))
})

//info-sivu
app.get('/info', (request, response, next) => {
  const today = new Date()
  //ajaksi utc
  const time = today.toUTCString()
  let maara = 0
  Person.find({}).then(person => {
    if (person) {
      maara = person.length
      response.send(
        `<p>Luettelossa on ${maara} henkilön tiedot </p>
        <p> ${time}</p>`
      )
    }
    else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/* 
const morgan = require('morgan')

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
)

morgan.token('type', (request, response) => JSON.stringify(request.body))

morgan.token('param', function (request, response, param) {
  return request.params[param]
})

*/
