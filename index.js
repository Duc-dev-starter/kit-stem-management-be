const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { authRoutes, userRoutes, categoryRoutes, blogRoutes, kitRoutes, kitLogRoutes, labRoutes, clientRoutes, comboRoutes, reviewRoutes, cartRoutes, purchaseRoutes, supportRoutes, transactionRoutes } = require('./routes');
const { errorMiddleware } = require('./middleware');
const { connectToDB } = require('./config');

const PORT = process.env.PORT || 5000;
const app = express();

connectToDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/kit', kitRoutes);
app.use('/api/kit/log', kitLogRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/combo', comboRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/transaction', transactionRoutes)

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
})