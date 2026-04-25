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
Soma: sobrepor imagens, se passar de 255 -> mantemos 255
Subtração: diferenca entre fotos. Se baixar de 0, mantemos 0
Multiplicacao: após multiplicar, normalizamos dividindo tudo por 255
Divisao: nao podemos dividir por 0

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
