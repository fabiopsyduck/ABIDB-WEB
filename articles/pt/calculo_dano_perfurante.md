# Cálculo do Sistema de Dano Perfurante

A mitigação de dano de coletes no *Arena Breakout Infinite* não utiliza uma simulação física complexa de perda de energia cinética, mas sim um sistema exato baseado em degraus algorítmicos. Este guia destrincha a fórmula matemática, ensinando como calcular o dano real repassado ao corpo do personagem no instante em que o projétil consegue perfurar a armadura.

## 1. Dados Necessários para o Cálculo

Para calcular o Dano de Penetração, você precisa coletar apenas **quatro valores** extraídos dos atributos do jogo:

* **Dano Inicial (Combo Arma + Munição):** O valor de dano máximo resultante da combinação da arma com a bala, sempre calculado dentro do alcance efetivo ideal (ex: 50, 48, 81).
* **Penetração Bruta:** O valor numérico de penetração do status da munição (ex: 34, 40, 52).
* **Nível da Munição:** O primeiro dígito do valor de penetração (ex: Penetração 34 = Nível 3).
* **Classe do Colete:** O nível de proteção da placa do alvo (ex: Colete 3, Colete 6).

## 2. As Duas Variáveis de Controle

Com os dados coletados, encontre as duas variáveis matemáticas fundamentais:

1. **Diferença de Nível (Diff):** A vantagem ou desvantagem balística no impacto.
* *Fórmula:* Nível da Munição menos a Classe do Colete.
* *(Exemplo: Munição Nível 4 atingindo Colete Nível 3 resulta em um Diff de **+1**).*


2. **Resto da Penetração (Remainder):** O segundo dígito exato do atributo de Penetração Bruta.
* *Fórmula:* O resto da divisão do valor de penetração por 10 (basicamente, o último número).
* *(Exemplo: Munição com Penetração **42** possui Remainder **2**. Penetração **50** possui Remainder **0**).*



---

## 3. A Escada de Retenção de Dano

A engine do jogo analisa o valor da **Diferença de Nível (Diff)** e enquadra o impacto em um dos 5 degraus de retenção para definir o multiplicador de dano.

*(Atenção: O símbolo "x" representa multiplicação)*

* **Degrau 1: Penetração Absoluta (Diff maior ou igual a +2)**
A placa é irrelevante frente à força do projétil. A bala passa limpa.
* **Multiplicador:** 1.0 (100% do Dano Inicial passa para o corpo)


* **Degrau 2: Domínio Leve (Diff igual a +1)**
A bala é 1 nível superior ao colete. A placa tenta frear, mas falha.
* **Multiplicador:** 0.90 + (Remainder x 0.01)


* **Degrau 3: O Empate (Diff igual a 0)**
Bala e colete possuem o mesmo nível. A malha balística freia o tiro.
* **Multiplicador:** 0.65 + (Remainder x 0.005)


* **Degrau 4: Desvantagem Leve (Diff igual a -1)**
A bala é 1 nível mais fraca. Fura apenas por probabilidade (RNG).
* **Multiplicador:** 0.60 + (Remainder x 0.005)


* **Degrau 5: A Trava do Fundo do Poço (Diff menor ou igual a -2)**
A bala é 2 ou mais níveis inferior. Se a placa estiver rachada e permitir o furo, a engine aplica o piso fixo.
* **Multiplicador:** 0.60 Fixo (o Remainder é ignorado)



## 4. O Cálculo de Arredondamento

*Arena Breakout Infinite* utiliza o arredondamento matemático padrão: casas decimais de .5 para cima sobem para o próximo número inteiro, e .4 para baixo são cortadas.

**Fórmula Final:**
Dano Perfurante = Arredondar (Dano Inicial x Multiplicador)

---

## 5. Exemplos Práticos de Aplicação Passo a Passo

### Exemplo A: M4A1 (Bala M855A1) vs Colete Nível 3

* **Passo 1 (Coleta de Dados):**
* Dano Inicial (Combo): **48**
* Penetração Bruta: **40** (Nível 4)
* Classe do Colete: **3**


* **Passo 2 (Encontrar Variáveis):**
* Diferença de Nível (Diff): 4 menos 3 = **+1** (Degrau 2).
* Resto da Penetração (Remainder): O último dígito de "40" é **0**.


* **Passo 3 (Multiplicador):** 0.90 + (0 x 0.01) = **0.90**
* **Passo 4 (Cálculo Final):** 48 x 0.90 = **43.2**. Arredondado para baixo, resultando em **43 de Dano Perfurante**.

### Exemplo B: SKS (Bala PS) vs Colete Nível 2

* **Passo 1 (Coleta de Dados):**
* Dano Inicial (Combo): **58**
* Penetração Bruta: **33** (Nível 3)
* Classe do Colete: **2**


* **Passo 2 (Encontrar Variáveis):**
* Diferença de Nível (Diff): 3 menos 2 = **+1** (Degrau 2).
* Resto da Penetração (Remainder): O último dígito de "33" é **3**.


* **Passo 3 (Multiplicador):** 0.90 + (3 x 0.01) = **0.93**
* **Passo 4 (Cálculo Final):** 58 x 0.93 = **53.94**. Arredondado para cima, resultando em **54 de Dano Perfurante**.

### Exemplo C: AK-102 (Bala M855) vs Colete Nível 6

* **Passo 1 (Coleta de Dados):**
* Dano Inicial (Combo): **50**
* Penetração Bruta: **34** (Nível 3)
* Classe do Colete: **6**


* **Passo 2 (Encontrar Variáveis):**
* Diferença de Nível (Diff): 3 menos 6 = **-3** (Degrau 5).


* **Passo 3 (Multiplicador):** Trava do Fundo do Poço = **0.60** fixo.
* **Passo 4 (Cálculo Final):** 50 x 0.60 = **30**. Sem decimais, resultando em **30 de Dano Perfurante**.