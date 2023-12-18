$(document).ready(function () {
  let input = ""; //Za celotni vnos
  let result = 0;
  $("td").click(function () {
    let vnos = this.innerHTML; //Trenutni vnos

    //Preveri če je izpisan trenutno že izračun končni
    if (/^([bdoh][0-9A-Z]+[bdoh]=[0-9A-Z]+)$/.test(input)) {
      input = "";
    }

    if (this.id == "clear") {
      input = "";
    } else if (
      vnos == "BIN" ||
      vnos == "DEC" ||
      vnos == "HEX" ||
      vnos == "OCT"
    ) {
      input += vnos.toLowerCase().charAt(0);
    } else if (vnos == "=") {
      result = checkInput(input);
      if (result == -1) {
        window.alert("Narobe napisana enačba");
      } else {
        input += "=" + result;
      }
    } else {
      input += vnos;
    }
    display(input);
  });
  $("#bin, #dec, #hex, #oct").addClass("active");

  var operationCounter = 0;
  var numberCounter = 0;
  var lastOperation = "";
  function checkOperationCounter() {
    if (operationCounter === 2) {
      $("td").removeClass("active");
      $("#equal, #clear").addClass("active");
    }
    if (operationCounter == 1 && numberCounter == 0) {
      $("#dec, #hex, #oct, #bin").removeClass("active");
    }
    if (operationCounter == 1 && numberCounter > 0) {
      $("#dec, #hex, #oct, #bin").addClass("active");
      checkOperator();
    }
  }

  function checkNumberCounter() {
    if (operationCounter === 1 && numberCounter === 0) {
      $("td").removeClass("active");
      $(
        "#0, #1, #2, #3, #4, #5, #6, #7, #8, #9, #A, #B, #C, #D, #E, #F"
      ).addClass("active");
    }
    if (numberCounter === 1) {
      $("#bin, #dec, #hex, #oct").addClass("active");
      checkOperator();
    }
  }

  function checkOperator() {
    if (lastOperation == "bin") {
      $("#bin").removeClass("active");
    }
    if (lastOperation == "dec") {
      $("#dec").removeClass("active");
    }
    if (lastOperation == "hex") {
      $("#hex").removeClass("active");
    }
    if (lastOperation == "oct") {
      $("#oct").removeClass("active");
    }
  }
  $("#bin").click(function () {
    if (lastOperation !== "bin") {
      operationCounter++;
      lastOperation = "bin";
      $("#0, #1").addClass("active");
      checkOperationCounter();
    }
    $("#clear").addClass("active");
  });

  $("#dec").click(function () {
    if (lastOperation !== "dec") {
      operationCounter++;
      lastOperation = "dec";
      $("#0, #1, #2, #3, #4, #5, #6, #7, #8, #9").addClass("active");
      checkOperationCounter();
    }
    $("#clear").addClass("active");
  });

  $("#hex").click(function () {
    if (lastOperation !== "hex") {
      operationCounter++;
      lastOperation = "hex";
      $(
        "#0, #1, #2, #3, #4, #5, #6, #7, #8, #9, #A, #B, #C, #D, #E, #F"
      ).addClass("active");
      checkOperationCounter();
    }
    $("#clear").addClass("active");
  });

  $("#oct").click(function () {
    if (lastOperation !== "oct") {
      lastOperation = "oct";
      operationCounter++;
      $("#0, #1, #2, #3, #4, #5, #6, #7").addClass("active");
      checkOperationCounter();
    }
    $("#clear").addClass("active");
  });

  $("#0, #1, #2, #3, #4, #5, #6, #7, #8, #9, #A, #B, #C, #D, #E, #F").click(
    function () {
      checkOperator();
      numberCounter++;
      checkNumberCounter();
    }
  );

  $("#clear").click(function () {
    operationCounter = 0;
    numberCounter = 0;
    lastOperation = "";
    $("td").removeClass("active");
    $("#bin, #dec, #hex, #oct").addClass("active");
  });
  $("#equal").click(function () {
    $("td").removeClass("active");
    $("#clear").addClass("active");
  });
});

/**
 * Converts a given input to a desiered format based on the input format.
 * The input format should follow the pattern: [base][number][outputBase]
 * where base can be 'b' (binary), 'd' (decimal), 'h' (hexadecimal), or 'o' (octal),
 * number is the actual number to be converted, and outputBase is the desired base of the result.
 * 
 * @param {string} input - The input string to be converted.
 * @returns {number} - The converted decimal number, or -1 if the input format is invalid.
 */
function checkInput(input) {
  let result = -1;
  let forCalc = input.substring(1, input.length - 1);
  if (/^([b][0-1]+[doh])$/.test(input)) {
    switch (input.charAt(input.length - 1)) {
      case "d":
        result = bTd(forCalc);
        break;
      case "o":
        result = bTo(forCalc);
        break;
      case "h":
        result = bTh(forCalc);
        break;
    }
  } else if (/^([d][0-9]+[boh])$/.test(input)) {
    switch (input.charAt(input.length - 1)) {
      case "b":
        result = dTb(forCalc);
        break;
      case "o":
        result = dTo(forCalc);
        break;
      case "h":
        result = dTh(forCalc);
        break;
    }
  } else if (/^([h][0-9A-F]+[dob])$/.test(input)) {
    switch (input.charAt(input.length - 1)) {
      case "d":
        result = hTd(forCalc);
        break;
      case "o":
        result = hTo(forCalc);
        break;
      case "b":
        result = hTb(forCalc);
        break;
    }
  } else if (/^([o][0-7]+[dbh])$/.test(input)) {
    switch (input.charAt(input.length - 1)) {
      case "d":
        result = oTd(forCalc);
        break;
      case "b":
        result = oTb(forCalc);
        break;
      case "h":
        result = oTh(forCalc);
        break;
    }
  }

  return result;
}

function bTd(input) {
  let digits = input.split("");
  let result = 0;
  digits.forEach(function (currentValue, index) {
    result += currentValue * Math.pow(2, digits.length - (index + 1));
  });
  return result;
}
function bTh(input) {
  let digits = input.split("");
  let result = "";

  for (let i = digits.length; i > 0; i -= 4) {
    let fourDigits;
    if (i < 4) {
      fourDigits = digits.slice(0, i);
    } else {
      fourDigits = digits.slice(i - 4, i);
    }

    let hexResult = 0;

    fourDigits.forEach(function (currentValue, index) {
      hexResult += currentValue * Math.pow(2, fourDigits.length - (index + 1));
    });

    //Spremeni števke nad 9 v črke
    if (hexResult > 9) {
      let toIncrement = hexResult % 10;
      hexResult = "A";
      hexResult = String.fromCharCode(hexResult.charCodeAt(0) + toIncrement);
    }

    result = hexResult + "" + result;
  }
  return result;
}
function bTo(input) {
  let digits = input.split("");
  let result = "";

  for (let i = digits.length; i > 0; i -= 3) {
    let fourDigits;
    if (i < 4) {
      fourDigits = digits.slice(0, i);
    } else {
      fourDigits = digits.slice(i - 3, i);
    }

    let hexResult = 0;

    fourDigits.forEach(function (currentValue, index) {
      hexResult += currentValue * Math.pow(2, fourDigits.length - (index + 1));
    });

    result = hexResult + "" + result;
  }
  return result;
}
function dTb(input) {
  let result = "";

  if (input == 0) {
    result = "0";
  }

  while (input > 0) {
    result = (input % 2) + "" + result;
    input = ~~(input / 2);
  }

  return result;
}
function dTh(input) {
  let result = "";

  if (input == 0) {
    result = "0";
  }

  while (input > 0) {
    let hexResult = input % 16;
    if (hexResult > 9) {
      let toIncrement = hexResult % 10;
      hexResult = "A";
      hexResult = String.fromCharCode(hexResult.charCodeAt(0) + toIncrement);
    }
    result = hexResult + "" + result;
    input = ~~(input / 16);
  }
  return result;
}
function dTo(input) {
  let result = "";

  if (input == 0) {
    result = "0";
  }

  while (input > 0) {
    result = (input % 8) + "" + result;
    input = ~~(input / 8);
  }

  return result;
}
function hTb(input) {
  let result = "";
  for (const char of input) {
    switch (char) {
      case "0":
        result += "0000";
        break;
      case "1":
        result += "0001";
        break;
      case "2":
        result += "0010";
        break;
      case "3":
        result += "0011";
        break;
      case "4":
        result += "0100";
        break;
      case "5":
        result += "0101";
        break;
      case "6":
        result += "0110";
        break;
      case "7":
        result += "0111";
        break;
      case "8":
        result += "1000";
        break;
      case "9":
        result += "1001";
        break;
      case "A":
        result += "1010";
        break;
      case "B":
        result += "1011";
        break;
      case "C":
        result += "1100";
        break;
      case "D":
        result += "1101";
        break;
      case "E":
        result += "1110";
        break;
      case "F":
        result += "1111";
        break;
    }
  }
  return result;
}
function hTd(input) {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    hexDigit = input.charAt(i);
    if (/^[A-F]$/.test(hexDigit)) {
      hexDigit = hexDigit.charCodeAt(0) - 65 + 10;
    }
    result += hexDigit * Math.pow(16, input.length - (i + 1));
  }

  return result;
}
function hTo(input) {
  return dTo(hTd(input));
}
function oTb(input) {
  let result = "";
  for (const char of input) {
    switch (char) {
      case "0":
        result += "000";
        break;
      case "1":
        result += "001";
        break;
      case "2":
        result += "010";
        break;
      case "3":
        result += "011";
        break;
      case "4":
        result += "100";
        break;
      case "5":
        result += "101";
        break;
      case "6":
        result += "110";
        break;
      case "7":
        result += "111";
        break;
    }
  }
  return result;
}
function oTd(input) {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    octDigit = input.charAt(i);
    result += octDigit * Math.pow(8, input.length - (i + 1));
  }

  return result;
}
function oTh(input) {
  return bTh(oTb(input));
}

/**
 * Displays the converted output based on the input.
 * @param {string} input - The input string to be converted.
 */
function display(input) {
  let output = "";
  for (const char of input) {
    switch (char) {
      case "b":
        output += " BIN ";
        break;
      case "d":
        output += " DEC ";
        break;
      case "h":
        output += " HEX ";
        break;
      case "o":
        output += " OCT ";
        break;
      case "=":
        output += "= ";
        break;
      default:
        output += char;
    }
  }
  $("#display").html(output);
}
/**
 * Handles the selected file and processes its contents.
 * @param {FileList} files - The list of selected files.
 */
function handleFile(files) {
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    var lines = contents.split("\n");
    var transformedLines = lines.map(function (line) {
      return line
        .replace(/BIN/g, "b")
        .replace(/OCT/g, "o")
        .replace(/HEX/g, "h")
        .replace(/DEC/g, "d")
        .replace(/\s/g, "")
        .replace(/=$/, "");
    });
    console.log(transformedLines);
    $("#text-results").append(
      lines
        .map(function (line) {
          var result = checkInput(transformedLines[lines.indexOf(line)]);
          return "<p>" + line + " = " + result + "</p>";
        })
        .join("")
    );
  };
  reader.readAsText(file);
}
