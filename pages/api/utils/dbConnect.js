import mongoose from "mongoose";
const connection = {};

export default async function handler(req, res) {
  if (connection.isConnected) {
    console.log("using initial conn");
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  connection.isConnected = db.connections[0].readyState;
  console.log("using new conn");
  return;
}
