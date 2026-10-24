// Sends any error in a controller (sync or async) to the error handler.
// So we don't need try/catch in every controller function.
const wrap = (fn) => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req, res))
    .catch(next);
};

module.exports = wrap;
