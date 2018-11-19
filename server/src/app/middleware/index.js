const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../modules');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const setupMiddleware = function(app) {
    // compress
    app.use(compress());
    //helmet
    app.use(helmet());

    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)

    // Body parsing
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

    app.use(session({
        secret: 'S57^89e@7W2Nid$a', resave: true,
        saveUninitialized: true
    }));// session secret

    // mount api routes
    /*eslint-disable */
    app.use(routes.baseURI, routes.api(middleware));
};
/*eslint-disable */
const middleware = {
    api: {
        cors,
    },
};

module.exports = setupMiddleware;
module.exports.middleware = middleware;
