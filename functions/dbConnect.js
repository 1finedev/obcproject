import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  console.log("got here");
  if (connection.isConnected) {
    return;
  }
  console.log("got here 1");

  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("got here 2");

  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
  return;
}

export default dbConnect;
