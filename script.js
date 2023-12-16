function isDigit(char) {
    return !isNaN(parseFloat(char)) && isFinite(char);  
  }
  
  function hasLowerPrecedence(target, source) {
    const other = source[source.length-1];
    if (target == "*" && other == "/")
      return true;
    else if (
       (target == '+' || target == '-') &&
       (other  == '*' || other  == '/')
    )
      return true;
    else
      return false;
  }
  
  function postfixNotation(expression) {
    const valueQueue = [];
    const oprtrStack = [];
    let index        = 0;
  
    while (index < expression.length) {
      const current = expression[index];
      if (current == '.') {
        let temp = ".";
        index++;
        while (isDigit(expression[index])) {
          temp += expression[index++];
        }
        index--;
        valueQueue[valueQueue.length-1] += temp;
      } else if (isDigit(current)) {
        valueQueue.push(current);
      } else if (current == '(')  {
        oprtrStack.push(current);
      } else if (current == ')') {
        let elm = oprtrStack.pop();
        while (oprtrStack.length > 0 && elm != '(') {
          valueQueue.push(elm);
          elm = oprtrStack.pop();
        }
      } else {
        while (
          oprtrStack.length > 0 && 
          hasLowerPrecedence(current, oprtrStack)
        ) {
          valueQueue.push(oprtrStack.pop());
        }
        oprtrStack.push(current);
      }
      index++;
    }
  
    while (oprtrStack.length > 0) {
      valueQueue.push(oprtrStack.pop())
    }
  
    return valueQueue;
  }
  
  function solvePostfixExpression(data) {
    const stack = [];
    let index   = 0;
    let result  = 0;
  
    while (index < data.length) {
      if (isDigit(data[index])) {
        stack.push(Number(data[index]));
      }
      else {
        const opr1 = stack.pop();
        const opr2 = stack.pop();
        switch(data[index]) {
          case '+':
            result = opr2 + opr1;
            break;
          case '-':
            result = opr2 - opr1;
            break;
          case '*':
            result = opr2 * opr1;
            break;
          case '/':
            result = opr2 / opr1;
            break;
        }
        stack.push(result);
      }
      index++;
    }
    return String(stack.join(''));
  }
  
  function calculate(expression) {
    let expr = expression.replace(/ /g, "").split(/([+\-*/()])/g).filter(Boolean);
    if (["/", "*", "+", "-"].includes(expr[0])) {
      let val = expr[0];
      expr.shift();
      expr[0] = val + expr[0];
    }
    return solvePostfixExpression(postfixNotation(expr));
}

function isValidInput(expr) {
  const symbols = "+-/*"
  for (let i = 1; i < expr.length; i++) {
    if (symbols.includes(expr[i-1]) && symbols.includes(expr[i]))
      return false;
    else if(expr[i-1] == '.' && symbols.includes(expr[i]))
      return false
  }
  return true;
}

let textField = document.getElementById('input-field');
document.querySelector('main').addEventListener('click', (e) => {
    let text = e.target.textContent;

    if (text.toLowerCase() == 'c')
        textField.value = '';
    else if (text.toLowerCase() == 'x')
        textField.value = textField.value.slice(0, -1);
    else if (text == '=') {
        if (isValidInput(textField.value))
          textField.value = calculate(textField.value);
        else {
          textField.value = "INVALID";
        }
    } else {
        new Audio("./assets/clicksound.wav").play();
        if (textField.value == "INVALID")
          textField.value = "";
        textField.value += text;
    }
})

window.onload = () => {
  alert(
    `
    This calculator doesnt use eval function rather uses custom algorithm for calculation.
    So if you encounter some error please inform me.
    `
  )
}