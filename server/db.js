import mongoose from "mongoose"

mongoose.connect(process.env.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.connection.on('open', () => {
    console.info('Connected to Mongo.');
})
mongoose.connection.on('error', (err) => {
    console.error('Error occured while connecting to Mongo:- ', err.message);
})
