<div align="center">

# ⚡ Unbeatable Games Platform

### *AI-powered mini-games you cannot beat*

[![Stage](https://img.shields.io/badge/Stage-1%20Proposal-gold?style=for-the-badge)](docs/proposal-simple.md)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)

<br />

**🎯 Minimax AI** · **🧠 Optimal Strategy** · **⚡ Instant Response**

<br />

[View Demo](#-quick-start) · [SRS Document](docs/SRS.md) · [Proposal](docs/proposal-simple.md)

---

</div>

<br />

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
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── styles.css       # Animations & responsive styles
├── docs/
│   ├── SRS.md           # Software Requirements Specification
│   ├── proposal-simple.md   # Project proposal (Azerbaijani)
│   └── stage1-plan.md   # Detailed project plan
├── index.html           # HTML entry
├── package.json         # Dependencies
└── vite.config.js       # Build configuration
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

<br />

---

## 👥 Team

| Role | Responsibility |
|:-----|:---------------|
| **Member 1** | Platform architecture, UI/UX |
| **Member 2** | Tic Tac Toe, Minimax implementation |
| **Member 3** | Number Target, Connect Four, Documentation |

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

---

## 📚 Documentation

| Document | Description |
|:---------|:------------|
| [SRS.md](docs/SRS.md) | Software Requirements Specification |
| [proposal-simple.md](docs/proposal-simple.md) | Formal proposal (Azerbaijani) |
| [stage1-plan.md](docs/stage1-plan.md) | Detailed project plan |
| [context-log.md](docs/context-log.md) | Development history |

<br />

---

<div align="center">

### Built with 🧠 for Capstone 2026

**Data Structures & Algorithms**

---

[⬆ Back to Top](#-unbeatable-games-platform)

</div>
