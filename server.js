import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/apiRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;
// console.log("Types of:", typeof process.env.RENDER, typeof process.env.VERSEL, typeof process.env.NODE_ENV);


app.use('/', apiRoutes);
app.use("/", (req, res) => {
    res.send({
        message: "Welcome to the API",
        timestamp: new Date().toISOString()
    });
})

// if (process.env.NODE_ENV === 'development' && process.env.RENDER === 'false' && process.env.VERSEL === 'false') {
//     app.listen(PORT, () => {
//         console.log(`Server running in ${ENV} mode on port ${PORT}`);
//     });
// } else if (process.env.NODE_ENV === 'production' && process.env.RENDER === 'true' && process.env.VERSEL === 'false') {
//     app.listen(PORT, () => {
//         console.log(`Server running in ${ENV} mode on port ${PORT}`);
//     });
// }

// Export default is required for Vercel Serverless Functions using ES Modules
export default app;
