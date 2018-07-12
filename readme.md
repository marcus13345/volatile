# Volatile

Volatile is a library for serial object mutation powered by es8 async/await.

By default in javascript, there is only one thread, even with async. so having a simple variable like a counter being accessed from different async threads is not a problem.

However, when working with something more compliacted, it may be beneficial to be able to lock an object's value while some operations are performed on it, then unlock it afterwards, allowing others to use it.

## Api

### Create Volatile Object
- Require the volatile package which returns a class.
- Create an instance of Volatile, giving it the initial value (if any) of your object.
``` javascript
const Volatile = require('volatile');
let vObject = new Volatile({});

// This also works for strings, numbers, symbols, etc
let vString = new Volatile('');
let vNumber = new Volatile(4);
let vSymbol = new Volatile(Symbol('customSymbol'));
```

### Lock the Object and perform Serial Operations
- call lock and pass it a function
- perform operations on the variable
- return back the new value

The variable is not immutable, however some types, for example number, it would be impossible to mutatue without using an object wrapper. so to make changes, the return value is used.

The side effect of this, is that if you forget to return, the variable will be set to undefined.

``` javascript
// despite the timeout, at no time will the variable have both
// 1 and 5 accessible. all operations within a lock are guaranteed to finish
// before moving on to the next lock.
vObject.lock(async function(obj) {
	obj.a = 5;
	await new Promise(res => setTimeout(_ => res(), 1000));
	obj.b = 5;
	return obj;
});

vObject.lock(function (obj) {
	obj.a = 1;
	obj.b = 1;
	return obj;
});
```

### toString Behavior

toString will return the value of invoking the internal variable's toString. If that isnt defined, toString will return `'no toString defined'`. You can create on by locking and adding one.

``` javascript
vObject.lock(object => {
	object.myValue = 5;
	object.toString = function() {
		return "Custom toString: " + this.myValue;
	}
});
```