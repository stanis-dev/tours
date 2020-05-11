const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID =
  ('id',
  (req, res, next, val) => {
    const tour = tours.filter((t) => {
      return t.id == val;
    });
    if (tour.length === 0) {
      return res.status(404).json({
        status: 'failure',
        error: 'Tour not found',
      });
    }
    req.tour = tour;
    next();
  });

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'property name not defined',
    });
  } else if (!price) {
    return res.status(400).json({
      status: 'error',
      message: 'property price not defined',
    });
  } else {
    next();
  }
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    tour: req.tour,
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) throw error;
    }
  );

  res.status(200).send(tours);
};

exports.patchTour = (req, res) => {
  const updatedTour = Object.assign({}, req.tour[0], req.body);
  console.log();

  tours[updatedTour.id] = updatedTour;

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) throw error;
    }
  );

  res.status(201).json({
    status: 'success',
    updatedTour,
  });
};

exports.deleteTour = (req, res) => {
  const toursNew = tours.filter((t) => {
    return t.id != req.tour.id;
  });

  console.log(toursNew);
  res.send(toursNew);
};
