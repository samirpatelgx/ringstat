const dynoMongo = require("../../dynomongo/");
const recipientSchema = require("./Recipient");

const { Schema } = dynoMongo;

const surveySchema = new Schema({
  primary: {
    surveyId: {
      type: String,
      required: true,
      hashKey: true
    },
    title: {
      type: String,
    },
    body: {
      type: String
    },
    subject: {
      type: String
    },
    recipients: {
      type: 'map',
      map: [
        {
          type: "map",
          map: {type: String}
        }
      ]
    },
    yes: {
      type: Number,
      default: 0
    },
    no: {
      type: Number,
      default: 0
    },
    _user: { 
      type: String,
    },
    dateSent: {
      type: Date
    },
    lastResponded: {
      type: Date
    },

    throughput: 
    { 
      read: 3,
      write: 3
    }
  }
});

dynoMongo.model("surveys",surveySchema)