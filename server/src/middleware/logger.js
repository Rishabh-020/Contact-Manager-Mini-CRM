// Lightweight HTTP request logger middleware (morgan equivalent with zero dependencies)

function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${color}${status}${reset} - ${duration}ms`);
  });

  next();
}

module.exports = requestLogger;

