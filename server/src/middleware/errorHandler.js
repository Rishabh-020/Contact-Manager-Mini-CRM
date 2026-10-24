// const notFound = (req, res, next) => {
//   res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
// };

// const errorHandler = (err, req, res, next) => {
//   const status = err.statusCode || 500;
//   res.status(status).json({ success: false, message: err.message || 'Server error' });
// };

// module.exports = { notFound, errorHandler };


// Runs when no route matched.
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

// Runs when any route throws an error. Sends the same JSON shape every time.
function errorHandler(err, req, res, next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Server error';

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON.';
  }
  if (status === 500) {
    console.error(err);
    message = 'Something went wrong on the server.';
  }
  res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };