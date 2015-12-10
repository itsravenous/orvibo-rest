var restify = require('restify');
var cors = require('cors');
var util = require('util');
var config = require('./config.json');
var svitchManager = require('./svitch-manager');

var server = restify.createServer({
	name: 'nm-vpn-rest',
	version: '0.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(cors({
	origin: function(origin, callback) {
		var originIsWhitelisted = config.allowedClients.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
}));

/**
 * Adds links to a svitch object
 * @param {Svitch} The svitch to which links are to be added
 * @return {Svitch} The svitch, with links added
 */
var injectLinksIntoSvitch = function(svitch) {
	svitch._links = [
		{
			rel: 'self',
			href: util.format('%s://%s:%s/svitches/%s', config.secure ? 'https' : 'http', config.host, config.port, svitch.id)
		}
	];

	return svitch;
};

server.use(function (req, res, next) {
	console.log(req.method, req.path());
	next();
});

server.get('/', function (req, res) {
	svitchManager.getSvitches()
		.then(function (svitches) {
			svitches = svitches.map(function (svitch) {
				return injectLinksIntoSvitch(svitch);
			});
			res.send(svitches);
		});
});

server.get('/svitches/:id', function (req, res, next) {
	svitchManager.getById(req.params.id)
		.then(function (svitch) {
			console.log('sv', svitch);
			res.send(injectLinksIntoSvitch(svitch));
		}, function (err) {
			res.status(404);
			next(new Error(err));
		});
});

server.put('/svitches/:id', function (req, res, next) {
	svitchManager.setSvitchState(req.params.id, req.body.st)
		.then(function (output) {
			svitchManager.getById(req.params.id)
				.then(function (svitch) {
					res.send(injectLinksIntoSvitch(svitch));
				}, function (err) {
					res.status(404);
					next(new Error(err));
				});
		}, function (err) {
			next(new Error(err));
		});
});

server.listen(config.port, function () {
	console.log('%s listening at %s', server.name, server.url);
});
