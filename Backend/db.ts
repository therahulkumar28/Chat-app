import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

const connectDB = async (): Promise<Mongoose> => {
    try {
      
        const db: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
          
        } as ConnectOptions);

        console.log(`MongoDB connected: ${db.connection.host}`);
        return db;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error(`Unknown error: ${error}`);
        }
        process.exit(1);
    }
};

export = connectDB;
