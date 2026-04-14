const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
console.log(process.argv);

const url = `mongodb+srv://brianriendeaujr_db_user:${password}@cluster0.hs1irrs.mongodb.net/phonebook?appName=Cluster0`

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})




// 'Person' → MongoDB collection "people". FSO notes live in "notes" → use model name 'Note'.
const Person = mongoose.model('Person', noteSchema)



mongoose
  .connect(url, { family: 4 }).then(() => {
    if (name && number) {
      const person = new Person({ name: name, number: number });
          return person.save().then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            return mongoose.connection.close()
          })
    } else {
      return Person.find({}).then((result) => {
        console.log(`found ${result.length} document(s)`)
        result.forEach((person) => console.log(`${person.name} ${person.number}`))
        return mongoose.connection.close()
      })
    }
  }).catch((err) => {
    console.error('error:', err.message)
    process.exit(1)
  })

