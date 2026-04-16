require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require("./models/person");

const app = express();


app.use(express.static("dist"));
app.use(express.json())
app.use(morgan('tiny'))



app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result)
  })
})  

app.get('/info', (request, response) => {
  Person.find({}).then((result) => {
    response.send(`
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}</p>
    `)
  })
})



app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then((result) => {
    response.status(204).end()
  })
  .catch((error) => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {

  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })


})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

