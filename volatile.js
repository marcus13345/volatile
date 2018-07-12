mopdule.exports = class Volatile {
	constructor(obj) {
		this.obj = obj;
	}
	lock(actionFunction) {
		return new Promise(unlock => {
			let inst = this;
			if (this.queue instanceof Promise) {
				this.queue = this.queue.then(async function () {
					let ret = actionFunction(inst.obj);
					if (ret instanceof Promise) ret = await ret;
					inst.obj = ret;
					unlock();
				});
			} else {
				this.queue = new Promise(async (resolve) => {
					let ret = actionFunction(this.obj);
					if (ret instanceof Promise) ret = await ret;
					this.obj = ret;
					unlock();
					resolve();
				});
			}
		});
	}
	toString() {
		return this.obj.toString() || 'no toString defined';
	}
}