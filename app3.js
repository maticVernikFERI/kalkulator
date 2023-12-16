let savedVareables = [];
let input = '';
let result = 0;

$(document).ready(function () {

    $("td").click(newInput);
});

function newInput() {
    let vnos = this.id; //Trenutni vnos

    if (vnos == 'new') {
        console.log($("#display").html());
        if (/^[01]+$/.test($("#display").html())) {
            newVareable();
            input = '';
        } else {
            window.alert("Error");
        }
    } else if (vnos == 'del') {
        input = input.slice(0, -1);
    } else if (this.id == 'clear') {
        input = '';
        savedVareables = [];
    } else {
        input += vnos;
    }
    display(input);
}

function addVareable() {
    let index = $(this).attr('id').substring(1);
    console.log(savedVareables[index]);
}

function newVareable() {
    let name = String.fromCharCode(65 + savedVareables.length);
    let cell = document.createElement("td");
    let input = $("#display").html();
    let digits = '';
    for (const char of input) {
        digits += char;
    }
    $(cell).attr('id', ('v' + savedVareables.length));
    savedVareables.push(digits);

    $(cell).html(name).click(addVareable);
    $("#vareables").append(cell);
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
                if(/^[01]$/.test(char)){

                }
                output += char;
        }
    };
    $("#display").html(output);
}