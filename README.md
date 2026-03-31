<div align="center">

# ⚡ Unbeatable Games Platform

### *AI-powered mini-games you cannot beat*

[![Stage](https://img.shields.io/badge/Stage-1%20Proposal-gold?style=for-the-badge)](#-capstone-milestones)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)

<br />

**🎯 Minimax AI** · **🧠 Optimal Strategy** · **⚡ Instant Response**

<br />

[Quick Start](#-quick-start) · [Requirements](#-software-requirements) · [Team](#-team)

---

</div>

<br />

## 📖 Table of Contents

- [The Games](#-the-games)
- [Architecture](#️-architecture)
- [Algorithms & Data Structures](#-algorithms--data-structures)
- [Quick Start](#-quick-start)
- [Software Requirements](#-software-requirements)
- [Project Structure](#-project-structure)
- [Capstone Milestones](#-capstone-milestones)
- [Team](#-team)
- [Timeline](#-timeline)
- [Evaluation Criteria](#-evaluation-criteria)

<br />

---

## 🎮 The Games

<table>
<tr>
<td width="33%" align="center">

### ✕ Tic Tac Toe
**Minimax Algorithm**

Classic 3×3 grid game with an unbeatable AI opponent. Uses complete game tree search.

`O(9!)` → `O(n)` with pruning

</td>
<td width="33%" align="center">

### ∑ Number Target
**Dynamic Programming**

Race to 100 — pick numbers 1-10, first to reach the target wins. Mathematical optimal strategy.

`winning = n % 11 == 1`

</td>
<td width="33%" align="center">

### ◉ Connect Four
**Heuristic Search**

Drop discs in a 7×6 grid. Connect 4 to win. Alpha-beta pruning with position evaluation.

`depth-limited minimax`

</td>
</tr>
</table>

<br />

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │    React    │───▶│    Game     │───▶│     AI      │  │
│  │     UI      │    │    State    │    │   Engine    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                     │         │
│         │           ┌─────────────┐           │         │
│         └──────────▶│   Minimax   │◀──────────┘         │
│                     │     DP      │                     │
│                     └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
                           │
                    No Backend Needed
```

<br />

---

## 📊 Algorithms & Data Structures

| Game | Algorithm | Data Structure | Time Complexity | Space |
|:-----|:----------|:---------------|:----------------|:------|
| Tic Tac Toe | Minimax | 3×3 Matrix | O(9!) worst | O(9) |
| Number Target | DP / Math | Integer state | O(1) per move | O(1) |
| Connect Four | α-β Minimax | 7×6 Matrix | O(b^d) | O(42) |

### Why These Choices?

**Minimax** — Proven optimal for perfect-information zero-sum games. Guarantees AI never loses.

**Dynamic Programming** — Number Target has overlapping subproblems. The winning positions follow pattern `target % (max+1) == 1`.

**Alpha-Beta Pruning** — Reduces Connect Four search space by ~50%, enabling deeper look-ahead.

<br />

---

## 📋 Software Requirements Specification

### Functional Requirements

| ID | Requirement | Priority |
|:---|:------------|:---------|
| **FR-01** | User can select a game from available options | High |
| **FR-02** | User can play Tic Tac Toe against AI | High |
| **FR-03** | User can play Number Target against AI | High |
| **FR-04** | User can play Connect Four against AI | Medium |
| **FR-05** | AI calculates optimal move within 500ms | High |
| **FR-06** | System detects win/lose/draw conditions | High |
| **FR-07** | User can restart game at any time | Medium |

### Non-Functional Requirements

| ID | Requirement | Specification |
|:---|:------------|:--------------|
| **NFR-01** | Performance | AI response < 500ms |
| **NFR-02** | Compatibility | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **NFR-03** | Responsiveness | Functional on screens 320px+ width |
| **NFR-04** | Accessibility | Supports prefers-reduced-motion |
| **NFR-05** | Reliability | AI never makes suboptimal moves |

### Algorithm Implementations

#### Tic Tac Toe — Minimax

```javascript
function minimax(board, depth, isMaximizing) {
    if (terminal_state(board)) {
        return evaluate(board);
    }
    
    if (isMaximizing) {
        let best = -Infinity;
        for (each empty cell) {
            make_move(cell, AI);
            best = max(best, minimax(board, depth+1, false));
            undo_move(cell);
        }
        return best;
    } else {
        let best = +Infinity;
        for (each empty cell) {
            make_move(cell, PLAYER);
            best = min(best, minimax(board, depth+1, true));
            undo_move(cell);
        }
        return best;
    }
}
```

**Time Complexity:** O(9!) worst case → O(n) with alpha-beta pruning  
**Space Complexity:** O(9) for board state

#### Number Target — Dynamic Programming

```javascript
function optimalMove(currentSum, target, maxChoice) {
    // Winning strategy: make sum % (maxChoice + 1) == 1
    for (let choice = 1; choice <= maxChoice; choice++) {
        let newSum = currentSum + choice;
        if (newSum >= target) return choice;  // Win immediately
        if ((target - newSum) % (maxChoice + 1) === 0) {
            return choice;  // Force winning position
        }
    }
    return 1;  // No winning move available
}
```

**Time Complexity:** O(maxChoice) per move = O(1) constant time  
**Space Complexity:** O(1)

#### Connect Four — Heuristic Minimax with Alpha-Beta

```javascript
function evaluate(board) {
    let score = 0;
    
    // Check all possible 4-cell windows
    for (each window of 4 cells) {
        if (window has 4 AI discs) score += 1000;
        if (window has 3 AI + 1 empty) score += 10;
        if (window has 2 AI + 2 empty) score += 2;
        if (window has 4 opponent) score -= 1000;
    }
    
    // Prioritize center column
    score += centerColumnCount(board) * 3;
    return score;
}
```

**Time Complexity:** O(b^d) where b=7 branches, d=search depth  
**Space Complexity:** O(42) for board state

<br />

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/unbeatable-games.git
cd unbeatable-games

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Requirements:** Node.js 18+, npm

**Runs on:** Windows, macOS, Linux — any modern browser

<br />

---

## 📁 Project Structure

```
unbeatable-games/
├── src/
│   ├── App.jsx          # Main application with interactive game boards
│   ├── main.jsx         # React entry point
│   └── styles.css       # Animations & responsive styles
├── docs/
│   ├── context-log.md   # Development history (internal)
│   └── Capstone Project.docx  # Assignment document
├── dist/                # Production build (generated)
├── index.html           # HTML entry
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
└── .gitignore           # Git ignore rules
```

<br />

---

## 📋 Capstone Milestones

| Stage | Deliverable | Weight | Status |
|:------|:------------|:-------|:-------|
| **1** | Proposal | 1 bal | ✅ Ready |
| **2** | Progress Report | 2 bal | ⏳ Week 11 |
| **3** | Final Submission | 6 bal | ⏳ Week 15 |

### Stage 1 Checklist

- [x] Problem description
- [x] Project goals  
- [x] Data structures & algorithms
- [x] Expected results
- [x] Work timeline
- [x] Interactive demo website
- [x] Software Requirements Specification (in README)

<br />

---

## 👥 Team

| Member | Responsibility |
|:-------|:---------------|
| **Elnur Mammadov** | Platform architecture, UI/UX |
| **Mahammad Alakbarli** | Tic Tac Toe, Minimax implementation |
| **Haci Faracov** | Number Target, Connect Four, Documentation |

<br />

---

## 📅 Timeline

```
Week 5-7   ████████░░░░░░░░░░░░  Proposal (Current)
Week 7-10  ░░░░░░░░████████░░░░  Core Implementation
Week 10-11 ░░░░░░░░░░░░░░██░░░░  Progress Report
Week 11-14 ░░░░░░░░░░░░░░░░████  Polish & Testing
Week 15    ░░░░░░░░░░░░░░░░░░██  Final Submission
```

<br />

---

## 🎯 Evaluation Criteria

| Criterion | Weight | Our Approach |
|:----------|:-------|:-------------|
| **Algorithmic Correctness** | 30% | Minimax is mathematically proven optimal |
| **Data Structure Choice** | 20% | Matrix for boards, DP for states — justified |
| **Code Quality** | 20% | Modular React components, documented |
| **Testing & Analysis** | 15% | Unit tests, performance benchmarks |
| **Presentation** | 15% | Interactive demo + this README |

<br />

<br />

---

<div align="center">

### Built with 🧠 for Capstone 2026

**Data Structures & Algorithms**

**Team:** Elnur Mammadov · Mahammad Alakbarli · Haci Faracov

---

[⬆ Back to Top](#-unbeatable-games-platform)

</div>
