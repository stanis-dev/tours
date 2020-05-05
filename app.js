const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//Current -> write data to db
app.post('/api/v1/tours', (req, res) => {
  const {
    startLocation,
    ratingsAverage,
    ratingsTotal,
    image,
    name,
    duration,
  } = req.body;

  const newRoute = {
    startLocation,
    ratingsAverage,
    ratingsTotal,
    image,
    name,
    duration,
  };

  const data = { ...tours, newRoute };

  console.log(data);

  res.send('Success');

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, data, (err) => {
    if (err) throw err;
    console.log('data has been written');
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('App running on port: ' + PORT);
});
