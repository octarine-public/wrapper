declare interface Callbacks {
	timeStart: number,
	timeEnd: number,
	time: number,
	callback: (value?: number) => void
}

export default class Benchmark {

	readonly iterations: number = 1000000;
	readonly callbacks: Callbacks[] = [];

	/**
	 * Benchmark
	 * @param {Array} callbacks Array of callbacks
	 * @param {number=} iterations default - 1 000 000
	 * 
	 * @example
	 * new Benchmark([
	 * 		function () {
	 * 			// your code
	 * 		},
	 * 		function () {
	 * 			// your code
	 * 		}
	 * ], 100000).Start().ShowResult();
	 */
	constructor(callbacks?: ((value?: number) => void)[] | ((value?: number) => void), iterations?: number) {

		if (iterations !== undefined)
			this.iterations = iterations;

		if (Array.isArray(callbacks)) {
			for (var i = 0, len = callbacks.length; i < len; i++) {

				this.callbacks.push({
					timeStart: 0,
					timeEnd: 0,
					time: 0,
					callback: callbacks[i]
				});
			}
		} else {

			this.callbacks.push({
				timeStart: 0,
				timeEnd: 0,
				time: 0,
				callback: callbacks
			});
		}
	}

	/**
	 * 
	 * @param number number benchmark will be start only for given number
	 */
	Start(number?: number): Benchmark {

		if (typeof number == 'number') {

			if (number > this.callbacks.length - 1)
				throw Error("number is greater than length of callbacks");

			let callbackFunc = this.callbacks[number].callback;

			let time = Date.now();

			for (var m = this.iterations; m--;)
				callbackFunc(m);

			let timeEnd = Date.now();

			this.callbacks[number].timeStart = time;
			this.callbacks[number].timeEnd = timeEnd;
			this.callbacks[number].time = timeEnd - time;

		} else {

			for (var i = 0, len = this.callbacks.length; i < len; i++) {

				let callbackFunc = this.callbacks[i].callback;

				let time = Date.now();

				for (var m = this.iterations; m--;)
					callbackFunc(m);

				let timeEnd = Date.now();

				this.callbacks[i].timeStart = time;
				this.callbacks[i].timeEnd = timeEnd;
				this.callbacks[i].time = (timeEnd - time);// / this.iterations;
			}

		}

		return this;
	}

	/**
	 * @param number number of callback in all callbacks
	 */
	ShowResult(number?: number): Benchmark {
		if (typeof number == 'number') {

			if (number > this.callbacks.length - 1)
				throw Error("number is greater than length of callbacks");

			console.log(number + ":\t"
				+ this.callbacks[number].time + " ms = " + this.callbacks[number].timeStart + " - " + this.callbacks[number].timeEnd);

		} else {
			for (var i = 0, len = this.callbacks.length; i < len; i++)
				console.log(i + ":\t"
					+ this.callbacks[i].time + " ms = " + this.callbacks[i].timeStart + " - " + this.callbacks[i].timeEnd);
		}

		return this;
	}
	
	StartAndShow(number?: number): Benchmark {
		this.Start(number);
		this.ShowResult(number);
		return this;
	}
}