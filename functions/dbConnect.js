import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  console.log("existing conn");
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("new conn");

  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
  return;
}

export default dbConnect;
