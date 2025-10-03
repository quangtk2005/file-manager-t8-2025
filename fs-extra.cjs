const fs = require('fs-extra');
// Async with promises:
fs.copy('media', 'dist/media')
  .then(() => console.log('media success!'))
  .catch(err => console.error(err));

// fs.copy('views', 'dist/views')
//   .then(() => console.log('views success!'))
//   .catch(err => console.error(err));

fs.copy('vercel.json', 'dist/vercel.json')
  .then(() => console.log('vercel.json success!'))
  .catch(err => console.error(err));