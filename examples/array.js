
/**
 * Module dependencies.
 */

var Koa = require('koa');
var filter = require('..');

var app = new Koa();

app.use(filter());

app.use((ctx) => {
  ctx.body = [
    {
      name: 'tobi',
      email: 'tobi@segment.io',
      packages: 5,
      friends: ['abby', 'loki', 'jane']
    },
    {
      name: 'loki',
      email: 'loki@segment.io',
      packages: 2,
      friends: ['loki', 'jane']
    },
    {
      name: 'jane',
      email: 'jane@segment.io',
      packages: 2,
      friends: []
    },
    {
      name: 'ewald',
      email: 'ewald@segment.io',
      packages: 2,
      friends: ['tobi']
    }
  ]
});

app.listen(3000);
console.log('app listening on port 3000');
