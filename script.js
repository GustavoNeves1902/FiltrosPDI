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
  "transformacaoLogaritmica"
);
const Negativo = document.getElementById("Negativo");
const Histograma = document.getElementById("histograma");
const equalizacaoDeHistograma = document.getElementById(
  "equalizacaoDeHistograma"
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

  document.getElementById("arithmetic-controls").style.display = "none";
  document.getElementById("highboost-controls").style.display = "none";
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

  document.getElementById("arithmetic-controls").style.display = "none";
  document.getElementById("highboost-controls").style.display = "none";

  aplicarLimiariazacao();
});

const thresholdRange = document.getElementById("thresholdRange");
const thresholdValue = document.getElementById("thresholdValue");

thresholdRange.addEventListener("input", (event) => {
  thresholdValue.innerText = event.target.value;

  aplicarLimiariazacao();
});

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
          canvasFiltrado.height
        );
      };
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
