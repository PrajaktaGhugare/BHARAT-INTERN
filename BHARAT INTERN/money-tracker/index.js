const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money-tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Define transaction schema and model
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: String, // 'expense' or 'income'
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Set up middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes
app.get('/', async (req, res) => {
  // Retrieve all transactions from the database
  const transactions = await Transaction.find();
  res.render('home', { transactions });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { description, amount, type } = req.body;

  // Validate data (you may want to add more validation)
  if (!description || !amount || !type) {
    return res.status(400).send('Description, amount, and type are required.');
  }

  // Create a new transaction
  const newTransaction = new Transaction({ description, amount, type });

  // Save the transaction to the database
  await newTransaction.save();

  // Redirect to the home page
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
