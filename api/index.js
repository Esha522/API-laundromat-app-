const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('../Routes/authroutes'));
app.use('/api/users', require('../Routes/userroutes'));
app.use('/api/orders', require('../Routes/orderroutes'));
app.use('/api/logistics', require('../Routes/logisticsroutes'));
app.use('/api/service', require ('../Routes/servicemanagementroutes'));
app.use('/api/transaction', require ('../Routes/transactionroutes'));
app.use('/api/reports', require ('../Routes/reportroutes'));
app.use('/api/dashboard', require('../Routes/dashboardroutes'));
app.use('/api/notifications' , require('../Routes/notificationroutes'));
app.use('/api/track', require('../Routes/trackorderroutes'));
app.use('/api/wallet', require('../Routes/walletroutes'));
app.use('/api/tickets', require('../Routes/ticketsroutes'));
app.use('/api/home', require('../Routes/homescreenroutes'));
app.use('/api/customers', require('../Routes/customerroutes'))


app.get('/', (req, res) => {
  res.send('Laundromat API is running...');
});

const serverless = require('serverless-http');
module.exports = serverless(app); 