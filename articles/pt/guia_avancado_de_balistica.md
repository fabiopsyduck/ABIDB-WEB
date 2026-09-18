# Guia Avançado de Balística: Compreendendo Dano, Alcance e a Queda de Dano

Entender como o seu tiro se comporta à distância é a diferença entre abater um alvo ou apenas arranhar a blindagem dele. Neste guia, vamos desmistificar como o jogo calcula o alcance, o dano e por que o Campo de Tiro muitas vezes parece dar informações confusas.

## A Regra de Ouro: Arma vs. Munição
A primeira coisa que você precisa entender para montar o seu equipamento é a divisão de papéis:

* **A ARMA dita a Distância e o Modificador de Dano:** O cano e a arma definem o alcance efetivo e podem buffar, nerfar ou não interferir no dano original da bala.
* **A MUNIÇÃO dita o Dano:** É o projétil que define a força destrutiva base do seu disparo. 

## Os 3 Estágios da Trajetória (Tipos de Dados)
Quando você atira, a bala não perde dano de forma linear desde o momento em que sai do cano. A trajetória é dividida em três fases perfeitamente calculadas pela *engine* do jogo:

1. **Dado Inicial (O Teto da Balística):** É o dano máximo da sua munição. A bala mantém **100% dessa força** desde o cano da arma até a distância limite do seu alcance efetivo.
2. **Dados Intermediários (A Queda):** É a zona de transição. Ao cruzar o limite do Alcance Inicial, a bala começa a perder força rapidamente. São os "degraus" de queda de dano.
3. **Dado Final (O Chão da Balística):** É a distância final onde a bala atinge seu dano mínimo. A partir deste ponto, a bala estabiliza novamente e **não perde mais dano**, independentemente da distância.

---

## A Regra da Estabilidade Absoluta e o "Caos" dos Decimais
O maior problema para testar armas no jogo é que **a interface esconde os decimais da distância** (ex: 12.1m, 12.8m). A tela mostra apenas "12m". 

> Para um Dano Inicial ou Final ser considerado verdadeiramente **"estável"**, o valor do dano deve ser exatamente o mesmo durante todo aquele metro (do 12.0m ao 12.9m). Se houver qualquer flutuação dentro desse mesmo metro inteiro, ele ainda faz parte dos Dados Intermediários.

### Exemplo Visual Prático
Analise o comportamento de uma bala com Alcance Inicial de 11m e Dano Base de 74:

```text
DANO:    74--- 74--- 74--- 72--- 70--- 66--- 64--- 60--- 59--- 57--- 52--- 52--- 52--- 52   
         |     |     |     |     |     |     |     |     |     |     |     |     |     |    
METROS:  0m    11m   12m   12m   12m   12m   12m   12m   12m   13m   13m   14m   25m   ∞    
```
**Legenda:**
* **INICIAL (0 a 11m):** O teto da balística. Força máxima (74) constante antes da queda.
* **INTERMEDIÁRIOS (12m a 13m):** A zona de transição (queda de 72 até 57). O jogo exibe "12m", mas a bala está percorrendo os decimais invisíveis (12.1, 12.5, 12.9...).
* **FINAL (14m em diante):** O chão da balística. Dano mínimo (52), estabilizado e permanente para o resto da trajetória.

---

## A Matemática da Engine: Como a Queda Funciona?
O caos dos Dados Intermediários pode parecer aleatório no Campo de Tiro, mas ele obedece a regras matemáticas estritas escondidas no código do jogo. 

Conhecendo essas regras, você nunca mais precisará tentar adivinhar a força do seu tiro:

* **A Lei dos 3 Metros:** A zona de transição (Dados Intermediários) é extremamente curta. O dano cai do seu máximo absoluto para o seu mínimo absoluto num espaço de **exatos 3 metros**.
* **A Lei dos 30% (O Chão do Dano):** A perda de força não é infinita. Ao fim dos 3 metros de queda, o projétil perde exatamente **30% da sua força original**. Ou seja, o Dado Final de qualquer disparo é sempre **70% do dano base**.

---

## As Fórmulas na Prática
Graças à matemática da *engine*, você pode descobrir exatamente qual será o dano e o alcance mínimo (o Chão da Balística) de qualquer arma aplicando duas fórmulas diretas sobre o seu Dado Inicial, respeitando a regra de arredondamento do jogo.

**1. Cálculo do Alcance Final:**
```text
Alcance Inicial + 3 metros = Alcance Final
```

**2. Cálculo do Dano Final e Arredondamento:**
```text
Dano Inicial * 0.70 = Dano Final
```

Como a *engine* não exibe números quebrados na tela, você deve arredondar o resultado final seguindo esta regra estrita:

* **Fração de .1 a .4:** Arredonda para **baixo**. O decimal é cortado. (Ex: *34.3 vira 34*).
* **Fração de .5 a .9:** Arredonda para **cima**. Sobe para o próximo inteiro. (Ex: *30.8 vira 31* | *24.5 vira 25*).

### Exemplo Completo de Cálculo
Se a sua arma possui um Dano Máximo Garantido de **84** até **83 metros**:

* *Encontrando o Alcance:* `83 + 3 = 86 metros`
* *Encontrando o Dano:* `84 * 0.70 = 58.8` *(Pela regra de arredondamento de .5 a .9, o valor sobe para 59)*

Isso significa que o sistema de balística tem uma âncora inicial absoluta de 84 de dano aos 83 metros. A degradação ocorre gradativamente no vazio entre os 83m e os 86m, estabilizando permanentemente em 59 de dano a partir da marca final, eliminando totalmente a necessidade de depender de distâncias físicas imprecisas no Campo de Tiro.