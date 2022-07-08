const validadores = {
  dataNascimento:input => validaDataNascimento(input)
};

const mensagensDeErro = {
  nome: {
    valueMissing: 'O campo nome está vazio'
  },
  email: {
    valueMissing: 'O campo email está vazio',
    typeMismatch: 'Email inválido'
  },
  senha: {
    valueMissing: 'O campo senha está vazio',
    patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, pelo menos uma letra maiúscula, um número e sem símbolos'
  },
  dataNascimento: {
    valueMissing: 'O campo data está vazio',
    customError: 'Idade deve ser maior de 18 anos.'
  }
}

const tiposDeErro = ['valueMissing', 'typeMismatch', 'patternMismatch', 'customError'];

export function valida(input) {
  const tipoDoInput = input.dataset.tipo;

  if (validadores[tipoDoInput])
    validadores[tipoDoInput](input)

  if (input.validity.valid){
    input.parentElement.classList.remove('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
  }
  else {
    input.parentElement.classList.add('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDoInput, input);
  }
}

function mostraMensagemDeErro(tipoDoInput, input) {
  let mensagem = '';

  tiposDeErro.forEach(erro => {
    if (input.validity[erro])
      mensagem = mensagensDeErro[tipoDoInput][erro];
  });

  return mensagem;
}

function validaDataNascimento(input) {
  let mensagem = '';
  const dataRecebida = new Date(input.value);

  if (!maiorQue18(dataRecebida)) {
    mensagem = 'Idade tem que ser maior de 18 anos.';
  }

  input.setCustomValidity(mensagem);
}

function maiorQue18(dataInput) {
  const dataAtual = new Date();

  const dataMais18 = new Date(dataInput.getUTCFullYear() + 18, dataInput.getUTCMonth(), dataInput.getUTCDate());

  return dataMais18 <= dataAtual;
}