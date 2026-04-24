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