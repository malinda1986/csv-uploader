const Nconf = require('nconf');
const nconf = new Nconf.Provider();
const env = process.env.NODE_ENV || 'development';

nconf.argv();
nconf.env('__');

nconf.file('p1', `${__dirname}/environment/${env}.json`);
nconf.file('p2', `${__dirname}/defaults.json`);

nconf.set('env', env);

module.exports = nconf;
