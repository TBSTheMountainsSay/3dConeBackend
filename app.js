const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());

const fillArray = (length) => {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
};

app.get('/triangulation', (req, res) => {
  const query = require('url').parse(req.url, true).query;
  console.log(query.height);
  if (
    [query.height, query.radius, query.segments].some((arg) => {
      return !Number.isInteger(+arg) || isNaN(+arg) || +arg < 0;
    })
  ) {
    res.status(400).send('wrong data');
    return;
  }

  const { radius, height, segments } = query;
  const triangles = fillArray(segments).map((item) => {
    return [
      [
        +radius * Math.cos(2 * Math.PI * (item / +segments)),
        +radius * Math.sin(2 * Math.PI * (item / +segments)),
        0,
      ],
      [
        +radius * Math.cos(2 * Math.PI * ((item + 1) / +segments)),
        +radius * Math.sin(2 * Math.PI * ((item + 1) / +segments)),
        0,
      ],
      [0, 0, +height],
    ];
  });
  res.send(JSON.stringify(triangles));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
