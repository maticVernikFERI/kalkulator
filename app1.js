$(document).ready(function () {
  input = "0";
  let calculationPerformed = false;
  $("td").click(function () {
    vnos = this.innerHTML;
    if (vnos == "Del") {
      if (calculationPerformed) {
        input = "0";
        calculationPerformed = false;
      } else {
        input = "";
      }
      $("#display").html(input);
    } else if (vnos == "C") {
      input = input.slice(0, -1);
      $("#display").html(input);
    } else if (vnos == "=") {
      try {
        input = calculate(input);
        $("#display").html(input);
        calculationPerformed = true;
      } catch (err) {
        input = "Error";
        $("#display").html(input);
        input = "";
      }
    } else {
      if (
        $("#display").html() === "0" ||
        $("#display").html() === "Error" ||
        $("#display").html() === "NaN"
      ) {
        input = this.innerHTML;
      } else {
        input += this.innerHTML;
      }
      $("#display").html(input);
    }
  });
});
function calculate(e) {
  let count = 0;
  let operators = ["+", "-", "×", "÷", "^", "%", "√"];
  for (let i = 0; i < e.length; i++) {
    if (operators.includes(e[i])) {
      count++;
    }
  }
  if (count === 0) {
    console.log(e);
    return e;
  } else if (count === 1) {
    console.log(e);
    return calculateBracket(e);
  } else {
    e = addPriority(e);
    e = removeBrackets(e);
    let total = calculateBracket(e);
    console.log(total);
    if (isNaN(total)) {
      return "Error";
    }
    return total.toString();
  }
}
function addPriority(input) {
  let highPriorityOperators = ["×", "÷", "^", "%", "√"];
  let lowPriorityOperators = ["+", "-"];
  let startHighPriority = false;
  let bracketIndex = -1;
  for (let i = 0; i < input.length; i++) {
    if (highPriorityOperators.includes(input[i]) && !startHighPriority) {
      let j = i - 1;
      while (j >= 0 && !isNaN(input[j])) {
        j--;
      }
      if (j < 0) {
        break;
      }
      input = insertAt(input, j + 1, "(");
      bracketIndex = j + 1;
      startHighPriority = true;
    }
    if (
      (lowPriorityOperators.includes(input[i]) || i === input.length - 1) &&
      startHighPriority
    ) {
      let j = i;
      while (j < input.length && !isNaN(input[j])) {
        j++;
      }
      input = insertAt(input, j, ")");
      startHighPriority = false;
    }
  }
  return input;
}
function insertAt(string, index, substring) {
  return string.slice(0, index) + substring + string.slice(index);
}
function findBracketIndex(e) {
  let openBracketLocations = [];
  let closeBracketLocations = [];
  for (let i = 0; i < e.length; i++) {
    if (e[i] == "(") {
      openBracketLocations.push(i);
    }
    if (e[i] == ")") {
      closeBracketLocations.push(i);
    }
  }
  let bracketPairs = [];
  for (let i = 0; i < openBracketLocations.length; i++) {
    bracketPairs.push([openBracketLocations[i], closeBracketLocations[i]]);
  }
  return bracketPairs;
}
function calculateBracket(e) {
  let elements = [];
  let i = 0;
  while (i < e.length) {
    if (e[i] === "(") {
      let bracketCount = 1;
      let innerExpression = "";
      i++;
      while (bracketCount > 0) {
        if (e[i] === "(") {
          bracketCount++;
        } else if (e[i] === ")") {
          bracketCount--;
        }
        if (bracketCount > 0) {
          innerExpression += e[i];
        }
        i++;
      }
      let result = calculateBracket(innerExpression);
      elements.push(result);
      if (!isNaN(result) && i < e.length && e[i] !== ")") {
        elements.push(e[i]);
        i++;
      }
    } else {
      let num = "";
      while (i < e.length && (isDigit(e[i]) || e[i] === ".")) {
        num += e[i];
        i++;
      }
      num = num ? parseFloat(num) : 0;
      elements.push(num);
      if (i < e.length && e[i] !== ")") {
        elements.push(e[i]);
        i++;
      }
    }
  }

  ["^", "√", "×", "÷", "%", "+", "-"].forEach((operator) => {
    while (elements.includes(operator)) {
      let index = elements.indexOf(operator);
      let num1 = elements[index - 1];
      let num2 = elements[index + 1];
      let result;
      switch (operator) {
        case "+":
          result = (num1 + num2).toFixed(4);
          break;
        case "-":
          result = (num1 - num2).toFixed(4);
          break;
        case "×":
          result = (num1 * num2).toFixed(4);
          break;
        case "÷":
          if (num2 === 0) {
            throw new Error("Division by zero is not allowed");
          }
          result = (num1 / num2).toFixed(4);
          break;
        case "^":
          result = Math.pow(num1, num2).toFixed(4);
          break;
        case "%":
          result = (num1 % num2).toFixed(4);
          break;
        case "√":
          if (num2 < 0) {
            throw new Error("Square root of a negative number is not allowed");
          }
          result = Math.sqrt(num2).toFixed(4);
          break;
      }
      elements.splice(index - 1, 3, parseFloat(result));
    }
  });

  return elements[0];
}
function isDigit(char) {
  return char >= "0" && char <= "9";
}
function removeBrackets(e) {
  let bracketPairs = findBracketIndex(e);
  for (let i = bracketPairs.length - 1; i >= 0; i--) {
    let start = bracketPairs[i][0];
    let end = bracketPairs[i][1];
    let substring = e.substring(start + 1, end);
    let result = calculateBracket(substring);
    e = e.substring(0, start) + result + e.substring(end + 1);
  }
  return e;
}
