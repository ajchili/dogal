const quotes = [
  'Dogs can dream',
  'Dogs can see in the dark',
  'Dogs can smell things much better than humans can',
  'Yawning is contagious, dogs even do it when you do',
  'Dogs aren\'t colorblind',
  'Dogs can sweat between their paw pads',
  'Dogs can learn over 1000 words',
  'There are over 14000 shelters across america, consider visiting one for another dog',
  'Obesity is a huge issue among dogs, don\'t use too many treats',
  'Dogs can be taught math, maybe they can help with your taxes',
  'Don\'t forget that dogs need to have their teeth brushed too',
  'Dogs have 18 muscles in their ears',
  'Your dog may stink, but don\'t bathe them too often, their skin can dry out'
];

module.exports = {
  quotes,
  generate: () => {
    let index = Math.floor(quotes.length * Math.random());
    return quotes[index];
  }
};