# Cálculos de Blindagem: Desgaste, Dano Contuso e Penetração

Este guia detalha as fórmulas matemáticas utilizadas pelo motor do jogo para processar a interação entre um projétil e a proteção do alvo.

> **Aviso de Metodologia:** Embora as fórmulas apresentadas aqui representem com altíssima precisão o comportamento atual do jogo, a engenharia reversa de mecânicas é um processo contínuo. Estes cálculos podem sofrer ajustes ou refinamentos caso o jogo seja atualizado ou variáveis matemáticas mais precisas sejam descobertas pela comunidade no futuro.

**A Regra de Arredondamento do Jogo:**
Para todos os cálculos de dano e durabilidade finais, o jogo utiliza o arredondamento matemático padrão. Valores com decimais de `.5` para cima sobem para o próximo número inteiro (ex: 43.5 vira 44), e decimais de `.4` para baixo são cortadas (ex: 43.4 vira 43).

Abaixo estão os 3 pilares lógicos que definem como a durabilidade de uma armadura é calculada, a mecânica de ferimento contuso e as probabilidades reais da bala atravessar a blindagem.

---

### 1. Desgaste da Armadura (Perda de Durabilidade por Disparo)

O impacto suportado pela armadura a cada tiro depende de três fatores: O Dano de Blindagem da munição, a resistência do material do colete, e a dissipação de energia baseada na diferença de níveis.

**Fórmula Básica:**

> Perda de Durabilidade por Tiro = (Dano de Blindagem da Bala) × (Fator do Material) × (Fator de Amortecimento)

**Representação Gráfica:**


$$\text{Perda} = \text{Dano de Blindagem} \times \text{Fator do Material} \times \text{Fator de Amortecimento}$$

**Fator do Material (Resistência Bruta):**
Aromida: 0.30 | Polietileno: 0.35 | Titânio: 0.40 | Alumínio: 0.45 | Composto: 0.55 | Aço Endurecido: 0.60 | Cerâmica: 0.65 | Vidro: 0.70

**Fator de Amortecimento (Dissipação de Energia):**
Este valor depende da diferença direta entre o Nível (Classe) da bala e o Nível do colete.

* **Bala empata ou é mais forte que o colete:** Multiplica-se por `1.0`.
* **Bala é 1 Nível mais fraca:** Multiplica-se por `0.70`.
* **Bala é 2 Níveis mais fraca:** Multiplica-se por `0.40`.
* **Bala é 3 Níveis mais fraca:** Multiplica-se por `0.20`.
* **Bala é 4 ou mais Níveis mais fraca:** Aplica-se uma curva de pressão. Extrai-se a Raiz Quadrada de: `(Dano de Blindagem da bala) ÷ (Classe do Colete × 10)`. O resultado dessa raiz é multiplicado por `0.95` (respeitando sempre um valor mínimo de 0.10 e máximo de 1.0).

**Fórmula Gráfica da Curva de Pressão (Abismo de Força):**


$$\text{Fator de Amortecimento} = \sqrt{\frac{\text{Dano de Blindagem}}{\text{Classe do Colete} \times 10}} \times 0.95$$

*Atenção:* Quando a durabilidade atual da proteção atinge a marca de **50% ou menos**, a blindagem é considerada estruturalmente comprometida pelo jogo. A partir desse momento, a proteção deixa de bloquear os impactos e as próximas balas assumem 100% de chance de perfuração.

**Exemplo Prático A: Desgaste (Diferença Leve)**
**Cenário:** Munição 9x19mm Pst contra Colete PCA350

* **Dano de Blindagem da Bala:** 7
* **Material do Colete PCA350:** Alumínio (Fator 0.45)
* **Diferença de Nível:** Bala Nível 2 vs Colete Nível 3 (Bala é 1 nível mais fraca, logo, o Fator de Amortecimento é 0.70).

**Cálculo Direto:**

* `7 (Dano de Blindagem) × 0.45 (Fator do Material) × 0.70 (Fator de Amortecimento) = 2.205`
* **Conclusão:** Aplicando a regra de arredondamento, cada tiro que não perfurar o colete removerá **2 pontos de durabilidade** da placa.

**Exemplo Prático B: Desgaste (Abismo de Força)**
**Cenário:** Fuzil de Assalto atirando munição 7.62x39mm US contra um Colete Classe 6

* **Dano de Blindagem da Bala US:** 9
* **Status de Penetração da US:** 27 (Nível 2)
* **Classe do Colete:** 6
* **Material do Colete:** Cerâmica (Fator 0.65)
* **Diferença de Nível:** Bala Nível 2 vs Colete Nível 6 (Diferença de -4. Abismo de Força ativado. Necessária a curva de pressão).

**Passo 1 (Cálculo do Fator de Amortecimento por Pressão):**

* Resistência Base: `6 (Classe do Colete) × 10 = 60 (Resistência Base)`.
* Dividimos o dano pela resistência: `9 (Dano de Blindagem) ÷ 60 (Resistência Base) = 0.15 (Índice de Impacto)`.
* Extraímos a raiz quadrada: `√0.15 (Índice de Impacto) = 0.387 (Curva de Pressão)`.
* Multiplicamos pela constante do jogo: `0.387 (Curva de Pressão) × 0.95 = 0.36 (Fator de Amortecimento)`.

**Passo 2 (Cálculo Final do Desgaste):**

* `9 (Dano de Blindagem) × 0.65 (Fator do Material) × 0.36 (Fator de Amortecimento) = 2.106`
* **Conclusão:** A placa de cerâmica absorve o impacto da bala inferior com facilidade, perdendo apenas **2 pontos de durabilidade** por tiro após o arredondamento.

---

### 2. Ferimento Contuso / Blunt Damage (Cálculo de Bloqueio)

Quando a armadura cumpre seu papel e impede a passagem do projétil, a energia cinética do impacto é transferida como uma onda de choque para o corpo do jogador, causando o ferimento contuso.

A intensidade deste dano contuso sofre interferência do tamanho do cano e da eficiência mecânica da arma equipada em relação à bala base.

**Fórmula Básica:**

> Dano Contuso no Jogador = (Status de Ferimento Contuso da Bala) × (Dano Base da Arma equipada / Dano Base original da Bala)

**Representação Gráfica:**


$$\text{Dano Contuso} = \text{Ferimento da Bala} \times \left( \frac{\text{Dano Base da Arma}}{\text{Dano Base original da Bala}} \right)$$

---

### 3. Chance de Penetração (A Probabilidade da Bala Entrar)

A dinâmica de perfuração funciona em camadas lógicas. Se o projétil for superior à classe do colete, ele penetra integralmente (100% de chance). Em caso de empate de nível, a probabilidade da bala entrar no primeiro impacto flutua entre 80% e 100%, dependendo da força do valor residual (o último dígito do status de penetração).

Entretanto, quando o projétil for inferior à classe do colete, a chance da bala perfurar a blindagem decai baseada em uma equação exponencial.

**A Fórmula para Balas Inferiores (Contra blindagens 100% intactas):**
Primeiro, estabelece-se o Coeficiente 'X':

> X = [ (Classe do Colete × 10) + 5 - (Status de Penetração da Bala) ] ÷ 10

Em seguida, aplica-se 'X' na curva exponencial invertida (com um teto máximo de penetração travado em 50%):

> Chance % = [ 1 ÷ (2 elevado à potência 'X') ] × 100

**Representação Gráfica:**


$$X = \frac{(\text{Classe do Colete} \times 10) + 5 - \text{Status de Penetração}}{10}$$

$$\text{Chance (\%)} = \left( \frac{1}{2^X} \right) \times 100$$

*(Observação Mecânica Crucial: Esta fórmula acontece apenas no primeiro tiro. À medida que a durabilidade da blindagem cai de 100% em direção aos 50% vitais devido aos disparos repetidos, essa chance de penetração sofre um acréscimo quadrático contínuo. Isso resulta em uma probabilidade de perfuração que cresce a cada novo impacto contra a blindagem, até atingir 100% quando o colete chegar na metade de seus pontos de durabilidade).*

**Exemplo Prático C: Penetração sem Valor Residual**
**Cenário:** Munição 9x19mm Pst contra Colete PCA350

* **Status de Penetração da Bala:** 20 (Nível 2, sem valor residual)
* **Classe do Colete:** 3

**Passo 1 (Encontrar o Coeficiente 'X'):**

* `[3 (Classe do Colete) × 10] + 5 = 35 (Resistência Base)`.
* `35 (Resistência Base) - 20 (Status de Penetração) = 15 (Diferença Numérica)`.
* `15 (Diferença Numérica) ÷ 10 = 1.5 (Coeficiente X)`.

**Passo 2 (Aplicar na Curva Exponencial):**

* `2 elevado a 1.5 (Coeficiente X) = 2.828 (Divisor Exponencial)`.
* `1 ÷ 2.828 (Divisor Exponencial) = 0.3535 (Fator Base)`.
* `0.3535 (Fator Base) × 100 = 35.35% (Chance de Penetração)`.
* **Conclusão:** O primeiro tiro dessa bala tem **35.35% de chance** de furar o colete intacto (como é probabilidade, não há arredondamento do valor bruto).

**Exemplo Prático D: A Força do Valor Residual**
**Cenário:** Munição 5.56x45mm M855 contra Colete 6B23

* **Status de Penetração da Bala:** 34 (Nível 3, com valor residual 4)
* **Classe do Colete:** 4

**Passo 1 (Encontrar o Coeficiente 'X'):**

* `[4 (Classe do Colete) × 10] + 5 = 45 (Resistência Base)`.
* `45 (Resistência Base) - 34 (Status de Penetração) = 11 (Diferença Numérica)`.
* `11 (Diferença Numérica) ÷ 10 = 1.1 (Coeficiente X)`.

**Passo 2 (Aplicar na Curva Exponencial):**

* `2 elevado a 1.1 (Coeficiente X) = 2.143 (Divisor Exponencial)`.
* `1 ÷ 2.143 (Divisor Exponencial) = 0.4666 (Fator Base)`.
* `0.4666 (Fator Base) × 100 = 46.66% (Chance de Penetração)`.
* **Conclusão:** Mesmo sendo uma munição de nível inferior à blindagem, o seu alto valor residual (4) reduz drasticamente a punição matemática da curva, elevando a chance de penetração para quase **46.66%** logo no primeiro impacto.