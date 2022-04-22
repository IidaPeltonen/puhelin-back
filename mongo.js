/* Iida Peltonen 2022 */

const mongoose = require('mongoose')

const url = `mongodb+srv://fullstack:fullstack2022@cluster0.o1opl.mongodb.net/personApp?retryWrites=true&w=majorityPORT=3001`

mongoose.connect(url)

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: name,
  number: number
})

if (process.argv[3] && process.argv[4]) {
  person.save().then(result => {
    console.log(` ${name} ${number} lisätty luetteloon`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('Puhelinluettelo:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}
