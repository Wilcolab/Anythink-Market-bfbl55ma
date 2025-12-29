'use strict';

exports.calculate = function(req, res) {
  try {

  // TODO: Add operator
  var operations = {
    'add':      function(a, b) { return Number(a) + Number(b) },
    'subtract': function(a, b) { return a - b },
    'multiply': function(a, b) { return a * b },
    'power':    function(a, b) { return Math.pow(a, b) },
    'divide':   function(a, b) { return a / b },
    'sqrt':     function(a) { return Math.sqrt(a) },
    'pow2':     function(a) { return a * a },
    'pow3':     function(a) { return a * a * a }
  };

  var unaryOps = ['sqrt', 'pow2', 'pow3'];

  if (!req.query.operation) {
    throw new Error("Unspecified operation");
  }

  var operation = operations[req.query.operation];

  if (!operation) {
    throw new Error("Invalid operation: " + req.query.operation);
  }

  if (req.query.operation === 'power' && Number(req.query.operand1) === 0 && Number(req.query.operand2) === 0) {
    throw new Error("Cannot raise zero to zero");
  }

  if (!req.query.operand1 ||
      !req.query.operand1.match(/^(-)?[0-9\.]+(e(-)?[0-9]+)?$/) ||
      req.query.operand1.replace(/[-0-9e]/g, '').length > 1) {
    throw new Error("Invalid operand1: " + req.query.operand1);
  }

  var result;
  if (unaryOps.includes(req.query.operation)) {
    if (req.query.operand2) {
      throw new Error("Unary operation does not accept operand2");
    }
    result = operation(req.query.operand1);
  } else {
    if (!req.query.operand2 ||
        !req.query.operand2.match(/^(-)?[0-9\.]+(e(-)?[0-9]+)?$/) ||
        req.query.operand2.replace(/[-0-9e]/g, '').length > 1) {
      throw new Error("Invalid operand2: " + req.query.operand2);
    }
    result = operation(req.query.operand1, req.query.operand2);
  }

  res.json({ result: parseFloat(result.toFixed(6)) });
  } catch (err) {
    res.status(400).json({error: err.message});
  }
};
