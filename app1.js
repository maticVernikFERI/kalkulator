$(document).ready(function () {
  input = "0";
  $("td").click(function () {
    vnos = this.innerHTML;
    if (vnos == "Del") {
      input = "";
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
      if (input === "0" || input === "Error" || input === "NaN") {
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
    while (i < e.length && (isDigit(e[i]) || e[i] === ".")) {
      num1 += e[i];
      i++;
    }
    let operator = e[i];
    i++;
    while (i < e.length && (isDigit(e[i]) || e[i] === ".")) {
      num2 += e[i];
      i++;
    }
    num1 = num1 ? parseFloat(num1) : 0;
    num2 = num2 ? parseFloat(num2) : 0;
    switch (operator) {
      case "+":
        total += num1 + num2;
        break;
      case "-":
        total += num1 - num2;
        break;
      case "×":
        total += num1 * num2;
        break;
      case "÷":
        total += num1 / num2;
        break;
      case "^":
        total += Math.pow(num1, num2);
        break;
      case "%":
        total += num1 % num2;
        break;
      case "√":
        total += Math.sqrt(num2);
        break;
    }
  }
  return total;
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
