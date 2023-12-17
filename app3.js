let savedVariables = [];
let input = '';
let toCalk = '';
let result = 0;
let longest = 0;

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
        savedVariables = [];
        for(let i = 0; i < 10; i++) {
            let id = '#s' + i;
            $(id).html('');
        }
    } else if (this.id == 'clear') {
        input = '';
        toCalk = '';
    } else if (vnos == '=') {
        correctEq = checkInput();
        if (!correctEq) {
            window.alert('Narobe napisana enačba');
        } else {
            toCalk = '';
            makeToCalk();
            result = calculate(toCalk);
            input += '=' + result;
        }
    } else if(/s[0-9]/.test(vnos)){

    } else {
        input += vnos;
    }
    display(input);
}


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
    for(const num of nums) {
        if(num.length > longest) {
            longest = num.length;
        }
    }
}

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
        }else if (equation.charAt(i) == 'o') {
            equation = equation.replace(/[01]+o[01]+/, or(equation.match(/[01]+o[01]+/)));
            i = 0;
        }else if (equation.charAt(i) == 'e') {
            equation = equation.replace(/[01]+e[01]+/, nand(equation.match(/[01]+e[01]+/)));
            i = 0;
        }else if (equation.charAt(i) == 'u') {
            equation = equation.replace(/[01]+u[01]+/, nor(equation.match(/[01]+u[01]+/)));
            i = 0;
        }else if (equation.charAt(i) == 'x') {
            equation = equation.replace(/[01]+x[01]+/, xor(equation.match(/[01]+x[01]+/)));
            i = 0;
        }else if (equation.charAt(i) == 'z') {
            equation = equation.replace(/[01]+z[01]+/, xnor(equation.match(/[01]+z[01]+/)));
            i = 0;
        }
        i++;
    }

    return equation;
}

function xnor(equation) {
    let poz = equation[0].indexOf('z');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
    let result = '';

    while (dig1.length < longest) {
        dig1 = '0' + dig1;
    }
    while (dig2.length < longest) {
        dig2 = '0' + dig2;
    }

    for (let i = 0; i < dig1.length; i++) {
        if (dig1.charAt(i) + dig2.charAt(i) % 2 == 0) {
            result += '1';
        } else {
            result += '0';
        }
    }

    return result;
}

function xor(equation) {
    let poz = equation[0].indexOf('x');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
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

function nor(equation) {
    let poz = equation[0].indexOf('u');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
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

function nand(equation) {
    let poz = equation[0].indexOf('e');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
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

function or(equation) {
    let poz = equation[0].indexOf('o');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
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

function and(equation) {
    let poz = equation[0].indexOf('a');
    let dig1 = equation[0].substr(0, poz);
    let dig2 = equation[0].substr(poz + 1, equation[0].length);
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

//TODO Dodaj preverjanje izraza
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
    let id = '#s' + savedVariables.length;
    let input = $("#display").html();
    let digits = '';
    for (const char of input) {
        digits += char;
    }
    savedVariables.push(digits);

    $(id).html(name).click(addVariable).addClass('var');
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