import mongoose, { ConnectOptions } from 'mongoose';

let isConnected: boolean | undefined; // Track the connection status

export const connectDb = async (): Promise<void> => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw new Error("Failed to connect to the database");
  }
};
