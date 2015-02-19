var redisClient = require('redis').createClient(),
	assert = require("assert"),
	beygir = require('../');


describe('Start beygir with log event and test_worker', function(){
	it('start should return true', function(done){
		assert.equal(true, 
			//beygir started here
			beygir.start({
				'log': {
					worker: require.resolve('./test_worker'),
					callback: function(err, res) {
						if(err) throw Error(err);
						console.log(res);
					}
				},
                'plog:*': {
                    pattern: true,
                    worker: require.resolve('./test_worker'),
                    callback: function(err, res) {
                        if(err) throw Error(err);
                        console.log(res);
                    }
                }
			})
		);
		done();
	});
	it('Send new log event through redis', function(done){
		beygir.enqueue('log', 'TEST');	
		setTimeout(done, 100);
	});
    it('Send new log event through redis', function(done){
        beygir.enqueue('plog:12', 'TEST');
        setTimeout(done, 100);
    });
    it('Send new log event through redis', function(done){
        beygir.enqueue('plog:15', 'TEST');
        setTimeout(done, 100);
    });
});