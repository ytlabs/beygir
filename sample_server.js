var beygir = require('./main');

beygir.start({
	'log': {
		worker: require.resolve('./test/test_worker'),
		callback: function(err, res) {
			if(err) throw Error(err);
			console.log(res);
		}
	}
})

var counter = 10;
setInterval(function(){
	console.log('send');
	beygir.enqueue('log', {test: counter});
	counter ++;
}, 1000);
