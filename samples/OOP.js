//*Classes*//
//ES5//
function Person(name) {
    this.name = name;
}

Person.prototype.run = function () {
    console.log(this.name +
        " is running.");
};

var p = new Person("Ajay");
p.run();

//If new was not used
//*this* will be global scope
//in this b wont be a instance
//of class Person
var b = Person();
//ES6//
class Person {
    constructor(name){
        this.name = name;
    }
    run(){
        console.log(this.name +
            "is running.");
    }
}
let p = new Person("ajay");
p.run();
//TS//
class Person {
    private id : number
    name : string
    constructor(
        name : string,
        //auto declartion
        //and mapping with properties
        //Person now has age property
        public age : number){
            this.id = 101;
            this.name = name;
        }
    run(){
        console.log(this.name +
            " is running.");
    }
}
let p = new Person("bill", 40);
p.run();
console.log(p.name + " @ " + p.age);
//accessing private properties 
//not allowed
console.log(p.id);
//EOT//
