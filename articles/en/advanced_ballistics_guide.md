# Advanced Ballistics Guide: Understanding Damage, Range, and Damage Drop-off

Understanding how your shot behaves at a distance is the difference between taking down a target or just scratching their armor. In this guide, we will demystify how the game calculates range, damage, and why the Shooting Range often seems to give confusing information.

## The Golden Rule: Weapon vs. Ammo
The first thing you need to understand to build your loadout is the division of roles:

* **The WEAPON dictates the Distance and the Damage Modifier:** The barrel and the weapon define the effective range and can buff, nerf, or not interfere with the bullet's original damage.
* **The AMMO dictates the Damage:** It's the projectile that defines the base destructive power of your shot. 

## The 3 Stages of Trajectory (Data Types)
When you shoot, the bullet doesn't lose damage linearly from the moment it leaves the barrel. The trajectory is divided into three phases perfectly calculated by the game's *engine*:

1. **Initial Data (The Ballistic Ceiling):** This is the maximum damage of your ammo. The bullet maintains **100% of this power** from the weapon's barrel up to the limit distance of its effective range.
2. **Intermediate Data (The Drop):** This is the transition zone. Upon crossing the Initial Range limit, the bullet begins to lose power rapidly. These are the damage drop "steps".
3. **Final Data (The Ballistic Floor):** This is the final distance where the bullet reaches its minimum damage. From this point on, the bullet stabilizes again and **loses no more damage**, regardless of the distance.

---

## The Rule of Absolute Stability and the Decimal "Chaos"
The biggest problem when testing weapons in the game is that **the interface hides the distance decimals** (e.g., 12.1m, 12.8m). The screen only shows "12m". 

> For an Initial or Final Damage to be considered truly **"stable"**, the damage value must be exactly the same throughout that entire meter (from 12.0m to 12.9m). If there is any fluctuation within that same whole meter, it is still part of the Intermediate Data.

### Practical Visual Example
Analyze the behavior of a bullet with an Initial Range of 11m and a Base Damage of 74:

```text
DAMAGE:  74--- 74--- 74--- 72--- 70--- 66--- 64--- 60--- 59--- 57--- 52--- 52--- 52--- 52   
         |     |     |     |     |     |     |     |     |     |     |     |     |     |    
METERS:  0m    11m   12m   12m   12m   12m   12m   12m   12m   13m   13m   14m   25m   ∞    
```

**Legend:**
* **INITIAL (0 to 11m):** The ballistic ceiling. Maximum power (74) constant before the drop.
* **INTERMEDIATE (12m to 13m):** The transition zone (drop from 72 down to 57). The game shows "12m", but the bullet is traveling through invisible decimals (12.1, 12.5, 12.9...).
* **FINAL (14m onwards):** The ballistic floor. Minimum damage (52), stabilized and permanent for the rest of the trajectory.

---

## The Engine's Math: How Does the Drop Work?
The chaos of the Intermediate Data might seem random in the Shooting Range, but it obeys strict mathematical rules hidden in the game's code. 

Knowing these rules, you will never have to guess the power of your shot again:

* **The 3-Meter Law:** The transition zone (Intermediate Data) is extremely short. The damage drops from its absolute maximum to its absolute minimum within a space of **exactly 3 meters**.
* **The 30% Law (The Damage Floor):** The loss of power is not infinite. At the end of the 3-meter drop, the projectile loses exactly **30% of its original power**. In other words, the Final Data of any shot is always **70% of the base damage**.

---

## The Formulas in Practice
Thanks to the *engine's* math, you can discover exactly what the minimum damage and range (the Ballistic Floor) of any weapon will be by applying two direct formulas to your Initial Data, respecting the game's rounding rule.

**1. Final Range Calculation:**
```text
Initial Range + 3 meters = Final Range
```

**2. Final Damage Calculation and Rounding:**
```text
Initial Damage * 0.70 = Final Damage
```

Since the *engine* doesn't display decimal numbers on the screen, you must round the final result following this strict rule:

* **Fraction from .1 to .4:** Round **down**. The decimal is cut off. (Ex: *34.3 becomes 34*).
* **Fraction from .5 to .9:** Round **up**. Goes up to the next integer. (Ex: *30.8 becomes 31* | *24.5 becomes 25*).

### Complete Calculation Example
If your weapon has a Guaranteed Maximum Damage of **84** up to **83 meters**:

* *Finding the Range:* `83 + 3 = 86 meters`
* *Finding the Damage:* `84 * 0.70 = 58.8` *(By the .5 to .9 rounding rule, the value goes up to 59)*

This means the ballistics system has an absolute initial anchor of 84 damage at 83 meters. The degradation occurs gradually in the void between 83m and 86m, permanently stabilizing at 59 damage from the final mark onwards, completely eliminating the need to rely on inaccurate physical distances in the Shooting Range.