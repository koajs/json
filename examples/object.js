const Koa = require('koa')
const filter = require('..')

const app = new Koa()

app.use(filter())

app.use((ctx) => {
  ctx.body = {
    name: 'tobi',
    email: 'tobi@segment.io',
    packages: 5,
    friends: ['abby', 'loki', 'jane']
  }
})

app.listen(3000, console.log('app listening on port 3000'))
