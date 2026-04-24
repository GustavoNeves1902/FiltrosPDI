const limiarizacao = document.getElementById("limiarizacao");
const Otsu = document.getElementById("Otsu");
const CrescDeRegiões = document.getElementById("CrescDeRegiões");
const escalaDeCinza = document.getElementById("escalaDeCinza");
const passaAltaBasico = document.getElementById("passaAltaBasico");
const passaAltaAltoReforco = document.getElementById("passaAltaAltoReforco");
const passaBaixaMedia = document.getElementById("passaBaixaMedia");
const passaBaixaMediana = document.getElementById("passaBaixaMediana");
const Gaussiano = document.getElementById("Gaussiano");
const passaBaixaMin = document.getElementById("passaBaixaMin");
const roberts = document.getElementById("roberts");
const prewitt = document.getElementById("prewitt");
const sobel = document.getElementById("sobel");
const transformacaoLogaritmica = document.getElementById(
  "transformacaoLogaritmica",
);
const Negativo = document.getElementById("Negativo");
const Histograma = document.getElementById("histograma");
const equalizacaoDeHistograma = document.getElementById(
  "equalizacaoDeHistograma",
);

const canvasOriginal = document.getElementById("originalCanvas");
const canvasFiltrado = document.getElementById("filtradoCanvas");
const ctxOriginal = canvasOriginal.getContext("2d");
const ctxFiltrado = canvasFiltrado.getContext("2d");

const width = canvasOriginal.width;
const height = canvasOriginal.height;

canvasFiltrado.width = width;
canvasFiltrado.height = height;

const imagemEntrada = document.getElementById("imageInput");
let originalImage = new Image();

//IMAGEM DE ENTRADA
imagemEntrada.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage.onload = () => {
        canvasOriginal.width = originalImage.width;
        canvasOriginal.height = originalImage.height;
        ctxOriginal.drawImage(originalImage, 0, 0);

        canvasFiltrado.width = originalImage.width;
        canvasFiltrado.height = originalImage.height;
        ctxFiltrado.clearRect(
          0,
          0,
          canvasFiltrado.width,
          canvasFiltrado.height,
        );
      };
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

//imagem 2 (operacoes aritmeticas)
const imagemEntrada2 = document.getElementById("imageInput2");
const operacaoSelecionada = document.getElementById("operacaoSelect");

const canvasImagemB = document.getElementById("canvasImagemB");
const ctxImagemB = canvasImagemB.getContext("2d");
const wrapperImagemB = document.getElementById("wrapperImagemB");

let temImagemB = false;

imagemEntrada2.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img2 = new Image();
      img2.onload = () => {
        const width = canvasOriginal.width;
        const height = canvasOriginal.height;
        canvasImagemB.width = width;
        canvasImagemB.height = height;

        ctxImagemB.drawImage(img2, 0, 0, width, height);
        temImagemB = true;

        aplicarOperacoesAritmeticas();
      };
      img2.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Funções auxiliares
function obterPixels() {
  const width = canvasOriginal.width;
  const height = canvasOriginal.height;
  const imageData = ctxOriginal.getImageData(0, 0, width, height);

  return {
    width: width,
    height: height,
    imageData: imageData,
    data: imageData.data,
  };
}

function esconderControles() {
  document.getElementById("filter-controls").style.display = "none";
  document.getElementById("limiar-controls").style.display = "none";

  document.getElementById("highboost-controls").style.display = "none";
  document.getElementById("arithmetic-image-controls").style.display = "none";

  wrapperImagemB.style.display = "none";
}

//NEGATIVO
function aplicarNegativo() {
  esconderControles();
  const { imageData, data } = obterPixels();

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; //vermelho
    data[i + 1] = 255 - data[i + 1]; //verde
    data[i + 2] = 255 - data[i + 2]; //azul
  }

  ctxFiltrado.putImageData(imageData, 0, 0);
}
Negativo.addEventListener("click", aplicarNegativo);

//ESCALA DE CINZA
function aplicarEscalaDeCinza() {
  esconderControles();
  const { imageData, data } = obterPixels();

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    let cinza = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = cinza; //vermelho novo
    data[i + 1] = cinza; //verde novo
    data[i + 2] = cinza; //azul novo
  }

  ctxFiltrado.putImageData(imageData, 0, 0);
}
escalaDeCinza.addEventListener("click", aplicarEscalaDeCinza);

//LIMIARIZAÇÃO
function aplicarLimiariazacao() {

  const { imageData, data } = obterPixels();

  const limiar = parseInt(document.getElementById("thresholdRange").value);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    let cinza = 0.299 * r + 0.587 * g + 0.114 * b;

    let novoValor = cinza >= limiar ? 255 : 0;

    data[i] = novoValor;
    data[i + 1] = novoValor;
    data[i + 2] = novoValor;
  }

  ctxFiltrado.putImageData(imageData, 0, 0);
}
limiarizacao.addEventListener("click", () => {
  document.getElementById("filter-controls").style.display = "flex";
  document.getElementById("limiar-controls").style.display = "flex";

  document.getElementById("arithmetic-image-controls").style.display = "none";
  document.getElementById("highboost-controls").style.display = "none";
  wrapperImagemB.style.display = "none";

  aplicarLimiariazacao();
});

const thresholdRange = document.getElementById("thresholdRange");
const thresholdValue = document.getElementById("thresholdValue");

thresholdRange.addEventListener("input", (event) => {
  thresholdValue.innerText = event.target.value;

  aplicarLimiariazacao();
});

//OPERACOES ARITMETICAS
function aplicarOperacoesAritmeticas() {
  if (!temImagemB) return;

  const width = canvasOriginal.width;
  const height = canvasOriginal.height;

  const { data: dataA } = obterPixels();

  const imgDataB = ctxImagemB.getImageData(0, 0, width, height);
  const dataB = imgDataB.data;

  const saida = ctxFiltrado.createImageData(width, height);
  const dataSaida = saida.data;

  const operacao = operacaoSelecionada.value;

  for (let i = 0; i < dataA.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let idx = i + c;
      let vA = dataA[idx];
      let vB = dataB[idx];
      let res = 0;

      if (operacao === "soma") {
        res = vA + vB;
      } else if (operacao === "subtracao") {
        res = vA - vB;
      } else if (operacao === "multiplicacao") {
        res = (vA * vB) / 255;
      } else if (operacao === "divisao") {
        let divisor = vB === 0 ? 1 : vB;
        res = (vA / divisor) * 255;
      }

      if (res > 255) res = 255;
      if (res < 0) res = 0;

      dataSaida[idx] = res;
    }

    dataSaida[i + 3] = 255; //Alpha
  }
  ctxFiltrado.putImageData(saida, 0, 0);
}

const Aritmeticas = document.getElementById("operacoesAritmeticas");
Aritmeticas.addEventListener("click", () => {
  esconderControles();
  document.getElementById("filter-controls").style.display = "flex";
  document.getElementById("arithmetic-image-controls").style.display = "flex";

  wrapperImagemB.style.display = "block";
});

operacaoSelecionada.addEventListener("change", aplicarOperacoesAritmeticas);
