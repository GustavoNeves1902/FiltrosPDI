**_estruturada do projeto_**

1. No início do código, foram instanciadas todas as variáveis necessárias e utilizadas;
2. CTX -> abreviacao para contexto, são as ferramentas necessárias para editar as imagens no canvas

PIXELS: 0 -> preto 255 -> branco

**NEGATIVO**
Inverter as intensidades dos pixels -> o que é claro fica escuro, o que é escuro fica claro

**ESCALA DE CINZA**
IGUALAR OS VALORES DE RGB -- R = G = B
LUMINANCIA -> Cinza=(0.299×R)+(0.587×G)+(0.114×B)

**LIMIARIZAÇÃO**
Transforma o pixel em 0 ou 255 de acordo com o limir
acima do limiar -> 255
abaixo do limiar -> 0

**OPERACOES ARITMÉTICAS**
Soma: sobrepor imagens. soma pode chegar a 510 (255 + 255)
Subtração: diferenca entre fotos. pode chegar a -255 (0 - 255)
Multiplicacao: após multiplicar, normalizamos dividindo tudo por 255
Divisao: nao podemos dividir por 0
NovoValor = (valoratual + 255) / 3;

**TRANSFORMACAO LOGARITMICA**
Faz com que os pixels pretos e escuros fiquem mais claros, sem mexer muito nos pixels que já sao brancos
Novo valor = C x log(1 + valor atual)
C = 255/log(256)

**HISTROGRAMA**
é um contador de pixels
calcula a "quantidade" de cinza em cada pixel e distribui no gráfico

**EQUALIZACAO DE HISTOGRAMA**
histograma apenas mostra o problema, equalizador resolve
estica as barras do gráfico para que elas ocupem todo o espaço disponível
constraste corrigido
conta os pixels de cada tom de cinza -> acumula a soma dos pixels anteriores -> cria um dicionário para traduzir a transformacao dos pixels -> troca as cores seguindo o dicionario

**CRESCIMENTO DE REGIOES**
Como se fosse a varinha mágica do canva
seleciona o objeto clicado de acordo com a cor do pixel selecionado
depende do limiar escolhido

**PASSA-BAIXA MEDIANA**
melhor ferramenta para remover ruído sal-pimenta
coloca uma janela 3x3 em cima da imagem, pega o pixel central e os 8 em volta
coloca todos em vetor em ordem crescente, retira as extremidades e pega o valor do meio
pinta o pixel central com esse valor

**PASSA-BAIXA MEDIA**
parecido com a mediana, porém soma-se o valor de RGB e escolhe a média do valor para colorir o pixel central

**PASSA-BAIXA MIN**
Substitui o valor do pixel central pelo menor valor entre seus vizinhos

**PASSA-BAIXA MAX**
Substitui o valor do pixel central pelo maior valor entre seus vizinhos

**PASSA_BAIXA GAUSSIANO**
Se baseia na função Gaussiana (distribuição normal) e atribui pesos maiores aos pixels centrais e menores aos pixels mais distantes

kernel = [
[1, 2, 1],
[2, 4, 2],
[1, 2, 1],
];

**ROBERTS**
Usado para detectar bordas
usa um tabuleiro 2x2, focando nas diagonais
procura onde as cores mudam drasticamente e desenha uma linha branca ali
1)A diferença de cor entre o pixel atual e o vizinho da diagonal inferior direita. (Chamamos de Gradient X ou Gx).
2)A diferença de cor entre o vizinho da direita e o vizinho de baixo. (Chamamos de Gradient Y ou Gy).
Teorema de Pitagoras -> se o valor for perto de 255, houve degrau de cor

function aplicarRoberts(){
const {width, height, imageData, data} = obterPixels();

const saida = ctxFiltrado.createImageData(width,height);
const dataSaida = saida.data;

for (let y=0; y < height-1; y++){
for (let x=0; x < width-1; x++){

      let idx11 = (y * width + x) * 4; //atual
      let idx12 = (y * width + (x + 1)) * 4; //direita
      let idx21 = ((y + 1) * width + x) * 4; //embaixo
      let idx22 = ((y + 1) * width + (x + 1)) * 4; //diagonal inferior direita

      let l11 = calcularLuminancia(data[idx11], data[idx11+1], data[idx11+2]);
      let l12 = calcularLuminancia(data[idx12], data[idx12+1], data[idx12+2]);
      let l21 = calcularLuminancia(data[idx21], data[idx21+1], data[idx21+2]);
      let l22 = calcularLuminancia(data[idx22], data[idx22+1], data[idx22+2]);

      let gx = l11 - l22;
      let gy = l12 - l21;

      let mag = Math.sqrt((gx * gx) + (gy * gy));

      mag = Math.min(255,mag);



      dataSaida[idx11] = mag
      dataSaida[idx11 + 1] = mag
      dataSaida[idx11 + 2] = mag
      dataSaida[idx11 + 3] = 255;
    }

}

ctxFiltrado.putImageData(saida,0,0);
}

**PREWITT**
Evolucao do Roberts
kernel 3x3
da uma leve borrada na linha ao mesmo tempo em que procura as diferencas das cores

Kernel X =
[-1, 0, 1]
[-1, 0, 1]
[-1, 0, 1] //linhas verticais

Kernel Y =
[-1, -1, -1]
[ 0, 0, 0]
[ 1, 1, 1] //linhas horizontais

no final, usa o teorema de pitagoras para calcular a magnitude

**SOBEL**
irmao gemeo do PREWITT
muda os kernels

Kernel x =
[-1, 0, 1]
[-2, 0, 2]
[-1, 0, 1]

Kernel y =
[-1, -2, -1]
[ 0, 0, 0]
[ 1, 2, 1]

cria um efeito de suavizaçao ao mesmo tempo em que calcula a diferenca das cores

**PASSA ALTA BASICO**
foca nos detalhes e texturas
kernel =
[-1, -1, -1],
[-1, 8, -1],
[-1, -1, -1]

se houver detalhes, quebrasse o equilibrio da multiplicacao

**PASSA ALTA ALTO REFORÇO**
Irmao do Passa Alta Basico, mas muda o kernel
kernel =
[-1, -1, -1],
[-1, 9, -1],
[-1, -1, -1]

a imagem nao perde sua identidade

**OTSU**
Calcula por si só o limiar que separa o fundo da imagem principal

Analisa o histograma da imagem e testa todos os limiares possíveis para encontra o ponto de corte perfeito,
onde a variação das cores pretas e brancas seja a menor possível.

