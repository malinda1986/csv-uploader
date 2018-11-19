const chalk = require('chalk');
const config = require('./config');
const mongo = require('./db/mongo');
const {setConnectionOfSocket} = require('./servies/socket');

const Server = {
    /**
     * @Description Start the server
     * @returns {Promise}
     */
    start(rootApp) {
        this.rootApp = rootApp;
        this.port = config.get('port');
        this.ip = config.get('ip');
        return new Promise((resolve) => {
            const server = require('http').Server(rootApp);

            this.httpServer = server.listen(this.port);

            const io = require('socket.io')(server);
            //const room = "abc123";
            setConnectionOfSocket(io);

            rootApp.set('socket', io);
            this.httpServer.on('error', (error) => {
                console.log(
                    chalk.red('(Code: ' + error.errno + ')'),
                    chalk.red('\nThere was an error starting your server.'),
                    chalk.red('Please use the error code above to search for a solution.')
                );
                /*eslint-disable */
                process.exit(-1);
            });

            this.httpServer.on('listening', () => {
                this.logStartMessages();
                try{
                    mongo().then( con => {
                        this.logDBMessages(con)
                        resolve(this);
                    }).catch(error => {
                        return new Error(error);
                    });
                }catch (e){
                    console.log(e)
                }


            });
        });
    },

    /**
     * @Description Stop Server
     * @returns {Promise}
     */
    stop() {
        return new Promise((resolve) => {
            if (this.httpServer === null) {
                resolve(self);
            } else {
                this.httpServer.close(function() {
                    this.httpServer = null;
                    this.logShutdownMessages();
                    resolve(this);
                });

            }
        });
    },

    logDBMessages(conn){
        console.log(
            chalk.green(' Mongo db is running...')
        );
    },

    logStartMessages() {
        if (process.env.NODE_ENV === 'production') {
            console.log(
                chalk.green(' Service is running...'),
                '\n Service is now available on',
                'http://' + ip + ':' + port,
                chalk.gray('\nCtrl+C to shut down')
            );
        } else {
            console.log(
                chalk.green(' Service running in ' + (process.env.NODE_ENV || 'development') + '...'),
                '\nListening on',
                'http://' + this.ip + ':' + this.port,
                chalk.gray('\nCtrl+C to shut down')
            );
        }

        function shutdown() {
            console.log(chalk.red('\n Service has shut down'));
            if (process.env.NODE_ENV === 'production') {
                console.log(
                    '\n Service server is now offline'
                );
            } else {
                console.log(
                    '\n Service was running for',
                    Math.round(process.uptime()),
                    'seconds'
                );
            }
            process.exit(0);
        }
        // ensure that server exits correctly on Ctrl+C and SIGTERM
        process.
        removeAllListeners('SIGINT').on('SIGINT', shutdown).
        removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
    },

    logShutdownMessages() {
        console.log(chalk.red('Service is closing'));
    }
}

module.exports = Server ;