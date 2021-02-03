import mongoose from "mongoose";

// const connection = {};

async function dbConnect(conn) {
  // if (connection.isConnected) {
  //   return;
  // }
  if (conn === true) {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // connection.isConnected = db.connections[0].readyState;
    return;
  } else if (conn === false) {
    mongoose.connection.close();
    return;
  }
}

export default dbConnect;
