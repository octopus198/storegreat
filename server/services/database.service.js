import mongoose from "mongoose";
import { config } from "dotenv";

config();

class DatabaseService {
    constructor() {
        this.uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kvuqezi.mongodb.net/${process.env.DB_NAME}`
    }
    async connect() {
        try {
            await mongoose.connect(this.uri);
            console.log('Mongo connect successfully')
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

const databaseService = new DatabaseService();
export default databaseService;