'use strict';

var value = 0;

var states = {
    "start": 0,
    "operand1": 1,
    "operator": 2,
    "operand2": 3,
    "complete": 4
};

var state = states.start;

var operand1 = 0;
var operand2 = 0;
var operation = null;

function calculate(operand1, operand2, operation) {
    var uri = location.origin + "/arithmetic";

    // TODO: Add operator
    switch (operation) {
        case '+':
            uri += "?operation=add";
            break;
        case '-':
            uri += "?operation=subtract";
            break;
        case '*':
            uri += "?operation=multiply";
            break;
        case '/':
            uri += "?operation=divide";
            break;
        // New Feature Exponentiation (^)
        case '^':
            uri += "?operation=power";
            break;  // map ^ to 'power'
        default:
            setError();
            return;
    }

    uri += "&operand1=" + encodeURIComponent(operand1);
    uri += "&operand2=" + encodeURIComponent(operand2);

    setLoading(true);

    var http = new XMLHttpRequest();
    http.open("GET", uri, true);
    http.onload = function () {
        setLoading(false);

        if (http.status == 200) {
            var response = JSON.parse(http.responseText);
            setValue(response.result);
        } else {
            setError();
        }
    };
    http.send(null);
}

function clearPressed() {
    setValue(0);

    operand1 = 0;
    operand2 = 0;
    operation = null;
    state = states.start;
}

function clearEntryPressed() {
    setValue(0);
    state = (state == states.operand2) ? states.operator : states.start;
}

function numberPressed(n) {
    var value = getValue();

    if (state == states.start || state == states.complete) {
        value = n;
        state = (n == '0' ? states.start : states.operand1);
    } else if (state == states.operator) {
        value = n;
        state = (n == '0' ? states.operator : states.operand2);
    } else if (value.replace(/[-\.]/g, '').length < 8) {
        value += n;
    }

    value += "";

    setValue(value);
}

function decimalPressed() {
    if (state == states.start || state == states.complete) {
        setValue('0.');
        state = states.operand1;
    } else if (state == states.operator) {
        setValue('0.');
        state = states.operand2;
    } else if (!getValue().toString().includes('.')) {
        setValue(getValue() + '.');
    }
}

function signPressed() {
    var value = getValue();

    if (value != 0) {
        setValue(-1 * value);
    }
}

function operationPressed(op) {
    operand1 = Number(getValue());
    operation = op;
    state = states.operator;
}

function equalPressed() {
    if (state < states.operand2) {
        state = states.complete;
        return;
    }

    if (state == states.operand2) {
        operand2 = getValue();
        state = states.complete;
    } else if (state == states.complete) {
        operand1 = getValue();
    }

    calculate(operand1, operand2, operation);
}

// TODO: Add key press logics
document.addEventListener('keydown', (event) => {
    if (/^\d$/.test(event.key)) {
        numberPressed(event.key);
    } else if (event.key == '.') {
        decimalPressed();
    } else if ('+-*/^'.includes(event.key)) {
        operationPressed(event.key);
    } else if (event.key === '=' || event.key === 'Enter') {
        equalPressed();
    }
});

    document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("btnPower").addEventListener("click", () => operationPressed('^'));
    document.getElementById("btnEquals").addEventListener("click", equalPressed);

    document.getElementById("btnClear").addEventListener("click", clearPressed);
    document.getElementById("btnClearEntry").addEventListener("click", clearEntryPressed);

    document.getElementById("btnZero").addEventListener("click", () => numberPressed(0));
    document.getElementById("btnOne").addEventListener("click", () => numberPressed(1));
    document.getElementById("btnTwo").addEventListener("click", () => numberPressed(2));
    document.getElementById("btnThree").addEventListener("click", () => numberPressed(3));
    document.getElementById("btnFour").addEventListener("click", () => numberPressed(4));
    document.getElementById("btnFive").addEventListener("click", () => numberPressed(5));
    document.getElementById("btnSix").addEventListener("click", () => numberPressed(6));
    document.getElementById("btnSeven").addEventListener("click", () => numberPressed(7));
    document.getElementById("btnEight").addEventListener("click", () => numberPressed(8));
    document.getElementById("btnNine").addEventListener("click", () => numberPressed(9));

    document.getElementById("btnDecimal").addEventListener("click", decimalPressed);
    document.getElementById("btnPlus").addEventListener("click", () => operationPressed('+'));
    document.getElementById("btnMinus").addEventListener("click", () => operationPressed('-'));
    document.getElementById("btnMultiply").addEventListener("click", () => operationPressed('*'));
    document.getElementById("btnDivide").addEventListener("click", () => operationPressed('/'));
});


function getValue() {
    return value;
}

function setValue(n) {
    value = n;
    var displayValue = value;

    if (displayValue > 99999999) {
        displayValue = displayValue.toExponential(4);
    } else if (displayValue < -99999999) {
        displayValue = displayValue.toExponential(4);
    } else if (displayValue > 0 && displayValue < 0.0000001) {
        displayValue = displayValue.toExponential(4);
    } else if (displayValue < 0 && displayValue > -0.0000001) {
        displayValue = displayValue.toExponential(3);
    }

    var chars = displayValue.toString().split("");
    var html = "";

    for (var c of chars) {
        if (c == '-') {
            html += "<span class=\"resultchar negative\">" + c + "</span>";
        } else if (c == '.') {
            html += "<span class=\"resultchar decimal\">" + c + "</span>";
        } else if (c == 'e') {
            html += "<span class=\"resultchar exponent\">e</span>";
        } else if (c != '+') {
            html += "<span class=\"resultchar digit" + c + "\">" + c + "</span>";
        }
    }

    document.getElementById("result").innerHTML = html;
}

function setError(n) {
    document.getElementById("result").innerHTML = "ERROR";
}

function setLoading(loading) {
    if (loading) {
        document.getElementById("loading").style.visibility = "visible";
    } else {
        document.getElementById("loading").style.visibility = "hidden";
    }

    var buttons = document.querySelectorAll("BUTTON");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = loading;
    }
}
