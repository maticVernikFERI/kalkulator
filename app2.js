$(document).ready(function () {
    let input = ''; //Za celotni vnos
    $("td").click(function () {
        let vnos = this.innerHTML; //Trenutni vnos
        if (this.id == 'clear') {
            input = '';
        } else if (this.id == 'del'){
            input = input.slice(0, -1);
        }else{
            input += vnos;
        }
        $("#display").html(input);
    });
});