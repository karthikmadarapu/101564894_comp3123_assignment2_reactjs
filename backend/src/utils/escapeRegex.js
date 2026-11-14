// Escape regex metacharacters so user input is matched literally
module.exports = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
