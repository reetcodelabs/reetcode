***Note***: This is an advanced version of Curry, you should complete that first before attempting this question.

Currying is the technique of converting a function that takes multiple arguments into a sequence of functions that each takes a single argument.

Implement the curry function which accepts a function as the only argument and returns a function that accepts any number of arguments (vs only one argument at a time in Curry) and returns a function which can be repeatedly called until at least the minimum number of arguments has been provided (determined by how many arguments the original function accepts). The initial function argument is then invoked with the provided arguments.

### Examples

```js
function addTwo(a, b) {
  return a + b;
}
const curriedAddTwo = curry(addTwo);
curriedAddTwo(3)(4); // 7
curriedAddTwo(3, 4); // 7
const alreadyAddedThree = curriedAddTwo(3);
alreadyAddedThree(4); // 7
```

```js
function multiplyThree(a, b, c) {
  return a * b * c;
}
const curriedMultiplyThree = curry(multiplyThree);
curriedMultiplyThree(4)(5)(6); // 120
curriedMultiplyThree(4)(5, 6); // 120
curriedMultiplyThree(4, 5)(6); // 120
curriedMultiplyThree(4, 5, 6); // 120

const containsFour = curriedMultiplyThree(4);
const containsFourMulFive = containsFour(5);
containsFourMulFive(6); // 120
```
