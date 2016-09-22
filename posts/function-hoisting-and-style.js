<!DOCTYPE html><html><head><title>function hoisting and style | Jason Pincin</title><link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/default.min.css"><link rel="stylesheet" href="/site.css"></head><body><div id="links"> <ul><li><a href="http://jason.pincin.com/">blog</a></li><li><a href="https://github.com/jasonpincin">github</a></li><li><a href="https://twitter.com/jasonpincin">@jasonpincin</a></li></ul></div><div id="header"> <h1>function hoisting and style</h1><sub>published by Jason Pincin on 2016-09-22 </sub></div><div id="main"><article id="article"><div>
In my [last post](../name-your-javascript-functions), I wrote about the importance of naming your Javascript functions and the impact it has on observability. This time around I'm going to diverge from factual presentation, and talk about oft-debated coding styles. Some (many?) of you won't agree with me, but I'm right. 

## implementation follows intent

Now that we're naming all of our functions, there's some stylistic patterns we can use to make our code more digestible by humans. The idea is to have intent lead implementation. When reading the code, the first thing we see it the logic of the immediate function, followed by any function definitions in this scope. This gives us a nice summary (self-documented through clear function names) with increasing detail as we continue to read a block of code. Let us look at some examples. First, let's see the opposite of the pattern I'm about to advocate:

```javascript
// accepts an array of numbers, returns the number of odd numbers
function oddCount (nums) {
	return nums.filter(function (num) {
		return ((num % 2) === 1)
	}).length
}
```

There's obviously a myriad of other, some better, ways to implement this function, but I chose this implementation to illustrate a point that is applicable all over. Lets refactor the above function with two goals: name all functions, and lead implementation with intent for readability. 

```javascript
// accepts an array of numbers, returns the number of odd numbers
function oddCount (nums) {
	return nums.filter(isOdd).length
	
	function isOdd (num) {
		return ((num % 2) === 1)
	}
}
```

This is improved. Now when we read the `oddCount` implementation we're confronted with a single line of logic which reads very naturally, explaining to us exactly how it's working. It filters out what's not odd and gives us the length of the resulting array. Even in this very simplistic example, you can see how the latter approach is more easily digested than being confronted with the `oddCount` and `isOdd` implementations all at once in the previous example. The value of this approach only increases as code complexity increases. 

But we can do better! Now that we've got a named filter function, we can also remove a closure here. Lets refactor one more time:

```javascript
// accepts an array of numbers, returns the number of odd numbers
function oddCount (nums) {
	return nums.filter(isOdd).length
}

function isOdd (num) {
	return ((num % 2) === 1)
}
```

Unlike the anonymous function approach, we've now removed our `isOdd` function from the `oddCount` function, thereby eliminating a closure. This is a small performance boost and a win for readability. Win-win. 

You may be thinking arrow functions make this all cleaner. What about this ES6-ish implementation?

```
function oddCount (nums) {
	return nums.filter(num => (num % 2) === 1).length
}
```

I would argue the preceding approach still wins hands-down over the arrow function style, in both readability and [observability](../name-your-javascript-functions). Not sure about you, but `nums.filter(isOdd)` is just less taxing for me to parse than `nums.filter(num => (num % 2) === 1)` as I scan across the line.

## constructors and prototypes

Another readability win comes when using this pattern for constructor and prototypes. Lets dive right into an example:

```javascript
module.exports = Rectangle

function Rectangle (width, height) {
	this.width = width
	this.height = height
}

Rectangle.prototype.getPerimeter = function () {
	return 2 * (this.width + this.height)
}

Rectangle.prototype.getArea = function () {
	return this.width * this.height
}
```

This is a very typical pattern. You've probably seen this example constructor a thousand times. The downfall of this style, is that in order to get an idea of my Rectangle's API, I need to scan through the entire codebase of this `rectangle.js` file, or do a big comment at the top that basically duplicates what the code could tell me, or refer out to some README. Let's refactor this to follow the pattern we've been talking about in this post:

```javascript
module.exports = Rectangle
Object.assign(Rectangle.prototype, {
	getPerimeter,
	getArea
})

function Rectangle (width, height) {
	this.width = width
	this.height = height
}

function getPerimeter () {
	return 2 * (this.width + this.height)
}

function getArea () {
	return this.width * this.height
}
```

The style here may be a little different than what you're used to, but it accomplishes the exact same thing. More importantly, no matter how many methods I attach to Rectangle, or how complex those methods become, I retain a self-documented summary of exposed methods at the top of my file. As a developer, when I open this file up, I immediately get a pretty good idea of what features these Rectangle objects offer... and if I want more detail about a specific method, I can refer down (my editor likely has a shortcut to jump to that function's implementation). 

## es6 classes

You might be wondering if this style works with ES6+ classes. The short answer is no. ES6+ classes are [no-good](https://github.com/tc39/proposal-class-public-fields/issues/35), [rotten](https://github.com/joshburgess/not-awesome-es6-classes), and [horrible](http://christianalfoni.github.io/javascript/2015/01/01/think-twice-about-classes.html), in my not-so-humble opinion. There's a lot to love in ES6, but `class` doesn't make that list. 

Seriously, read over those posts by others I just linked. There's a lot of good content, and suggestions on how to do things better in your codebase and avoid the `class` trap. 

## conclusion

Coding styles are a hotly debated topic, and will remain so for all time. I have a lot of my own opinions on what makes good style (semi-colons suck, there I said it), but I don't typically try to evangelize them. In the case of what I discussed in this post though, I believe there's some concrete, very visible benefits with respect to readability and clarity. Would love to know if you find this useful, or if you despise me for writing it. Ping me [@jasonpincin](https://twitter.com/jasonpincin). </div></article></div><script src="http://localhost:35729/livereload.js"></script></body></html>