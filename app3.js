let savedVariables = [];
let input = '';
let toCalk = '';
let result = 0;

$(document).ready(function () {
    $("td[id!='display']").click(newInput);
});

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
        input = input.slice(0, -1);
    } else if (this.id == 'clear') {
        input = '';
        toCalk = '';
        $(".var").remove();
        savedVariables = [];
    } else if (vnos == '=') {
        correctEq = checkInput();
        if (!correctEq) {
            window.alert('Narobe napisana enačba');
        } else {
            makeToCalk();
            result = calculate(toCalk);
            input += '=' + result;
        }
    } else {
        input += vnos;
    }
    display(input);
}

function makeToCalk() {
    for (const char of input) {
        if (/^[A-Z]$/.test(char)) {
            toCalk += savedVariables[char.charCodeAt(0) - 65];
        } else {
            toCalk += char;
        }
    }
}

function calculate(equation) {
    if (equation.includes('(')) {
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

    for (const x of equation) {
        if (x == 'a') {
            equation = equation.replace(/[01]+a[01]+/, and(equation.match(/[01]+a[01]+/)));
        }
        if (x == 'o') {
            equation = equation.replace(/[01]+o[01]+/, or(equation.match(/[01]+o[01]+/)));
        }
    }

    return equation;
}

function or(equation) {
    let poz = equation[0].indexOf('o');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length > dig2.length) {
        dig2 = '0' + dig2;
    }
    while (dig1.length < dig2.length) {
        dig1 = '0' + dig1;
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

function and(equation) {
    let poz = equation[0].indexOf('a');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length > dig2.length) {
        dig2 = '0' + dig2;
    }
    while (dig1.length < dig2.length) {
        dig1 = '0' + dig1;
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

//!Dodaj preverjanje izraza
function checkInput() {
    if (/^[01]+$/.test(input)) {
    }

    return true;
}

function addVariable() {
    input += $(this).text();
    display(input);
}

function newVariable() {
    let name = String.fromCharCode(65 + savedVariables.length);
    let cell = document.createElement("td");
    let input = $("#display").html();
    let digits = '';
    for (const char of input) {
        digits += char;
    }
    $(cell).attr('id', name);
    savedVariables.push(digits);

    $(cell).html(name).click(addVariable).addClass('var');
    $("#variables").append(cell);
}

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
                output += '= ';
                break;
            default:
                if (/^[01]$/.test(char)) {

                }
                output += char;
        }
    };
    $("#display").html(output);
}