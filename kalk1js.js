$(document).ready(function () {
    input = "";
    $("td").click(function () {
        vnos = this.innerHTML;
        if (vnos == "Del") {
            input = "";
            $("#display").html(input);
        } else if (vnos == "pow" || vnos == "sqrt") {

        } else {
            input += this.innerHTML + " ";
            $("#display").html(input);
        }
    });
});