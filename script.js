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
const Aritmeticas = document.getElementById("operacoesAritmeticas");
const logaritmica = document.getElementById("transformacaoLogaritmica");
const histograma = document.getElementById("histograma");
const equalizador = document.getElementById("equalizacaoDeHistograma");
const crescimento = document.getElementById("CrescDeRegiões");

const btndownload = document.getElementById('btndoanload');

const canvasOriginal = document.getElementById("originalCanvas");
const canvasFiltrado = document.getElementById("filtradoCanvas");
const ctxOriginal = canvasOriginal.getContext("2d");
const ctxFiltrado = canvasFiltrado.getContext("2d");

const canvasGraficoOrig = document.getElementById("graficoOriginal");
const ctxGraficoOrig = canvasGraficoOrig.getContext("2d");
const canvasGraficoFilt = document.getElementById("graficoFiltrado");
const ctxGraficoFilt = canvasGraficoFilt.getContext("2d");

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

//imagem 2 (apenas para operacoes aritmeticas)
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

function desenharGrafico(vetorHistograma, ctx, largura, altura) {
  // Limpa o desenho anterior
  ctx.clearRect(0, 0, largura, altura);

  // Acha o pico do gráfico (o tom de cinza que mais aparece)
  let maxValor = Math.max(...vetorHistograma);

  ctx.fillStyle = "#333"; // Cor escura para as barras

  // Desenha as 256 barrinhas
  for (let i = 0; i < 256; i++) {
    let alturaBarra = (vetorHistograma[i] / maxValor) * altura;
    // O eixo Y do canvas começa em cima, por isso (altura - alturaBarra)
    ctx.fillRect(
      i * (largura / 256),
      altura - alturaBarra,
      largura / 256,
      alturaBarra,
    );
  }
}

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

  document.getElementById("graficoOriginal").style.display = "none";
  document.getElementById("graficoFiltrado").style.display = "none";

  wrapperImagemB.style.display = "none";
  modoCrescimentoAtivo = false;
}

function transformaremCiza(data) {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    let cinza = calcularLuminancia(r, g, b);

    data[i] = cinza; //vermelho novo
    data[i + 1] = cinza; //verde novo
    data[i + 2] = cinza; //azul novo
  }
}

function calcularLuminancia(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function transformarVetorEmCinza(data) {
  for (let i = 0; i < data.length; i += 4) {
    let cinza = calcularLuminancia(data[i], data[i + 1], data[i + 2]);

    data[i] = cinza;
    data[i + 1] = cinza;
    data[i + 2] = cinza;
  }
}

function gerarVetorHistograma(data) {
  let histograma = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    let cinza = calcularLuminancia(data[i], data[i + 1], data[i + 2]);
    histograma[cinza]++;
  }
  return histograma;
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

  transformaremCiza(data);

  ctxFiltrado.putImageData(imageData, 0, 0);
}
escalaDeCinza.addEventListener("click", aplicarEscalaDeCinza);

//LIMIARIZAÇÃO
function aplicarLimiariazacao() {
  const { imageData, data } = obterPixels();

  const limiar = parseInt(document.getElementById("thresholdRange").value);

  transformaremCiza(data);

  for (let i = 0; i < data.length; i += 4) {
    let cor = data[i] >= limiar ? 255 : 0;

    data[i] = cor;
    data[i + 1] = cor;
    data[i + 2] = cor;
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

Aritmeticas.addEventListener("click", () => {
  esconderControles();
  document.getElementById("filter-controls").style.display = "flex";
  document.getElementById("arithmetic-image-controls").style.display = "flex";

  wrapperImagemB.style.display = "block";
});

operacaoSelecionada.addEventListener("change", aplicarOperacoesAritmeticas);

//LOGARITMICA
function aplicarTransformacaoLogaritmica() {
  const { imageData, data } = obterPixels();

  const c = 255 / Math.log(256);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = c * Math.log(1 + data[i]);
    data[i + 1] = c * Math.log(1 + data[i + 1]);
    data[i + 2] = c * Math.log(1 + data[i + 2]);
  }

  ctxFiltrado.putImageData(imageData, 0, 0);
}

logaritmica.addEventListener("click", () => {
  esconderControles();
  aplicarTransformacaoLogaritmica();
});

//HISTOGRAMA
function aplicarHistograma() {
  const { width, height, data } = obterPixels();

  let histograma = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    let cinza = calcularLuminancia(data[i], data[i + 1], data[i + 2]);
    histograma[cinza]++;
  }

  let valorMaximo = Math.max(...histograma); //para saber a altura do grafico

  ctxFiltrado.fillStyle = "white";
  ctxFiltrado.fillRect(0, 0, width, height);

  ctxFiltrado.fillStyle = "black";

  let larguraBarra = width / 256;

  for (let i = 0; i < 256; i++) {
    let alturaBarra = (histograma[i] / valorMaximo) * height;

    ctxFiltrado.fillRect(
      i * larguraBarra,
      height - alturaBarra,
      larguraBarra,
      alturaBarra,
    );
  }
}

histograma.addEventListener("click", () => {
  esconderControles();
  aplicarHistograma();
});

//EQUALIZACAO DE HISTOGRAMA
function aplicarEqualizacao() {
  const { width, height, imageData, data } = obterPixels();

  let histogramaOriginal = gerarVetorHistograma(data);
  desenharGrafico(
    histogramaOriginal,
    ctxGraficoOrig,
    canvasGraficoOrig.width,
    canvasGraficoOrig.height,
  );

  let soma = new Array(256).fill(0);
  soma[0] = histogramaOriginal[0]; //iguala os valores inciais

  for (let i = 1; i < 256; i++) {
    soma[i] = soma[i - 1] + histogramaOriginal[i];
  }

  let mapaCores = new Array(256).fill(0);

  let somaMin = soma.find((valor) => valor > 0);
  let totalPixels = width * height;

  for (let i = 0; i < 256; i++) {
    let novoValor = Math.round(
      ((soma[i] - somaMin) / (totalPixels - somaMin)) * 255,
    );

    if (novoValor > 255) novoValor = 255;
    if (novoValor < 0) novoValor = 0;

    mapaCores[i] = novoValor;
  }

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    let cinza = calcularLuminancia(r, g, b);

    let novaCorEqualizada = mapaCores[cinza];

    data[i] = novaCorEqualizada; // R
    data[i + 1] = novaCorEqualizada; // G
    data[i + 2] = novaCorEqualizada; // B
  }

  ctxFiltrado.putImageData(imageData, 0, 0);

  let histogramaEqualizado = gerarVetorHistograma(data); // O 'data' já está com as cores novas!
  desenharGrafico(
    histogramaEqualizado,
    ctxGraficoFilt,
    canvasGraficoFilt.width,
    canvasGraficoFilt.height,
  );
}

equalizador.addEventListener("click", () => {
  esconderControles();

  document.getElementById("graficoOriginal").style.display = "block";
  document.getElementById("graficoFiltrado").style.display = "block";

  aplicarEqualizacao();
});

//CRESCIMENTO DE REGIOES
let modoCrescimentoAtivo = false;

function aplicarCrescimentoDeRegioes(startX, startY) {
  const { width, height, imageData, data } = obterPixels();

  const tolerancia = parseInt(document.getElementById("thresholdRange").value);

  const saida = ctxFiltrado.createImageData(width, height);
  const dataSaida = saida.data;
  for (let i = 0; i < dataSaida.length; i += 4) {
    dataSaida[i] = 0;
    dataSaida[i + 1] = 0;
    dataSaida[i + 2] = 0;
    dataSaida[i + 3] = 255;
  }

  function getCinza(x, y) {
    const idx = (y * width + x) * 4;
    return Math.round(
      0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2],
    );
  }

  const SementeCinza = getCinza(startX, startY);

  const visitados = new Uint8Array(width * height); //0 = nao visitado e 1 = visitado

  const pilha = [[startX, startY]];

  visitados[startY * width + startX] = 1; //marca a semente como visitada

  while (pilha.length > 0) {
    const [cx, cy] = pilha.pop(); //tira o primeiro pixel

    const idxAtual = (cy * width + cx) * 4;
    dataSaida[idxAtual] = 255;
    dataSaida[idxAtual + 1] = 255;
    dataSaida[idxAtual + 2] = 255;

    const vizinhos = [
      [cx, cy - 1],
      [cx, cy + 1],
      [cx - 1, cy],
      [cx + 1, cy],
    ];

    for (let i = 0; i < vizinhos.length; i++) {
      const nx = vizinhos[i][0];
      const ny = vizinhos[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const indiceVisitado = ny * width + nx;

        if (visitados[indiceVisitado] === 0) {
          const cinzaVizinho = getCinza(nx, ny);

          if (Math.abs(cinzaVizinho - SementeCinza) <= tolerancia) {
            visitados[indiceVisitado] = 1;
            pilha.push([nx, ny]);
          }
        }
      }
    }
  }

  ctxFiltrado.putImageData(saida, 0, 0);
}

crescimento.addEventListener("click", () => {
  esconderControles();

  document.getElementById("filter-controls").style.display = "flex";
  document.getElementById("limiar-controls").style.display = "flex";

  modoCrescimentoAtivo = true;
  alert(
    "Crescimento de regiões ativo. Ajuste o limiar e clique na imagem para escolher a semente.",
  );
});

canvasOriginal.addEventListener("click", (event) => {
  if (modoCrescimentoAtivo) {
    const rect = canvasOriginal.getBoundingClientRect();
    const x = Math.floor(
      (event.clientX - rect.left) * (canvasOriginal.width / rect.width),
    );
    const y = Math.floor(
      (event.clientY - rect.top) * (canvasOriginal.height / rect.height),
    );

    aplicarCrescimentoDeRegioes(x, y);
  }
});

//MEDIANA
function aplicarMediana() {
  const { width, height, imageData, data } = obterPixels();

  const saida = ctxFiltrado.createImageData(width, height);
  const dataSaida = saida.data;
  for (let i = 0; i < data.length; i++) {
    dataSaida[i] = data[i];
  }

  for (let y = 1; y < height - 1; y++) {
    //heigth -1 para nao chegar nas bordas pois nao tem todos os vizinhos

    for (let x = 1; x < width - 1; x++) {
      //width -1 para nao chegar nas bordas pois nao tem todos os vizinhos

      let vizinhosR = [];
      let vizinhosG = [];
      let vizinhosB = [];

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;

          vizinhosR.push(data[idx]);
          vizinhosG.push(data[idx + 1]);
          vizinhosB.push(data[idx + 2]);
        }
      }

      vizinhosR.sort((a, b) => a - b);
      vizinhosG.sort((a, b) => a - b);
      vizinhosB.sort((a, b) => a - b);

      const indiceMeio = 4;

      const idxCentro = (y * width + x) * 4;
      dataSaida[idxCentro] = vizinhosR[indiceMeio];
      dataSaida[idxCentro + 1] = vizinhosG[indiceMeio];
      dataSaida[idxCentro + 2] = vizinhosB[indiceMeio];
    }
  }
  ctxFiltrado.putImageData(saida, 0, 0);
}

passaBaixaMediana.addEventListener("click", () => {
  esconderControles();
  aplicarMediana();
});

//MEDIA
function aplicarMedia() {
  const { width, height, imageData, data } = obterPixels();

  const saida = ctxFiltrado.createImageData(width, height);
  const dataSaida = saida.data;

  for (let i = 0; i < data.length; i++) {
    dataSaida[i] = data[i];
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let somaR = 0;
      let somaG = 0;
      let somaB = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((dy + y) * width + (x + dx)) * 4;

          somaR += data[idx];
          somaG += data[idx + 1];
          somaB += data[idx + 2];
        }
      }

      const mediaR = Math.round(somaR / 9);
      const mediaG = Math.round(somaG / 9);
      const mediaB = Math.round(somaB / 9);

      const idxCentro = (y * width + x) * 4;
      dataSaida[idxCentro] = mediaR;
      dataSaida[idxCentro + 1] = mediaG;
      dataSaida[idxCentro + 2] = mediaB;
    }
  }

  ctxFiltrado.putImageData(saida, 0, 0);
}

passaBaixaMedia.addEventListener("click", () => {
  esconderControles();
  aplicarMedia();
});


btndownload.addEventListener('click', () => {
  const linkTemporario = document.createElement('a');

  linkTemporario.download = 'imagem-com-filtro.png';

  linkTemporario.href = canvasFiltrado.toDataURL('image/png');

  linkTemporario.click();
})