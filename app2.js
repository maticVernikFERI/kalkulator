$(document).ready(function () {
    let input = ''; //Za celotni vnos
    let result = 0;
    $("td").click(function () {
        let vnos = this.innerHTML; //Trenutni vnos

        if (/^([bdoh][0-9A-Z]+[bdoh]=[0-9A-Z])$/.test(input)){
            input = '';
        }

        if (this.id == 'clear') {
            input = '';
        } else if (this.id == 'del') {
            input = input.slice(0, -1);
        } else if (vnos == 'BIN' || vnos == 'DEC' || vnos == 'HEX' || vnos == 'OCT') {
            input += vnos.toLowerCase().charAt(0);
        } else if (vnos == '=') {
            result = checkInput(input);
            if (result == 0) {
                window.alert('Narobe napisana enačba');
            } else {
                input += '=' + result;
                console.log('ok');
            }
        } else {
            input += vnos;
        }
        display(input);

    });
});

function checkInput(input) {
    let result = 0;
    let forCalc = input.substr(1, input.length - 2);
    if (/^([b][0-1]+[doh])$/.test(input)) {
        switch (input.charAt(input.length - 1)) {
            case 'd':
                result = bTd(forCalc);
                break;
            case 'o':
                result = bTo(forCalc);
                break;
            case 'h':
                result = bTh(forCalc);
                break;
        }
    } else if (/^([d][0-9]+[boh])$/.test(input)) {
        switch (input.charAt(input.length - 1)) {
            case 'b':
                result = dTb(forCalc);
                break;
            case 'o':
                result = dTo(forCalc);
                break;
            case 'h':
                result = dTh(forCalc);
                break;
        }
    } else if (/^([h][0-9A-F]+[dob])$/.test(input)) {
        switch (input.charAt(input.length - 1)) {
            case 'd':
                result = hTd(forCalc);
                break;
            case 'o':
                result = hTo(forCalc);
                break;
            case 'b':
                result = hTb(forCalc);
                break;
        }
    } else if (/^([o][0-7]+[dbh])$/.test(input)) {
        switch (input.charAt(input.length - 1)) {
            case 'd':
                result = oTd(forCalc);
                break;
            case 'b':
                result = oTb(forCalc);
                break;
            case 'h':
                result = oTh(forCalc);
                break;
        }
    }

    return result;
}

function bTd(input) {
    let digits = input.split('');
    console.log(digits);

    return 1;
}
function bTh(input) { }
function bTo(input) { }
function dTb(input) { }
function dTh(input) { }
function dTo(input) { }
function hTb(input) { }
function hTd(input) { }
function hTo(input) { }
function oTb(input) { }
function oTd(input) { }
function oTh(input) { }


function display(input) {
    let output = '';
    for (const char of input) {
        switch (char) {
            case 'b':
                output += ' BIN ';
                break;
            case 'd':
                output += ' DEC ';
                break;
            case 'h':
                output += ' HEX ';
                break;
            case 'o':
                output += ' OCT ';
                break;
            case '=':
                output += '= ';
                break;
            default:
                output += char;
        }
    };
    $("#display").html(output);
}