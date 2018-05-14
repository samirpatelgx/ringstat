
const dynamoose = require("dynamoose");

const { Schema } = dynamoose;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    hashKey: true,
  },
  googleId: {
    type: String,
    required: true,
    index: {
      global: true,
      name: "googleId_index",
      project: false,
      throughput: 3
    }
  }
},
{
throughput: {read: 3, write: 3}
});

dynamoose.model("users", userSchema, { update: true });

