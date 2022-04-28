s = "{}";
let stackArray = new Array();
let opposites = {
    "{": "}",
    "[": "]",
    "(": ")",
};

for (let i of s) {
    console.log(i);
    if (i == "(" || i == "{" || i == "[") {
        stackArray.push(i);
    }
    if (i == ")" || i == "}" || i == "]") {
        //First ending condition
        if (stackArray.pop() != opposites[i]) {
            console.log(false);
        }
    }
    console.log(stackArray);
}
if (stackArray.length != 0) {
    console.log(false);
}
console.log(true);
