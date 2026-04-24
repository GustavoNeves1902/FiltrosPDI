***estruturada do projeto***

1) No início do código, foram instanciadas todas as variáveis necessárias e utilizadas;
2) CTX -> abreviacao para contexto, são as ferramentas necessárias para editar as imagens no canvas

PIXELS: 0 -> preto 255 -> branco

__NEGATIVO__
Inverter as intensidades dos pixels -> o que é claro fica escuro, o que é escuro fica claro

__ESCALA DE CINZA__
IGUALAR OS VALORES DE RGB -- R = G = B
LUMINANCIA -> Cinza=(0.299×R)+(0.587×G)+(0.114×B)

__LIMIARIZAÇÃO__
Transforma o pixel em 0 ou 255 de acordo com o limir
acima do limiar -> 255
abaixo do limiar -> 0

__OPERACOES ARITMÉTICAS__
Soma: sobrepor imagens, se passar de 255 -> mantemos 255
Subtração: diferenca entre fotos. Se baixar de 0, mantemos 0
Multiplicacao: após multiplicar, normalizamos dividindo tudo por 255
Divisao: nao podemos dividir por 0

__TRANSFORMACAO LOGARITMICA__
Faz com que os pixels pretos e escuros fiquem mais claros, sem mexer muito nos pixels que já sao brancos
Novo valor = C x log(1 + valor atual)
C = 255/log(256)

__HISTROGRAMA__
é um contador de pixels
calcula a "quantidade" de cinza em cada pixel e distribui no gráfico