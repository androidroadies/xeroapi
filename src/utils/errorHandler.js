exports.errorHandler = (res, error) => {
  // Default status and message
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let errorDetails = null;
  console.log("errorHandler.js", 6, "-  ->", error.json);
  try {
    if (error.response) {
      // Handle Xero API errors
      console.error('Xero API Error:', JSON.stringify(error.response.body, null, 2));
      statusCode = Number(error.response.status) || 500;

      // Validate status code
      if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode >= 600) {
        statusCode = 500;
      }

      // Specific handling for common Xero API errors
      if (statusCode === 429) {
        message = 'Rate limit exceeded. Please try again later.';
        errorDetails = { hint: 'Check Xero API rate limits' };
      } else if (statusCode === 401) {
        message = 'Authentication failed. Please check your credentials.';
      } else if (statusCode === 403) {
        message = 'Access denied. Insufficient permissions.';
      } else {
        message = 'Xero API error occurred';
        errorDetails = error.response.body; // Only include in non-production or sanitize
      }

      // In production, avoid exposing raw API error details
      if (process.env.NODE_ENV === 'production') {
        errorDetails = null; // Prevent leaking sensitive data
      }
    } else if (error.request) {
      // Handle network or request errors
      console.error('Request Error:', error.request);
      message = 'Network or request error';
      errorDetails = { hint: 'Failed to reach Xero API. Please check your network connection.' };
    } else {
      // Handle unexpected errors
      console.error('Unexpected Error:', error);
      errorDetails = { hint: error.message || 'No error message provided' };
    }

    // Send response
    return res.status(statusCode).json({
      message,
      error: errorDetails,
    });
  } catch (handlerError) {
    // Fallback for errors in the error handler
    console.error('Error Handler Failure:', handlerError);
    return res.status(500).json({
      message: 'Internal server error',
      error: null,
    });
  }
};