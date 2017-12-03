// To enable display of client route errors on the server, set the following to 'true'
const printClientErrorsOnServer = false

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(cors())

const snacks = require('./routes/snacks.routes');
app.use('/api/snacks', snacks);
const users = require('./routes/users.routes')
app.use('/api/users', users)

app.use((req, res) => {
  const status = 404;
  const message = `Could not ${req.method} ${req.path}`;
  res.status(status).json({ status, message });
});

app.use((err, _req, res, _next) => {
  // display error on server (if enabled)
  if (printClientErrorsOnServer) console.error(err)
  // pass error to client
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ status, message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on port', port);
});
