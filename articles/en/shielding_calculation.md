# Armor Calculations: Durability Loss, Blunt Damage, and Penetration

This guide details the mathematical formulas used by the game engine to process the interaction between a projectile and the target's armor.

> **Methodology Disclaimer:** Although the formulas presented here represent the current behavior of the game with extremely high accuracy, reverse engineering mechanics is an ongoing process. These calculations may undergo adjustments or refinements if the game is updated or if more precise mathematical variables are discovered by the community in the future.

**The Game's Rounding Rule:**
For all final damage and durability calculations, the game uses standard mathematical rounding. Values with decimals of `.5` and above are rounded up to the next whole number (e.g., 43.5 becomes 44), and decimals of `.4` and below are cut off (e.g., 43.4 becomes 43).

Below are the 3 logical pillars that define how armor durability is calculated, the blunt damage mechanics, and the actual probabilities of a bullet piercing the armor.

---

### 1. Armor Durability Loss (Durability Loss Per Shot)

The impact withstood by the armor from each shot depends on three factors: The ammo's Armor Damage, the armor's material resistance, and the energy dissipation based on the tier difference.

**Basic Formula:**

> Durability Loss Per Shot = (Bullet Armor Damage) × (Material Factor) × (Dampening Factor)

**Graphical Representation:**


$$\text{Loss} = \text{Armor Damage} \times \text{Material Factor} \times \text{Dampening Factor}$$

**Material Factor (Raw Resistance):**
Aramid: 0.30 | Polyethylene: 0.35 | Titanium: 0.40 | Aluminum: 0.45 | Composite: 0.55 | Hardened Steel: 0.60 | Ceramic: 0.65 | Glass: 0.70

**Dampening Factor (Energy Dissipation):**
This value depends on the direct difference between the Bullet's Level (Tier) and the Armor's Class.

* **Bullet ties or is stronger than the armor:** Multiplied by `1.0`.
* **Bullet is 1 Level weaker:** Multiplied by `0.70`.
* **Bullet is 2 Levels weaker:** Multiplied by `0.40`.
* **Bullet is 3 Levels weaker:** Multiplied by `0.20`.
* **Bullet is 4 or more Levels weaker:** A pressure curve is applied. Extract the Square Root of: `(Bullet Armor Damage) ÷ (Armor Class × 10)`. The result of this root is multiplied by `0.95` (always respecting a minimum value of 0.10 and a maximum of 1.0).

**Pressure Curve Graphical Formula (Power Gap):**


$$\text{Dampening Factor} = \sqrt{\frac{\text{Armor Damage}}{\text{Armor Class} \times 10}} \times 0.95$$

*Attention:* When the protection's current durability reaches the **50% or less** mark, the armor is considered structurally compromised by the game. From this moment on, the protection stops blocking impacts, and subsequent bullets assume a 100% chance of penetration.

**Practical Example A: Durability Loss (Minor Difference)**
**Scenario:** 9x19mm Pst ammo against PCA350 Armor

* **Bullet Armor Damage:** 7
* **PCA350 Armor Material:** Aluminum (Factor 0.45)
* **Level Difference:** Level 2 Bullet vs Class 3 Armor (Bullet is 1 level weaker, so the Dampening Factor is 0.70).

**Direct Calculation:**

* `7 (Armor Damage) × 0.45 (Material Factor) × 0.70 (Dampening Factor) = 2.205`
* **Conclusion:** Applying the rounding rule, each shot that fails to penetrate the armor will remove **2 durability points** from the plate.

**Practical Example B: Durability Loss (Power Gap)**
**Scenario:** Assault Rifle firing 7.62x39mm US ammo against a Class 6 Armor

* **US Bullet Armor Damage:** 9
* **US Penetration Status:** 27 (Level 2)
* **Armor Class:** 6
* **Armor Material:** Ceramic (Factor 0.65)
* **Level Difference:** Level 2 Bullet vs Class 6 Armor (Difference of -4. Power Gap activated. Pressure curve required).

**Step 1 (Pressure Dampening Factor Calculation):**

* Base Resistance: `6 (Armor Class) × 10 = 60 (Base Resistance)`.
* We divide the damage by the resistance: `9 (Armor Damage) ÷ 60 (Base Resistance) = 0.15 (Impact Ratio)`.
* We extract the square root: `√0.15 (Impact Ratio) = 0.387 (Pressure Curve)`.
* We multiply by the game's constant: `0.387 (Pressure Curve) × 0.95 = 0.36 (Dampening Factor)`.

**Step 2 (Final Durability Loss Calculation):**

* `9 (Armor Damage) × 0.65 (Material Factor) × 0.36 (Dampening Factor) = 2.106`
* **Conclusion:** The ceramic plate easily absorbs the impact of the inferior bullet, losing only **2 durability points** per shot after rounding.

---

### 2. Blunt Damage (Block Calculation)

When the armor fulfills its role and prevents the projectile from passing through, the kinetic energy of the impact is transferred as a shockwave to the player's body, causing blunt damage.

The intensity of this blunt damage is influenced by the barrel length and the mechanical efficiency of the equipped weapon in relation to the base bullet.

**Basic Formula:**

> Player Blunt Damage = (Bullet Blunt Damage Status) × (Equipped Weapon Base Damage / Original Bullet Base Damage)

**Graphical Representation:**


$$\text{Blunt Damage} = \text{Bullet Blunt Damage} \times \left( \frac{\text{Weapon Base Damage}}{\text{Original Bullet Base Damage}} \right)$$

---

### 3. Penetration Chance (The Probability of the Bullet Entering)

The penetration dynamics work in logical layers. If the projectile is superior to the armor class, it penetrates entirely (100% chance). In the event of a level tie, the probability of the bullet entering on the first impact fluctuates between 80% and 100%, depending on the strength of the residual value (the last digit of the penetration status).

However, when the projectile is inferior to the armor class, the chance of the bullet piercing the armor decays based on an exponential equation.

**The Formula for Inferior Bullets (Against 100% intact armors):**
First, Coefficient 'X' is established:

> X = [ (Armor Class × 10) + 5 - (Bullet Penetration Status) ] ÷ 10

Then, 'X' is applied to the inverted exponential curve (with a maximum penetration cap locked at 50%):

> Chance % = [ 1 ÷ (2 to the power of 'X') ] × 100

**Graphical Representation:**


$$X = \frac{(\text{Armor Class} \times 10) + 5 - \text{Penetration Status}}{10}$$

$$\text{Chance (\%)} = \left( \frac{1}{2^X} \right) \times 100$$

*(Crucial Mechanical Observation: This formula only applies to the first shot. As the armor's durability drops from 100% towards the vital 50% due to repeated shots, this penetration chance undergoes a continuous quadratic increase. This results in a penetration probability that grows with each new impact against the armor, until it reaches 100% when the vest is at half of its durability points).*

**Practical Example C: Penetration without Residual Value**
**Scenario:** 9x19mm Pst ammo against PCA350 Armor

* **Bullet Penetration Status:** 20 (Level 2, no residual value)
* **Armor Class:** 3

**Step 1 (Finding Coefficient 'X'):**

* `[3 (Armor Class) × 10] + 5 = 35 (Base Resistance)`.
* `35 (Base Resistance) - 20 (Penetration Status) = 15 (Numerical Difference)`.
* `15 (Numerical Difference) ÷ 10 = 1.5 (Coefficient X)`.

**Step 2 (Applying to the Exponential Curve):**

* `2 to the power of 1.5 (Coefficient X) = 2.828 (Exponential Divisor)`.
* `1 ÷ 2.828 (Exponential Divisor) = 0.3535 (Base Factor)`.
* `0.3535 (Base Factor) × 100 = 35.35% (Penetration Chance)`.
* **Conclusion:** The first shot of this bullet has a **35.35% chance** of piercing the intact armor (since it is a probability, the raw value is not rounded).

**Practical Example D: The Strength of the Residual Value**
**Scenario:** 5.56x45mm M855 ammo against 6B23 Armor

* **Bullet Penetration Status:** 34 (Level 3, with residual value 4)
* **Armor Class:** 4

**Step 1 (Finding Coefficient 'X'):**

* `[4 (Armor Class) × 10] + 5 = 45 (Base Resistance)`.
* `45 (Base Resistance) - 34 (Penetration Status) = 11 (Numerical Difference)`.
* `11 (Numerical Difference) ÷ 10 = 1.1 (Coefficient X)`.

**Step 2 (Applying to the Exponential Curve):**

* `2 to the power of 1.1 (Coefficient X) = 2.143 (Exponential Divisor)`.
* `1 ÷ 2.143 (Exponential Divisor) = 0.4666 (Base Factor)`.
* `0.4666 (Base Factor) × 100 = 46.66% (Penetration Chance)`.
* **Conclusion:** Even though it is an inferior level ammo compared to the armor, its high residual value (4) drastically reduces the mathematical punishment of the curve, raising the penetration chance to almost **46.66%** right on the first impact.