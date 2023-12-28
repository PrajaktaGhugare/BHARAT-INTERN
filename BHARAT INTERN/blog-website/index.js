const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog-website', { useNewUrlParser: true, useUnifiedTopology: true });

// Define post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// Set up middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes
app.get('/', async (req, res) => {
  // Retrieve all posts from the database
  const posts = await Post.find();
  res.render('home', { posts });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const { title, content } = req.body;

  // Validate data (you may want to add more validation)
  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  // Create a new post
  const newPost = new Post({ title, content });

  // Save the post to the database
  await newPost.save();

  // Redirect to the home page
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
