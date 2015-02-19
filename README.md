# beygir
Simple worker queue implemention with combination of redis pub-sub and worker-farm.

beygir depends on [Worker Farm](https://github.com/rvagg/node-worker-farm), a very simple useful and stable child process controller package. (Available in npm with name node-worker-farm). On start up beygir subscribes to redis pubsub channels that will enqueue tasks to workers. 

## Installation
beygir is available in npm

```bash
$ npm install beygir
```

## Quick Start

Instantiate beygir by requiring package

```js
var beygir = require('beygir');
```

Then start service by calling start with configuration object

```js
beygir.start({
	//keys in configuration is used as Redis pubsub channel name
	'worker_queue' : { 
		/* worker property contains path to js file to be run in 
		 * child process see next section for worker function */
		worker: require.resolve('path/for/worker/task/js_file'),

		callback: function some_function(error, result){
			/* this function is provided as last argument to worker 
			 * function */
		},

		options: { 
			/* options passed to worker-farm function directly */ 
			/* see worker-farm for details */
		}
	},	
	'task_*': { 
		/* to subscribe to a pattern for channel name you need to 
		 * set pattern property to true */
		pattern: true,

		worker: require.resolve('another/worker/task/js_file')

		/* callback and options properties are not required */
	}
})
```

If you need to trigger a worker manually, you can call

```js
beygir.trigger('worker_queue')
```

If you need to terminate a queue

```js
beygir.end('worker_queue')
```

Finally to shutdown beygir, call end method without arguments.

```js
beygir.end()
```

### Worker Files
Worker file should export a function to be run in child process with signature below

```js
module.exports = function worker(input, channel, callback) {
	/*
	 *
	 */
	callback();	
}
```

**input** argument contains the message received from Redis pubsub 

**channel** argument contains the channel name that message is received from

**callback** is the function provided with start method





