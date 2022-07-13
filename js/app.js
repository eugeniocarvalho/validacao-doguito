import { valida } from './validacao.js'

const inputs = document.querySelectorAll('input');
const args = {
  prefix: 'R$ ',
  fixed: true,
  fractionDigits: 2,
  decimalSeparator: ',',
  thousandsSeparator: '.',
  cursor: 'end'
};

inputs.forEach(input => {
  if (input.dataset.tipo === 'preco')
    SimpleMaskMoney.setMask(input, args);

  input.addEventListener('blur', (event) => {
    valida(event.target);
  });
})