const http = require ('http');
const db = require('./models');
const app = require('./app');

var cors = require('cors')

app.use(cors())
app.set('port', process.env.PORT || 8000);
const server = http.createServer(app);
db.sequelize.sync().then(() => {
server.listen(process.env.PORT || 8000, () => console.log(`Application démarrée`));
});
 