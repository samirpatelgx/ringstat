const dynoMongo = require("../../dynomongo/");
const { Schema } = dynoMongo

const recipientSchema = {
  email: {
    type: String,
  },
  responded: { type: Boolean, default: false }
};

module.exports = recipientSchema;