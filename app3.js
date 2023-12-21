let savedVariables = [];
let input = '';
let toCalk = '';
let result = 0;
let longest = 0;

$(document).ready(function () {
    $("td[id!='display']").click(newInput);
    $("#clear").addClass("active");
    $(".num, .b ,#n").addClass("active");
    var counter = 0;
    var operator = 0;
    var varCount = 0;
    var state = "num";
    isOp = false;

    $("#clear").click(() => {
        $(".op, #equal").removeClass("active");
        $("#clear").addClass("active");
        $("#new").removeClass("active");
        counter = 0;
        operator = 0;
        state = "num";
        checkState();
    });
    $(".num,.var").click(() => {
        counter++;
        isOp = false;
        state = "numO";
        checkState();
    });
    $("#new").click(() => {
        varCount++;
        state = "num";
        counter = 0;
        checkState();
    });
    $("#del").click(() => {
        $(".var").html("");
        varCount = 0;
        state = "num";
        checkState();
        $("#del").removeClass("active");
    });
    $(".op").click(() => {
        operator++;
        isOp = true;
        state = "num";
        checkState();
    });
    $("#n").click(() => {
        state = "neg";
        operator++;
        isOp = true;
        checkState();
    });
    $("#equal").click(() => {
        state = "equal";
        checkState();
    });
    function checkState() {
        if (state === "num") {
            $("td").removeClass("active");
            $(".num,.b,#clear,#new,#n").addClass("active");
            if (varCount > 0) {
                $("#del").addClass("active");
            }
        }
        if (state == "neg") {
            $("td").removeClass("active");
            $(".num,.b,#clear").addClass("active");
        }
        if (state === "numO") {
            $(".op, #equal, #n").addClass("active");
        }
        if (state === "del") {
            $("td").removeClass("active");
        }
        $(".var").each(function () {
            if ($(this).text() != "") {
                $(this).addClass("active");
            }
        });
        if (varCount > 0) {
            $("#del").addClass("active");
        }
        if (operator > 0 && counter > 0) {
            $("#equal").addClass("active");
        }
        if (operator === 0 && counter >= 1) {
            $("#new").addClass("active");
        } else {
            $("#new").removeClass("active");
        }
        if (state == "equal") {
            $("td").removeClass("active");
            $("#clear").addClass("active");
        }
        if (!isOp && counter > 0) {
            $("#equal").addClass("active");
        } else {
            $("#equal").removeClass("active");
        }
    }
});

/**
 * Handles the input logic for the calculator.
 */
function newInput() {
    let vnos = this.id; //Trenutni vnos

    if (vnos == 'new') {
        if (/^[01]+$/.test($("#display").html())) {
            newVariable();
            input = '';
        } else {
            window.alert("Error");
        }
    } else if (vnos == 'del') {
        savedVariables = [];
        for (let i = 0; i < 10; i++) {
            let id = '#s' + i;
            $(id).html('');
        }
    } else if (this.id == 'clear') {
        input = '';
        toCalk = '';
    } else if (vnos == 'equal') {
        correctEq = checkInput();
        if (!correctEq) {
            window.alert('Narobe napisana enačba');
        } else {
            toCalk = '';
            makeToCalk();
            result = calculate(toCalk);
            input += '=' + result;
        }
    } else if (/s[0-9]/.test(vnos)) {

    } else {
        input += vnos;
    }
    display(input);
}


/**
 * Converts the input string to a that is going to be calculated.
 */
function makeToCalk() {
    longest = 0;
    for (const char of input) {
        if (/^[A-Z]$/.test(char)) {
            toCalk += savedVariables[char.charCodeAt(0) - 65];
        } else {
            toCalk += char;
        }
    }

    let nums = toCalk.match(/[01]+/g);
    for (const num of nums) {
        if (num.length > longest) {
            longest = num.length;
        }
    }
}

/**
 * Calculates the result of a logical equation.
 * 
 * @param {string} equation - The logical equation to be evaluated.
 * @returns {string} - The result of the equation.
 */
function calculate(equation) {
    while (equation.includes('(')) {
        let start = equation.indexOf('(');
        let end = 0;
        let count = 0;
        for (let i = start; i < equation.length; i++) {
            if (equation.charAt(i) == '(') {
                count++;
            } else if (equation.charAt(i) == ')') {
                count--;
            }

            if (equation.charAt(i) == ')' && count == 0) {
                end = i;
                break;
            }
        }
        equation = equation.replace(equation.substring(start, end + 1), calculate(equation.substring(start + 1, end)));
    }

    if (equation.includes('n')) {
        equation = equation.replace(/n[01]+/, not(equation.match(/n[01]+/)));
    }

    let i = 0;
    while (i < equation.length) {
        if (equation.charAt(i) == 'a') {
            equation = equation.replace(/[01]+a[01]+/, and(equation.match(/[01]+a[01]+/)));
            i = 0;
        } else if (equation.charAt(i) == 'o') {
            equation = equation.replace(/[01]+o[01]+/, or(equation.match(/[01]+o[01]+/)));
            i = 0;
        } else if (equation.charAt(i) == 'e') {
            equation = equation.replace(/[01]+e[01]+/, nand(equation.match(/[01]+e[01]+/)));
            i = 0;
        } else if (equation.charAt(i) == 'u') {
            equation = equation.replace(/[01]+u[01]+/, nor(equation.match(/[01]+u[01]+/)));
            i = 0;
        } else if (equation.charAt(i) == 'x') {
            equation = equation.replace(/[01]+x[01]+/, xor(equation.match(/[01]+x[01]+/)));
            i = 0;
        } else if (equation.charAt(i) == 'z') {
            equation = equation.replace(/[01]+z[01]+/, xnor(equation.match(/[01]+z[01]+/)));
            i = 0;
        }
        i++;
    }

    return equation;
}

/**
 * Performs XNOR operation on the given equation.
 * @param {string[]} equation - The equation to perform XNOR operation on.
 * @returns {string} - The result of the XNOR operation.
 */
function xnor(equation) {
    let poz = equation[0].indexOf('z');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        x = parseInt(dig1.charAt(i)) + parseInt(dig2.charAt(i));
        if (x % 2 == 0) {
            result += '1';
        } else {
            result += '0';
        }
    }

    return result;
}

/**
 * Performs an XOR operation on the given equation.
 * 
 * @param {string[]} equation - The equation to perform XOR operation on.
 * @returns {string} - The result of the XOR operation.
 */
function xor(equation) {
    let poz = equation[0].indexOf('x');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }


    for (let i = 0; i < dig1.length; i++) {
        let x = parseInt(dig1.charAt(i)) + parseInt(dig2.charAt(i));
        if (x % 2 == 0) {
            result += '0';
        } else {
            result += '1';
        }
    }

    return result;
}

/**
 * Performs a bitwise NOR operation on two binary numbers.
 * @param {string[]} equation - An array containing a single string representing the binary numbers to perform the NOR operation on.
 * @returns {string} - The result of the NOR operation as a binary string.
 */
function nor(equation) {
    let poz = equation[0].indexOf('u');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        if (dig1.charAt(i) == '1' || dig2.charAt(i) == '1') {
            result += '0';
        } else {
            result += '1';
        }
    }

    return result;
}

/**
 * Performs a NAND operation on the given equation.
 * @param {string[]} equation - The equation to perform the NAND operation on.
 * @returns {string} - The result of the NAND operation.
 */
function nand(equation) {
    let poz = equation[0].indexOf('e');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        if (dig1.charAt(i) == '1' && dig2.charAt(i) == '1') {
            result += '0';
        } else {
            result += '1';
        }
    }

    return result;
}

/**
 * Performs a logical OR operation on the given equation.
 * @param {string[]} equation - The equation to perform the operation on.
 * @returns {string} - The result of the logical OR operation.
 */
function or(equation) {
    let poz = equation[0].indexOf('o');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        if (dig1.charAt(i) == '1' || dig2.charAt(i) == '1') {
            result += '1';
        } else {
            result += '0';
        }
    }

    return result;
}

/**
 * Performs bitwise AND operation on two binary numbers.
 * @param {string[]} equation - An array containing a single string representing the binary numbers to be ANDed.
 * @returns {string} - The result of the bitwise AND operation as a binary string.
 */
function and(equation) {
    let poz = equation[0].indexOf('a');
    let dig1 = equation[0].substring(0, poz);
    let dig2 = equation[0].substring(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        if (dig1.charAt(i) == '1' && dig2.charAt(i) == '1') {
            result += '1';
        } else {
            result += '0';
        }
    }

    return result;
}

/**
 * Performs a bitwise NOT operation on the given equation.
 * @param {string[]} equation - The equation to perform the operation on.
 * @returns {string} - The result of the bitwise NOT operation.
 */
function not(equation) {
    let digits = equation[0].substring(1);
    let result = '';
    for (const digit of digits) {
        if (digit == '1') {
            result += '0';
        } else {
            result += '1';
        }
    }
    return result;
}


/**
 * Checks the validity of the input.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function checkInput() {
    if (/[01]+n[01]+/.test(input)) {
        return false;
    } else if (/[01]+\(/.test(input)) {
        return false;
    } else if (/\)[01]+/.test(input)) {
        return false;
    } else if (input.split('(').length - 1 != input.split(')').length - 1) {
        return false;
    }

    return true;
}

/**
 * Adds the name of the clicked element to the input variable and displays it.
 */
function addVariable() {
    input += $(this).text();
    display(input);
}

/**
 * Creates a new variable.
 */
function newVariable() {
    let name = String.fromCharCode(65 + savedVariables.length);
    let id = '#s' + savedVariables.length;
    let input = $("#display").html();
    let digits = '';
    for (const char of input) {
        digits += char;
    }
    savedVariables.push(digits);

    $(id).html(name).click(addVariable).addClass('var');
}

/**
 * Displays the converted output based on the input.
 * @param {string} input - The input string to be converted.
 */
function display(input) {
    let output = '';
    for (const char of input) {
        switch (char) {
            case 'n':
                output += ' NEG ';
                break;
            case 'a':
                output += ' AND ';
                break;
            case 'o':
                output += ' OR ';
                break;
            case 'e':
                output += ' NAND ';
                break;
            case 'u':
                output += ' NOR ';
                break;
            case 'x':
                output += ' XOR ';
                break;
            case 'z':
                output += ' XNOR ';
                break;
            case '=':
                output += ' = ';
                break;
            default:
                if (/^[01]$/.test(char)) {

                }
                output += char;
        }
    };
    $("#display").html(output);
}

function handleFile(files) {
    $("#display").html("");
    input = "";
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        var lines = contents.split("\n");
        var transformedLines = lines.map(function (line) {
            return line
                .replace(/NEG/g, "n")
                .replace(/NAND/g, "e")
                .replace(/XOR/g, "x")
                .replace(/XNOR/g, "z")
                .replace(/NOR/g, "u")
                .replace(/AND/g, "a")
                .replace(/OR/g, "o")
                .replace(/\s/g, "")
                .replace(/=$/, "");
        });
        console.log(transformedLines);
        $("#text-results").append(
            lines
                .map(function (line) {
                    toCalk = transformedLines[lines.indexOf(line)];
                    makeToCalk();
                    let result = calculate(toCalk);
                    return "<p>" + line + " = " + result + "</p>";
                })
                .join("")
        );
    };
    reader.readAsText(file);
}