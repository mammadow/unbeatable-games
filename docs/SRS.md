# Software Requirements Specification (SRS)

## Unbeatable Games Platform

**Version:** 1.0  
**Date:** March 2026  
**Team:** [Team Member Names]

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **Unbeatable Games Platform**, a web-based mini-game collection featuring AI opponents that play optimally using game theory algorithms.

### 1.2 Scope
The platform will include:
- Multiple strategy-based mini-games
- AI opponents using optimal algorithms (Minimax, Dynamic Programming)
- Single-player mode against AI
- Responsive web interface

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| AI | Artificial Intelligence |
| Minimax | Algorithm for minimizing maximum possible loss |
| DP | Dynamic Programming |
| UI | User Interface |
| SPA | Single Page Application |

### 1.4 References
- Game Theory: An Introduction (Tadelis, 2013)
- Artificial Intelligence: A Modern Approach (Russell & Norvig)

---

## 2. Overall Description

### 2.1 Product Perspective
A standalone web application that runs entirely in the browser. No server-side processing required for game logic.

```
┌─────────────────────────────────────┐
│           User Browser              │
├─────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐          │
│  │   UI    │──│  React  │          │
│  └─────────┘  └─────────┘          │
│       │                             │
│  ┌─────────────────────┐           │
│  │    Game Engine      │           │
│  │  ┌───────┐ ┌─────┐  │           │
│  │  │Minimax│ │ DP  │  │           │
│  │  └───────┘ └─────┘  │           │
│  └─────────────────────┘           │
└─────────────────────────────────────┘
```

### 2.2 Product Functions
1. **Game Selection** — Choose from available games
2. **Gameplay** — Play against AI opponent
3. **AI Decision Making** — Optimal move calculation
4. **Result Display** — Win/Lose/Draw outcomes

### 2.3 User Characteristics
- **Primary Users:** Students, casual gamers
- **Technical Level:** No technical knowledge required
- **Age Range:** 10+

### 2.4 Constraints
- Must run in modern web browsers (Chrome, Firefox, Safari, Edge)
- No external API dependencies
- Client-side only (no backend)

### 2.5 Assumptions
- Users have JavaScript enabled
- Stable internet connection for initial load
- Screen resolution minimum 320px width

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR-01: Game Selection
| ID | FR-01 |
|----|-------|
| Description | User shall be able to select a game from available options |
| Input | Click/tap on game card |
| Output | Selected game loads in main area |
| Priority | High |

#### FR-02: Tic Tac Toe Gameplay
| ID | FR-02 |
|----|-------|
| Description | User shall play Tic Tac Toe against AI |
| Input | Click on empty cell |
| Output | User mark placed, AI responds |
| Priority | High |

#### FR-03: Number Target Gameplay
| ID | FR-03 |
|----|-------|
| Description | User shall play Number Target against AI |
| Input | Select number (1-10) |
| Output | Number added to sum, AI responds |
| Priority | High |

#### FR-04: Connect Four Gameplay
| ID | FR-04 |
|----|-------|
| Description | User shall play Connect Four against AI |
| Input | Click on column |
| Output | Disc drops, AI responds |
| Priority | Medium |

#### FR-05: AI Move Calculation
| ID | FR-05 |
|----|-------|
| Description | AI shall calculate optimal move |
| Input | Current game state |
| Output | Best possible move |
| Priority | High |

#### FR-06: Win Detection
| ID | FR-06 |
|----|-------|
| Description | System shall detect win/lose/draw |
| Input | Game state after each move |
| Output | Game result notification |
| Priority | High |

#### FR-07: Game Reset
| ID | FR-07 |
|----|-------|
| Description | User shall be able to restart game |
| Input | Click reset button |
| Output | Game returns to initial state |
| Priority | Medium |

### 3.2 Non-Functional Requirements

#### NFR-01: Performance
| ID | NFR-01 |
|----|--------|
| Description | AI response time |
| Requirement | < 500ms for move calculation |
| Rationale | Smooth user experience |

#### NFR-02: Compatibility
| ID | NFR-02 |
|----|--------|
| Description | Browser support |
| Requirement | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Rationale | Cover 95%+ of users |

#### NFR-03: Responsiveness
| ID | NFR-03 |
|----|--------|
| Description | Mobile support |
| Requirement | Fully functional on 320px+ screens |
| Rationale | Mobile-first approach |

#### NFR-04: Accessibility
| ID | NFR-04 |
|----|--------|
| Description | Reduced motion support |
| Requirement | Respect prefers-reduced-motion |
| Rationale | Accessibility compliance |

#### NFR-05: Reliability
| ID | NFR-05 |
|----|--------|
| Description | AI correctness |
| Requirement | AI never makes suboptimal moves |
| Rationale | Core value proposition |

---

## 4. System Features

### 4.1 Tic Tac Toe

**Description:** Classic 3x3 grid game with unbeatable AI.

**Algorithm:** Minimax with full tree search

**Data Structures:**
- `board`: 3x3 array (9 cells)
- `state`: enum {EMPTY, X, O}

**Pseudocode:**
```
function minimax(board, depth, isMaximizing):
    if terminal_state(board):
        return evaluate(board)
    
    if isMaximizing:
        best = -∞
        for each empty cell:
            make_move(cell, AI)
            best = max(best, minimax(board, depth+1, false))
            undo_move(cell)
        return best
    else:
        best = +∞
        for each empty cell:
            make_move(cell, PLAYER)
            best = min(best, minimax(board, depth+1, true))
            undo_move(cell)
        return best
```

**Complexity:**
- Time: O(9!) worst case, ~O(9^4) with pruning
- Space: O(9) for board state

### 4.2 Number Target

**Description:** Two players alternate choosing numbers 1-10, sum accumulates, first to reach 100 wins.

**Algorithm:** Dynamic Programming / Mathematical Analysis

**Winning Strategy:**
- Winning positions: 100, 89, 78, 67, 56, 45, 34, 23, 12, 1
- Pattern: `target % 11 == 1` are winning positions
- Strategy: Always move to make sum ≡ 1 (mod 11)

**Data Structures:**
- `currentSum`: integer
- `targetSum`: integer (default 100)
- `maxChoice`: integer (default 10)

**Pseudocode:**
```
function optimalMove(currentSum, target, maxChoice):
    for choice from 1 to maxChoice:
        newSum = currentSum + choice
        if newSum >= target:
            return choice  // Win immediately
        if (target - newSum) % (maxChoice + 1) == 0:
            return choice  // Reach winning position
    return 1  // No winning move, play minimum
```

**Complexity:**
- Time: O(maxChoice) per move
- Space: O(1)

### 4.3 Connect Four

**Description:** 7x6 grid, players drop discs, first to connect 4 wins.

**Algorithm:** Minimax with Alpha-Beta Pruning + Heuristic Evaluation

**Data Structures:**
- `board`: 7x6 matrix (42 cells)
- `state`: enum {EMPTY, RED, YELLOW}

**Heuristic Evaluation:**
```
function evaluate(board):
    score = 0
    // Check all possible 4-cell windows
    for each window of 4:
        score += evaluateWindow(window)
    // Prioritize center column
    score += centerColumnBonus(board)
    return score

function evaluateWindow(window):
    if window has 4 AI: return +1000
    if window has 3 AI + 1 empty: return +10
    if window has 2 AI + 2 empty: return +2
    if window has 4 opponent: return -1000
    return 0
```

**Complexity:**
- Time: O(b^d) where b=7 (branching), d=depth limit
- Space: O(42) for board state

---

## 5. External Interface Requirements

### 5.1 User Interface

**Main Screen:**
```
┌────────────────────────────────────────────┐
│  ⚡ Unbeatable    [TTT] [NUM] [C4]         │
├────────────────────────────────────────────┤
│                                            │
│         Play Against Perfect AI            │
│                                            │
│    ┌──────────────────────────────┐        │
│    │                              │        │
│    │        Game Board            │        │
│    │                              │        │
│    └──────────────────────────────┘        │
│                                            │
│    [Game 1]  [Game 2]  [Game 3]           │
│                                            │
│    🧠 Minimax  ⚡ Instant  🎯 Optimal      │
│                                            │
├────────────────────────────────────────────┤
│           Capstone Project • 2026          │
└────────────────────────────────────────────┘
```

### 5.2 Hardware Interfaces
- None (runs in browser)

### 5.3 Software Interfaces
- Modern web browser with JavaScript ES6+ support

### 5.4 Communication Interfaces
- HTTP/HTTPS for initial page load
- No API calls during gameplay

---

## 6. Other Requirements

### 6.1 Legal Requirements
- Open source (MIT License)
- No data collection
- No cookies required

### 6.2 Documentation
- README with setup instructions
- Inline code comments
- Algorithm explanations in docs/

---

## Appendix A: Use Case Diagrams

```
        ┌─────────┐
        │  User   │
        └────┬────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐
│Select │ │ Play  │ │ View  │
│ Game  │ │ Game  │ │Result │
└───────┘ └───┬───┘ └───────┘
              │
              ▼
        ┌───────────┐
        │ AI Makes  │
        │   Move    │
        └───────────┘
```

## Appendix B: State Diagram (Tic Tac Toe)

```
┌──────────┐    select     ┌──────────┐
│   Idle   │──────────────▶│  Player  │
└──────────┘               │   Turn   │
     ▲                     └────┬─────┘
     │                          │ move
     │                          ▼
     │                     ┌──────────┐
     │      game over      │   AI     │
     └─────────────────────│   Turn   │
                           └────┬─────┘
                                │ move
                                ▼
                           ┌──────────┐
                           │  Check   │
                           │   Win    │
                           └──────────┘
```

---

**Document End**
