const rateLimitMap = new Map(); // Tracks requests per user
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // Allow 5 requests per minute per user

export const isRateLimited = (userId) => {
  const currentTime = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];

  // Filter out old requests
  const filteredRequests = userRequests.filter(
    (timestamp) => currentTime - timestamp < RATE_LIMIT_WINDOW
  );

  if (filteredRequests.length >= MAX_REQUESTS) return true;

  filteredRequests.push(currentTime);
  rateLimitMap.set(userId, filteredRequests);
  return false;
};
