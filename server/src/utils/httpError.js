// Makes an error that carries an HTTP status code, e.g. httpError(404, 'Not found').
function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = httpError;
