$(document).ready(function () {
  input = "";
  $("td").click(function () {
    vnos = this.innerHTML;
    if (vnos == "Del") {
      input = "";
      $("#display").html(input);
    } else if (vnos == "±") {
      input = (parseFloat(input) * -1).toString();
      $("#display").html(input);
    } else if (vnos == "pow") {
      input += "**";
      $("#display").html(input);
    } else if (vnos == "C") {
      input = input.slice(0, -1);
      $("#display").html(input);
    } else if (vnos == "=") {
      try {
        input = calculate(input);
        $("#display").html(input);
      } catch (err) {
        input = "Error";
        $("#display").html(input);
      }
    } else {
      input += this.innerHTML;
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
    return e;
  } else if (count === 1) {
    return calculateBracket(e);
  } else {
    e = addPriority(e);
    e = removeBrackets(e);
    let total = calculateBracket(e);
    console.log(total);
    return total;
  }
}
function sum(a, b) {
  a = parseInt(a);
  b = parseInt(b);
  return a + b;
}
function sub(a, b) {
  return a - b;
}
function mul(a, b) {
  return a * b;
}
function div(a, b) {
  return a / b;
}
function pow(a, b) {
  return a ** b;
}
function sqrt(a) {
  return Math.sqrt(a);
}
function mod(a, b) {
  return a % b;
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
  let total = 0;
  let i = 0;
  while (i < e.length) {
    let num1 = "",
      num2 = "";
    while (i < e.length && !isNaN(e[i])) {
      num1 += e[i];
      i++;
    }
    let operator = e[i];
    i++;
    while (i < e.length && !isNaN(e[i])) {
      num2 += e[i];
      i++;
    }
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    switch (operator) {
      case "+":
        total += sum(num1, num2);
        break;
      case "-":
        total += sub(num1, num2);
        break;
      case "×":
        total += mul(num1, num2);
        break;
      case "÷":
        total += div(num1, num2);
        break;
      case "^":
        total += pow(num1, num2);
        break;
      case "%":
        total += mod(num1, num2);
        break;
      case "√":
        total += sqrt(num2);
        break;
    }
  }
  return total;
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
