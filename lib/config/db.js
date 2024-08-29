import mongoose from 'mongoose';

let isConnected; // Track the connection status

export const connectDb = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};
