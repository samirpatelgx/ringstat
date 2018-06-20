
const dynoMongo = require("../../dynomongo/");

const { Schema } = dynoMongo;
const userSchema = new Schema({
  primary: {
    userId: {
      type: String,
      required: true,
      hashKey: true,
    },
    credits: {
      rangeKey: true,
      type: Number,
      default: 0
    },
    throughput: {
      read: 3,
      write: 3
    }
  },
  global: [{
    googleId: {
      type: String,
      required: true,
      hashKey: true,
      name: "googleId_index",
      project: "ALL",
    },
    throughput: {
      read: 3,
      write: 3
    }
  }],
});
// const userSchema = new Schema({
//   primary: {
//     userId: {
//       type: String,
//       required: true,
//       hashKey: true,
//     },
//     credits: {
//       rangeKey: true,
//       type: Number,
//       default: 0
//     },
//     throughput: {
//       read: 3,
//       write: 3
//     }
//   },
//   global: [{
//     googleId: {
//       type: String,
//       required: true,
//       hashKey: true,
//       name: "googleId_index",
//       project: "ALL",
//     },
//     otherId: {
//       type: String,
//       required: true,
//       rangeKey: true,
//     },
//     throughput: {
//       read: 3,
//       write: 3
//     }
//   }],
//   local: [{
//     userId: {
//       name: "userId_index",
//       type: String,
//       required: true,
//       hashKey: true,
//       project: "KEYS_ONLY",
//     },
//     localRangeKey: {
//       type: String,
//       required: true,
//       rangeKey: true
//     },
    
//   }]
// });

dynoMongo.model("users", userSchema);

