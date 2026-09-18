# Penetration Damage Calculation System

Armor damage mitigation in *Arena Breakout Infinite* does not rely on a complex physical simulation of kinetic energy loss, but rather on an exact system based on algorithmic steps. This guide breaks down the mathematical formula, teaching you how to calculate the actual damage dealt to a character's body the exact moment a projectile pierces their armor.

## 1. Data Required for the Calculation

To calculate Penetration Damage, you only need to collect **four values** extracted from the game's attributes:

* **Initial Damage (Weapon + Ammo Combo):** The maximum damage value resulting from the combination of the weapon and the bullet, always calculated within the ideal effective range (e.g., 50, 48, 81).
* **Raw Penetration:** The numerical penetration value from the ammo stats (e.g., 34, 40, 52).
* **Ammo Level:** The first digit of the penetration value (e.g., 34 Penetration = Level 3).
* **Armor Class:** The protection level of the target's armor plate (e.g., Class 3, Class 6).

## 2. The Two Control Variables

With the data collected, find the two fundamental mathematical variables:

1. **Level Difference (Diff):** The ballistic advantage or disadvantage upon impact.
* *Formula:* Ammo Level minus Armor Class.
* *(Example: Level 4 Ammo hitting Class 3 Armor results in a Diff of **+1**).*


2. **Penetration Remainder (Remainder):** The exact second digit of the Raw Penetration attribute.
* *Formula:* The remainder of the penetration value divided by 10 (basically, the last digit).
* *(Example: Ammo with **42** Penetration has a Remainder of **2**. **50** Penetration has a Remainder of **0**).*



---

## 3. The Damage Retention Ladder

The game engine analyzes the **Level Difference (Diff)** value and places the impact into one of 5 retention steps to determine the damage multiplier.

*(Note: The "x" symbol represents multiplication)*

* **Step 1: Absolute Over-Penetration (Diff greater than or equal to +2)**
The plate is irrelevant against the projectile's force. The bullet passes clean through.
* **Multiplier:** 1.0 (100% of the Initial Damage passes to the body)


* **Step 2: Slight Dominance (Diff equal to +1)**
The bullet is 1 level higher than the armor. The plate tries to stop it, but fails.
* **Multiplier:** 0.90 + (Remainder x 0.01)


* **Step 3: The Tie (Diff equal to 0)**
The bullet and armor are the same level. The ballistic mesh significantly slows the shot.
* **Multiplier:** 0.65 + (Remainder x 0.005)


* **Step 4: Slight Disadvantage (Diff equal to -1)**
The bullet is 1 level weaker. It only pierces by probability (RNG).
* **Multiplier:** 0.60 + (Remainder x 0.005)


* **Step 5: The Rock Bottom Lock (Diff less than or equal to -2)**
The bullet is 2 or more levels lower. If the plate is cracked and allows penetration, the engine applies the fixed floor.
* **Multiplier:** 0.60 Fixed (the Remainder is ignored)



## 4. The Rounding Calculation

*Arena Breakout Infinite* uses standard mathematical rounding: decimals from .5 and up are rounded up to the next whole number, and .4 and below are rounded down.

**Final Formula:**
Penetration Damage = Round (Initial Damage x Multiplier)

---

## 5. Practical Step-by-Step Examples

### Example A: M4A1 (M855A1 Ammo) vs Class 3 Armor

* **Step 1 (Data Collection):**
* Initial Damage (Combo): **48**
* Raw Penetration: **40** (Level 4)
* Armor Class: **3**


* **Step 2 (Find Variables):**
* Level Difference (Diff): 4 minus 3 = **+1** (Step 2).
* Remainder: The last digit of "40" is **0**.


* **Step 3 (Multiplier):** 0.90 + (0 x 0.01) = **0.90**
* **Step 4 (Final Calculation):** 48 x 0.90 = **43.2**. Rounded down, resulting in **43 Penetration Damage**.

### Example B: SKS (PS Ammo) vs Class 2 Armor

* **Step 1 (Data Collection):**
* Initial Damage (Combo): **58**
* Raw Penetration: **33** (Level 3)
* Armor Class: **2**


* **Step 2 (Find Variables):**
* Level Difference (Diff): 3 minus 2 = **+1** (Step 2).
* Remainder: The last digit of "33" is **3**.


* **Step 3 (Multiplier):** 0.90 + (3 x 0.01) = **0.93**
* **Step 4 (Final Calculation):** 58 x 0.93 = **53.94**. Rounded up, resulting in **54 Penetration Damage**.

### Example C: AK-102 (M855 Ammo) vs Class 6 Armor

* **Step 1 (Data Collection):**
* Initial Damage (Combo): **50**
* Raw Penetration: **34** (Level 3)
* Armor Class: **6**


* **Step 2 (Find Variables):**
* Level Difference (Diff): 3 minus 6 = **-3** (Step 5).


* **Step 3 (Multiplier):** Rock Bottom Lock = **0.60** fixed.
* **Step 4 (Final Calculation):** 50 x 0.60 = **30**. No decimals, resulting in **30 Penetration Damage**.