/**
 * Middleware to monitor query performance and identify slow queries
 * 
 * This middleware can be added to routes to measure and log query execution time,
 * helping identify performance bottlenecks in our API
 */

const performanceMonitor = (req, res, next) => {
  // Store original timestamp
  const start = process.hrtime();
  
  // Create a wrapper for the JSON response
  const originalJson = res.json;
  res.json = function(body) {
    // Calculate elapsed time in milliseconds
    const elapsed = process.hrtime(start);
    const ms = elapsed[0] * 1000 + elapsed[1] / 1000000;
    
    // Log slow API requests (over 500ms) for investigation
    if (ms > 500) {
      console.warn(`[PERFORMANCE ALERT] Slow request: ${req.method} ${req.originalUrl} took ${ms.toFixed(2)}ms`);
      
      // For very slow requests (over 1s), log additional info to help debugging
      if (ms > 1000) {
        console.warn(`[PERFORMANCE CRITICAL] Request details:`, {
          method: req.method,
          url: req.originalUrl,
          query: req.query,
          params: req.params,
          user: req.user ? req.user.id : 'unauthenticated',
          responseSize: body ? JSON.stringify(body).length : 0
        });
      }
    }
    
    // Attach performance timing to response for development environment
    if (process.env.NODE_ENV === 'development') {
      if (!body || typeof body !== 'object') {
        body = { data: body };
      }
      body._performance = {
        executionTimeMs: ms.toFixed(2)
      };
    }
    
    // Call the original json method
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = performanceMonitor;
