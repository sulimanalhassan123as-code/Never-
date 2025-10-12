// script.js - SmartCalc (safe expression evaluation, history, keyboard support)
const displayExpression = document.getElementById('expression');
const displayResult = document.getElementById('result');
const keys = document.querySelectorAll('.btn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const downloadHistory = document.getElementById('downloadHistory');

let expression = '';
let lastResult = null;
let history = JSON.parse(localStorage.getItem('calc_history')||'[]');

function render() {
  displayExpression.textContent = expression || '';
  displayResult.textContent = (lastResult===null) ? '0' : String(lastResult);
  renderHistory();
}

function safeEval(expr) {
  // Allow only digits, operators, parentheses, decimal and spaces
  if (!/^[0-9+\-*/(). %]+$/.test(expr)) throw new Error('Invalid characters');
  // Replace unicode multiplication/division symbols if present
  expr = expr.replace(/×/g,'*').replace(/÷/g,'/');
  // Prevent sequences like "**", "//" or leading zeros abuse
  if (/\*\*|\/\/|\^/.test(expr)) throw new Error('Invalid operator sequence');
  // Evaluate using Function in a restricted manner
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; return (' + expr + ')')();
}

function pushHistory(item) {
  history.unshift(item);
  if (history.length>100) history.pop();
  localStorage.setItem('calc_history', JSON.stringify(history));
}

function renderHistory(){
  historyList.innerHTML = '';
  history.forEach(h=>{
    const li = document.createElement('li');
    li.textContent = h;
    historyList.appendChild(li);
  });
  // update download link
  downloadHistory.href = 'data:text/plain;charset=utf-8,'+encodeURIComponent(history.join('\n'));
}

keys.forEach(k=>{
  k.addEventListener('click', ()=>{
    const v = k.dataset.value;
    const action = k.dataset.action;
    if (action === 'clear') {
      expression=''; lastResult=null; render();
      return;
    }
    if (action === 'toggle-sign') {
      if (!expression) { expression = '-'; render(); return; }
      // try to toggle sign of last number
      expression = expression.replace(/(\d+\.?\d*)$/,'( -$1 )');
      render(); return;
    }
    if (action === 'percent') {
      try{
        const res = safeEval(expression + '/100');
        lastResult = res;
        pushHistory(expression + ' % -> ' + res);
        expression = String(res);
      }catch(e){ lastResult='Err' }
      render(); return;
    }
    if (action === 'calculate') {
      try{
        const res = safeEval(expression||'0');
        lastResult = Number.isFinite(res)? res : 'Err';
        pushHistory(expression + ' = ' + lastResult);
        expression = String(lastResult);
      }catch(e){
        lastResult='Err';
      }
      render(); return;
    }
    // numeric or operator input
    if (v) {
      // prevent two operators in a row
      if (/^[+\-*/]$/.test(v) && /^[+\-*/]$/.test(expression.slice(-1))) return;
      expression += v;
      render();
    }
  });
});

// keyboard support
window.addEventListener('keydown', (e)=>{
  const key = e.key;
  if ((/\d/).test(key) || key === '.' ) {
    expression += key; render(); return;
  }
  if (key === 'Enter') { e.preventDefault(); document.querySelector('[data-action="calculate"]').click(); return; }
  if (key === 'Backspace') { expression = expression.slice(0,-1); render(); return; }
  if (['+','-','*','/','(',')','%'].includes(key)) { expression += key; render(); return; }
});

// history controls
clearHistoryBtn.addEventListener('click', ()=>{
  history = [];
  localStorage.removeItem('calc_history');
  renderHistory();
});

// initial render
render();
