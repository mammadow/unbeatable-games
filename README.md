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
