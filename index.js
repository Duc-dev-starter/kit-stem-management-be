const express = require('express');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
dotenv.config();
const { authRoutes, userRoutes, categoryRoutes, blogRoutes } = require('./routes');
const { errorMiddleware } = require('./middleware');

const PORT = process.env.PORT || 5000;
const app = express();

connectToDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/blog', blogRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
})