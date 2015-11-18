//*Variable Declarations*//
//ES5//
var counter = 0;
counter = 2;

var name = "Scott";
var isAdmin = true;
/*
Using a variable without
declaring is allowed in ES5 
*/
xyz = 10;
console.log(xyz);
/*
xyz now part of global scope.
can be accessed via "this"
*/
console.log(this.xyz);
console.log(typeof xyz);
/*
delete removes a property 
from an object.
*/
delete xyz;
console.log(typeof xyz);
//ES6//
var name = "Scott";
//All the samples henceforth
//will be using let 
//instead of var
let counter = 0;
const pi = 3.14;
/*
Assignment to constant
variable after declaration
will be a runtime error
*/
pi = 3.5;
/*
Using a variable without
declaring will give 
runtime error in ES6
*/
abc101 = 123;
//TS//
var name = "Bill";
let counter = 0;
const pi = 3.14;
/*
Assignment to constant
variable after declaration
will be a runtime error
*/
pi = 3.5;

//a variable declared as number
var limit : number = 10;
//assigning string to a 
//number not allowed
limit = "a";
//Types can be inferred
//city now a string
var city = "London";
//not allowed
city = false;
//try making city of type "any"
//EOT//
//*Variable Scope*//
//ES5//
function f1(a){
	if(a === 2){
		var color = "blue";
	}
	//color accessible outside block
	console.log(color);
}
f1(2);
/*
As all the variables are moved to top
above code is equivalent to
*/
function f2(a){
	var color;
	if(a === 2){
		color = "blue";
	}
	//color accessible naturally
	console.log(color);
}
/*
This applies to variables declared 
with-in other blocks like for
*/
function f3(){
	var sum = 0;
	for(var i = 0; i < 5; i++){
		sum += i;
	}
	console.log(sum);
	//i accessible here
	console.log(i);
}
f3();

function f4(){
    //This will not result into
    //error as x is declared some
    //where in the function
    console.log(x);
    //This line will give error
    //as y is not declared
    console.log(y);
    var x = 2;    
    //2
    console.log(x);
}
f4();
//ES6//
/*
`let` solve this problem
variables declared with 
`let` are accessible
only with block-scope
*/
function f1(a){
	if(a == 2){
		let color = "blue";
	}
	//will get run-time error
	console.log(color);
}
f1(2);
function f3(){
	let sum = 0;
	for(let i = 0; i < 5; i++){
		sum += i;
	}
	console.log(sum);
	//will get run-time
	//error for i
	console.log(i);
}
f3();
//EOT//
//*Some gotchas*//
//ES5//
var a = 1;
var b = "2";

//12
console.log(a + b);

//+ forces treatment of 
//b as integer 
console.log(a + (+b));

var c = 1;
var d = "1";
//true
console.log(c == d);
//false - as type dont match
console.log(c === d);
//EOT//
//*Arrays*//
//ES5//
//array
var numbers = [1, 2, 3];

//with for loop
for(var i = 0;
    i < numbers.length;
    i++){
    console.log(i + ":" 
        + numbers[i]);
}

//for-in for array
//n is index
for(var n in numbers) {
    console.log(n + ":" 
        + numbers[n]);
}
//ES6//
let numbers = [5, 7, 11];

//New feature "Iterators"
for(let n of numbers){
    //here n is actual 
    //item from array
	//and not index
	console.log(n);
}
//TS//
//check how TS compiles
//below code to ES5 and ES6
let numbers = [13, 17, 19];

//New feature == "Iterators"
for(let n of numbers){
    //here n is actual 
    //item from array
	//and not index
	console.log(n);
}
//EOT//
//*Function and Arguments*//
//ES5//
function doSomeThing(a, b){
	console.log("Param a : " + a + 
				", Param b : " + b);
}
//actual parameters may differ from
//parameters declared by function
doSomeThing(1, 2);
doSomeThing("x", "y", "z");
doSomeThing();
//arguments == actual parameters 
//note that arguments !== array
function max(){
	var result = 0;
	for(var i = 0; 
		i < arguments.length; i++){
		if(arguments[i] > result){
			result = arguments[i];
		}
	}
	return result;
}
max(4, 2, 3);
max(4, 2, 7, 5);
//ES6//
//Rest Parameters
//Not yet implemented in Chrome
//Works only with Firefox
function sum(a, b, ...rest){
    let result = a + b;
    for(let eachP of rest){
        result += eachP;
    }
    console.log(result);
}
//sum function takes 2 to n parameters
sum(1,2,3);
//you can still pass
//unexpected set of parameters
sum(1);
//TS//
function sum(a, b, ...rest){
    let result = a + b;
    for(let eachP of rest){
        result += eachP;
    }
    console.log(result);
}
//sum function takes 2 to n parameters
sum(1,2,3,4);
//TS Complier will throw
//an error, incase expected
//numbers of parameters are
//not passed
sum(1);
//EOT//
//*Objects*//
//ES5//
var id = 123;
var employee = {
	id : id,
	projects : ["MS", "FR"],
	work : function() {
   		console.log("Please work");	
	}
};
//new properties can be added
employee.name = "Bill";
//existing properties can be accessed
//and can be modified
employee.id = 125;
//Hierarchy of objects
employee.address = { 
    city : "Redmond", 
	zip : 98005,
};

//Accessing object properties
var idProperty = "id";
var eName = employee["name"];
var eId = employee[idProperty];
var eCity = employee.address.city;

//for-in for object
//object is like a dictionary
//set of key-value pair
for(var eachProperty in employee){
	console.log(eachProperty + "-" 
		+ employee[eachProperty]);
}
//ES6//
let id = 124;
let nP = "name";
let employee = {
    //short-hand syntax for id:id
    id,
    //computed property names
	[nP] : "Scott",
    //concise method syntax
    work() {
		console.log("Please work");
    }
};
for(let eachProperty in employee){
    console.log(eachProperty + "-"
		+ employee[eachProperty]);
}
//TS//
let id = 124;
let employee = {
    //short-hand syntax for id:id
    id,
    //computed properties not
    //yet supported
    name : "Steve",
    //concise method syntax
    work() {
		console.log("Please work");
    }
};
for(let eachProperty in employee){
    console.log(eachProperty + "-"
		+ employee[eachProperty]);
}
for(var eachProperty in employee){
	console.log(eachProperty + "-"
		+ employee[eachProperty]);
}
//EOT//
//*Function Declaration*//
//ES5//
//isEven1 can be called
//before its declaration
isEven1(2);
//isEven2 is not accessible here
//as it is declared with var
isEven2(3);
function isEven1(n){
    console.log(n % 2 === 0);
}
var isEven2 = function(n){
    console.log(n % 2 === 0);
};
//isEven2 is accessible here
//post its declaration
isEven2(3);
//EOT//
//*Passing function as parameter*//
//ES5//
function square(n, print){
    print(n * n);
}
square(2, function(result){
    console.log(result);
});
square(3, function(result){
    alert(result);
});
var numbers = [1,2,3,4];
var eNumbers = numbers.filter(function(eN){
    return eN % 2 === 0; 
});
console.log(eNumbers);
//ES6//
function square(n, print){
    print(n * n);
}
square(2, (result) => console.log(result));
square(3, (result) => alert(result));
var numbers = [1,2,3,4];
var eNumbers = numbers.filter((eN) => eN % 2 === 0);
console.log(eNumbers);
//EOT//
//*Closure*//
//ES5//
function addToNSeq(n){
	var base = n * n;
	//This inner function has access 
	//to all the variables in the scope
	return function(b){
		return base + b; 
	};
}

var addTo2Seq = addToNSeq(2);
console.log(addTo2Seq(10));

var addTo3Seq = addToNSeq(3);
console.log(addTo3Seq(20));
//EOT//
//*IIFE*//
//ES5//
/*
Immediately invoked function expression
Reduce global variable pollution
Avoids name collision across files
*/
(function(num){
	//scope of a and b
	//limited to the current
	//function only
	var a = 1;
	var b = 2;
	console.log(num);
})(4);
//EOT//
//*Some more gotchas*//
//ES5//
var tasks = [];
for(var i = 0; i < 5; i++){
	//inline function has access to i
	tasks.push(function(){
		console.log(i);
	});
}
//.forEach is a inbuilt method
tasks.forEach(function(eachTask){
	eachTask();
});

var tasks2 = [];
for(var i = 0; i < 5; i++){
	tasks2.push((function(index){
		//i passed as index to a IIEF
		return function(){
			console.log(index);
		};
	})(i));
}
tasks2.forEach(function(eachTask){
	eachTask();
});
//ES6//
let tasks = [];
//as scope of let is block level
//ES6 do not have this problem
for(let i = 0; i < 5; i++){
    //short hand syntax for function
    tasks.push(() => console.log(i));
}
tasks.forEach(eachTask => eachTask());
//EOT//
//*Extending with prototype*//
//ES5//
//name is a String
//methods like toUpperCase() are 
//defined on "prototype" of String
var name = "Tom";
//adding toPC (to Pascal Case)
String.prototype.toPC = function() {
    //this points to current string
    if(this.length == 0){
        return "";
    }
    /*
	string can be accessed as array
	note : this may fail with 
	double-byte characters
	*/
    var fC = this[0];
    var rP = this.substr(1, 
                    this.length);
    return fC.toUpperCase() 
		 + rP.toLowerCase();
};
console.log(name.toPC());
//EOT//
//*Function and Methods*//
//ES5//
//as Function
function add(a, b){
    return a + b;
}
//As Function
add(1,2);
var car = {
    model: "BMW",
    run: function () {
        //if called as function
        //this is window
        console.log(this.model 
            + " is running");
    }
};
//As Method
car.run();
var runFunction = car.run;
//calling methods as function
//gives wired results
runFunction();
//ES6//
/*
In strict mode (ES6), the value of this
remains at whatever it's set to when
entering the execution context.
If it's not defined,
it remains undefined.
*/
let car = {
    model: "BMW",
    run() {
        console.log(this.model
            + " is running");
    }
};
//As Method
car.run();
let runFunction = car.run;
//Will throw an error as there is
//no default this in ES6
runFunction();
//EOT//
//*apply and call*//
//ES5//
/*
Helps to call a function in the
context of an object
*/
var slowCar = { maxSpeed: 60 };
var fastCar = { maxSpeed: 90 };

function start(reqSpeed,
                direction) {
    var speed = Math.min(reqSpeed,
        this.maxSpeed);
    console.log("Speed = " 
                + speed + ", " +
        "Requested Speed = " 
            + reqSpeed + ", " +
        "Direction = " 
            + direction);
}
//apply ==> arguments as array
//*this* will point to slowCar
start.apply(slowCar, [70, "East"]);
//call ==> explicit arguments
//*this* will point to fastCar
start.call(fastCar, 80, "West");
//EOT//