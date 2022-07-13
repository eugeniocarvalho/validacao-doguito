const validadores = {
  dataNascimento: input => validaDataNascimento(input),
  cpf: input => validaCPF(input),
  cep: input => recuperarCEP(input),
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
  },
  cpf: {
    valueMissing: 'O campo cpf está vazio',
    customError: 'CPF não válido'
  },
  cep: {
    valueMissing: 'O campo de cep está vazio',
    patternMismatch: 'CEP inválido',
    customError: 'Não foi possivel buscar o CEP'
  },
  logradouro: {
    valueMissing: 'O campo logradouro está vazio',
  },
  cidade: {
    valueMissing: 'O campo cidade está vazio',
  },
  estado: {
    valueMissing: 'O campo estado está vazio',
  },
  preco: {
    valueMissing: 'O campo preço está vazio'
  }
}

const tiposDeErro = ['valueMissing', 'typeMismatch', 'patternMismatch', 'customError'];

export function valida(input) {
  const tipoDoInput = input.dataset.tipo;

  if (validadores[tipoDoInput])
    validadores[tipoDoInput](input)

  if (input.validity.valid) {
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

function validaCPF(input) {
  const cpfFormatado = input.value.replace('\D/g', "");
  let mensagem = '';

  if (!checaCPFRepetido(cpfFormatado) || !checaestruturaCPF(cpfFormatado))
    mensagem = "O CPF não é válido";

  input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpf) {
  const valoresRepetidos = [
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ];

  let cpfValido = true;

  valoresRepetidos.forEach(valor => {
    if (valor === cpf)
      cpfValido = false;
  });

  return cpfValido;
}

function checaestruturaCPF(cpf) {
  const multiplicador = 10;

  return checaDigitoVerificador(cpf, multiplicador);
}

function checaDigitoVerificador(cpf, multiplicador) {
  if (multiplicador >= 12)
    return true;

  let multiplicadorInicial = multiplicador;
  let soma = 0;
  const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
  const digitoVerificador = cpf.charAt(multiplicador - 1);

  for (let i = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
    soma = soma + cpfSemDigitos[i] * multiplicadorInicial;
    i++;
  }

  if (digitoVerificador == confirmaDigito(soma))
    return checaDigitoVerificador(cpf, multiplicador + 1);

  return false;
}

function confirmaDigito(soma) {
  return 11 - (soma % 11);
}

function recuperarCEP(input) {
  const cep = input.value.replace(/\D/g, "");
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  };

  // Se não tiver preenchido errado e se não tiver vazio, busque na API
  if (!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          input.setCustomValidity('Não foi possivel buscar o CEP');
          return;
        }

        input.setCustomValidity('');
        preencheCamposComCEP(data);
        return;
      });
  }
}

function preencheCamposComCEP(data) {
  const logradouro = document.querySelector("[data-tipo='logradouro']");
  const cidade = document.querySelector("[data-tipo='cidade']");
  const estado = document.querySelector("[data-tipo='estado']");


  logradouro.value = data.logradouro;
  cidade.value = data.localidade;
  estado.value = data.uf;
}