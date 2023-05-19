const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Daryus008!',
  database: 'movie_review_site'
});

connection.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Connected to database');
  }
});

function addReview(userId, productId, rating, comment) {
  const query = `INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (${userId}, ${productId}, ${rating}, '${comment}')`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Review added to database');
    }
  });

  const selectQuery = 'SELECT * FROM reviews';

  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      console.log('All Reviews:', results);
    }
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'review.html'));
});

app.get('/reviews', (req, res) => {
  const selectQuery = 'SELECT * FROM reviews';

  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error(error);
    } else {
      res.render('reviews', { reviews: results });
    }
  });
});

app.post('/submit-review', (req, res) => {
  const userId = req.body['user-id'];
  const productId = req.body['product-id'];
  const rating = req.body['rating'];
  const comment = req.body['comment'];

  addReview(userId, productId, rating, comment);

  res.send('Review added to database');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
