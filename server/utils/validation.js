export const sanitizeUsername = (username) => {
  if (!username || typeof username !== 'string') return '';
  return username.trim().replace(/[^a-zA-Z0-9_\s-]/g, '').substring(0, 20);
};

export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') return '';
  return message.trim().substring(0, 200);
};
