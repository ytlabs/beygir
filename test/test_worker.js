module.exports = function(input, trigger, callback) {
	console.log(input);
	if(callback) callback(null, 'OK for '+trigger);
}