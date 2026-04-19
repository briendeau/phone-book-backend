const mongoose = require("mongoose");

const url = process.env.MONGODB_URI ;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 })
.then(() => {
    console.log("connected to MongoDB");
})
.catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
});

const personSchema = new mongoose.Schema({
  name: { 
      type: String,
      required: true,
      minLength: 3
    },
  number: { 
      type: String,
      required: true,
      minLength: 8 }, 
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});



module.exports = mongoose.model("Person", personSchema);
