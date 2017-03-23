const spawn = require('child_process').spawn;
const path = require('path');
const root = path.resolve(__dirname);
const DefaultOptions = {
  cors: '*',
  dbPath: null,
  delayTransientStatuses: false,
  inMemory: true,
  optimizeDbBeforeStartup: false,
  port: 8000,
  sharedDb: false
};

module.exports = {
  start: function(options, callback) {
    options = options || DefaultOptions;

    var params = [
      `-Djava.library.path=${root}/DynamoDBLocal_lib`,
      '-jar', `${root}/bin/DynamoDBLocal.jar`
    ];

    if (options.cors) {
      params = params.concat([ '-cors', options.cors ]);
    }

    if (options.dbPath) {
      params = params.concat([ '-dbPath', options.dbPath ]);
    }

    if (options.delayTransientStatuses) {
      params.push('-delayTransientStatuses');
    }

    if (options.inMemory) {
      params.push('-inMemory');
    }

    if (options.optimizeDbBeforeStartup) {
      params.push('-optimizeDbBeforeStartup');
    }

    if (options.port) {
      params = params.concat([ '-port', options.port ]);
    }

    if (options.sharedDb) {
      params.push('-sharedDb');
    }

    this.db = spawn('java', params);

    this.db.stdout.on('data', buffer => console.log(buffer.toString()));
    this.db.stderr.on('data', buffer => console.log(buffer.toString()));

    this.db.on('exit', function(exitCode) {
      console.log('Done!');
    });

    callback(null);
  },

  stop: function() {
    if (this.db) {
      this.db.kill();
    }
  }
};
