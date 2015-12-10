var spawn = require('child_process').spawn;
var util = require('util');

var SvitchManager = function () {

};

SvitchManager.prototype = {
	getSvitches: function () {
		return new Promise(function (resolve, reject) {
			var proc = spawn('php', ['orvibo.php', 'list']);
			var switches;
			proc.stdout.on('data', function (data) {
				if (data.toString().trim().length) {
					svitches = JSON.parse(data);
					// Convert to array
					svitches = Object.keys(svitches).map(function (key) {
						var svitch = svitches[key];
						svitch.id = key;
						return svitch;
					});
					resolve(svitches);
				}
			});

			proc.stderr.on('data', function (data) {
				reject(data);
			});

			proc.on('close', function (code) {
			  console.log('child process exited with code ' + code);
			});
		});
	},

	getById: function (id) {
		return this.getSvitches()
			.then(function (svitches) {
				return new Promise(function (resolve, reject) {
					var svitch = svitches.filter(function (svitch) {
						return svitch.id === id;
					})[0];
					if (svitch) {
						resolve(svitch);
					} else {
						reject(util.format('No switch with id %s exists', id));
					}
				});
			});
	},

	/**
	 * Turns a svitch on or off
	 * @param {String} id    svitch id
	 * @param {Number} state On (1) or off (0)
	 * @return {Promise}
	 */
	setSvitchState: function (id, state) {
		return new Promise(function (resolve, reject) {
			var proc = spawn('php', ['orvibo.php', state === 1 ? 'on' : 'off', id]);
			var switches;
			proc.stdout.on('data', function (data) {
				resolve(data);
			});

			proc.stderr.on('data', function (data) {
				reject(data);
			});

			proc.on('close', function (code) {
			  console.log('toggle process exited with code ' + code);
			});
		});
	}
};

// Export singleton
module.exports = new SvitchManager();
