# 60-Second Turn Timer Upgrade (Millionaire 2-Team Battle)

Increase the turn countdown timer from 30 seconds to a fixed 60 seconds (1 minute) for every team turn—including primary turns, "Steal the Point" (`عَليمه`) opportunities, "Switch the Question" lifeline resets, and the host's manual timer reset button.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both clarifications from Phase 1 have been locked into this plan:

- **Confirmed Decision 1 (Steal Turn Duration)**: Both regular turns and opposing team Steal (`عَليمه`) turns receive a full **60 seconds**.
- **Confirmed Decision 2 (Timer Mode)**: The game uses a **fixed 60-second timer** per turn across all 15 prize levels without extra start-screen configuration clutter.

---

## 1. Overview & Core Concept

- **What It Does**: Extends the per-turn decision window to 60 seconds so teams have a full minute to deliberate, consult teammates, and use lifelines (`50:50`, `Ask the Audience`, `Switch the Question`) before locking in their final answer.
- **Target Audience / Persona**: Game show hosts and two competing teams playing in local multiplayer battle mode.
- **Key Value**: Gives teams comfortable discussion time—especially on Tier 2 (Medium) and Tier 3 (Expert) questions—while preserving the dramatic countdown tension during the final 10 seconds.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Match Start & New Questions**: Each new level initializes the central studio countdown ring at `60`.
  2. **Steal Opportunity Transition**: When the active team locks in a wrong answer (or lets the clock expire) in "Opponent Answers to Steal" mode, the turn transfers to the opposing team and the timer resets to `60`.
  3. **Switch the Question Lifeline**: Activating the Switch lifeline loads a new question from the same tier and resets the active team's clock to `60`.
  4. **Host Timer Reset Control**: Clicking the host reset button beside the countdown ring immediately restores the clock to `60s` (`إعادة 60ث` / `Reset 60s`).
- **Visual Identity & Theme**:
  - Preserves the dark royal blue (`#03091c`), metallic gold (`#d4af37`), and high-contrast studio aesthetic.
  - Uses tabular monospace numerals (`JetBrains Mono`, `tabular-nums`) inside the circular countdown badge so numbers from `60` down to `0` never shift layout width.
- **Interactive Feedback & Motion**:
  - From `60` down to `11` seconds, the timer ring displays in gold (`border-amber-400 text-amber-300`).
  - During the final `10` seconds (`10` down to `1`), the ring transitions to urgent crimson (`border-rose-500 bg-rose-950/70 text-rose-300`) accompanied by Web Audio synthesized countdown ticks.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified 60-Second Constant Across All Turn Resets**
  - *Chosen Approach*: Centralize the turn duration (`TURN_DURATION_SECONDS = 60`) across match initialization, level progression, steal handoffs, question switches, and manual host resets.
  - *Why*: Guarantees zero drift between the state machine, the HUD reset button label (`60s`), and bilingual translations.
  - *Alternatives Considered*: Keeping steal turns at 30 seconds was passed over per user preference for equal 60-second deliberation on steals.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                    Game State Controller (App)                    │
│  • TURN_DURATION_SECONDS = 60                                     │
│  • Resets timeLeft -> 60 on: Start, Next Level, Steal, Switch Q   │
└───────────────┬───────────────────────────────────┬───────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      Studio HUD Component     │   │  Bilingual UI Dictionary      │
│  • Circular 60s Countdown     │   │  • AR: "إعادة 60ث"            │
│  • Host Pause / Resume Toggle │   │  • EN: "Reset 60s"            │
│  • Host "60s" Quick Reset Btn │   └───────────────────────────────┘
└───────────────────────────────┘
```

### Interactive Component & State Mapping

- **Match & Turn Lifecycle**:
  - Starting a new battle, advancing to the next level (`1..15`), triggering `TRIGGER_STEAL_CHANCE`, or activating the `Switch Question` lifeline sets `timeLeft` to `60` and unpauses the timer.
- **Host Controls in Studio HUD**:
  - The manual reset button updates `timeLeft` to `60` and displays `60s` (`إعادة 60ث` in Arabic / `Reset 60s` in English).
