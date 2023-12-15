$(document).ready(function () {
  input = "0";
  let calculationPerformed = false;
  $("td").click(function () {
    vnos = this.innerHTML;
    if (vnos == "C") {
      if (calculationPerformed) {
        input = "0";
        calculationPerformed = false;
      } else {
        input = "";
      }
      $("#display").html(input);
    } else if (vnos == "Del") {
      input = input.slice(0, -1);
      $("#display").html(input);
    } else if (vnos == "=") {
      try {
        input = calculate(input);
        $("#display").html(input);
        input = input.toString();
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
  e = addPriority(e);
  e = removeBrackets(e);
  let total = calculateBracket(e);
  console.log(total);
  if (isNaN(total)) {
    return "Error";
  }
  return total.toString();
}
function addPriority(input) {
  let highPriorityOperators = ["×", "÷", "\\^", "%"];
  let regex = new RegExp(
    `(\\d+\\.?\\d*\\s*[${highPriorityOperators.join("")}]\\s*\\d+\\.?\\d*)`,
    "g"
  );

  return input.replace(regex, "($1)");
}
function findBracketIndex(e) {
  let stack = [];
  let bracketPairs = [];
  for (let i = 0; i < e.length; i++) {
    if (e[i] == "(") {
      stack.push(i);
    } else if (e[i] == ")") {
      if (stack.length) {
        let start = stack.pop();
        bracketPairs.push([start, i]);
      }
    }
  }
  return bracketPairs.sort((a, b) => a[0] - b[0]);
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
  while (bracketPairs.length > 0) {
    let innermostPair = bracketPairs[bracketPairs.length - 1];
    let start = innermostPair[0];
    let end = innermostPair[1];
    let substring = e.substring(start + 1, end);
    let result = calculateBracket(substring);
    e = e.substring(0, start) + result + e.substring(end + 1);
    bracketPairs = findBracketIndex(e);
  }
  return e;
}
function handleFile(files) {
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    var lines = contents.split("\n").map(function (line) {
      return line.replace(/\s/g, "");
    });
    console.log(lines);
    $("#text-results").append(
      lines.map(function (line) {
        return "<p>" + line + calculate(line) + "</p>";
      })
    );
  };
  reader.readAsText(file);
}
