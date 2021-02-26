import mongoose from "mongoose";

export const connection = {};

async function dbConnect() {
  console.log("existing conn");
  if (connection.isConnected) {
    connection.msg = "Using Existing Conn";
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
  connection.msg = "Using New Conn";
  return;
}

export default dbConnect;
