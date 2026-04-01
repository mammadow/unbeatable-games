# ⚡ GitHub Quick Reference — Hər Gün

## 🌅 Sabah (Start Day)

```bash
# 1. Latest code-u al
git checkout develop
git pull origin develop

# 2. Yeni branch yarat
git checkout -b feature/descriptive-name-here
```

**Feature names:**
- `feature/ui-leaderboard-page`
- `feature/ai-chess-engine`
- `feature/game-score-fixes`

---

## 💻 Gün ərzində (Throughout Day)

```bash
# İş əldə edəndən sonra commit et (5x gün ərzində minimal)
git add .
git commit -m "feat: add score counter to tic tac toe"

# Commit əvvəlində tip yaz: feat, fix, docs, style, refactor, test
```

---

## 🌆 Axşam (End of Day)

```bash
# Push et GitHub-a
git push origin feature/your-branch-name

# GitHub-da PR aç:
# 1. https://github.com/mammadow/unbeatable-games
# 2. Pull requests → New PR
# 3. YOUR FEATURE → develop (NOT main!)
# 4. Başlıq + Description doldur
# 5. Create pull request
```

---

## ✅ PR Checklist

**PR açanda:**
- [ ] Title: Descriptive (e.g., "feat: add JWT token refresh")
- [ ] Description: Use template
- [ ] Tests: Mark checklist items
- [ ] Screenshots: Add if UI changes
- [ ] No conflicts ✅
- [ ] CI/CD green ✓

---

## 👥 Code Review Got?

**Sənə PR review sorğusu gəlsə:**

```bash
1. İnternet-də yorum oxu
2. Local-da test et:
   git fetch origin
   git checkout feature/branch-name
   npm install
   npm run dev

3. GitHub-da approve/request changes seç
   Give specific feedback!
```

---

## 🚫 Çətin Durumlar

### Conflict varsa?

```bash
git pull origin develop
# VSCode-da "Current" vs "Incoming" seç
git add .
git commit -m "fix: resolve merge conflict"
git push origin feature/your-branch
```

### Səhv commit?

```bash
# Merge olmamış əgər:
git reset --soft HEAD~1    # Last commit-i geri al
git add . && git commit -m "corrected message"

# ASLA: git push --force (production qaydıyır!)
```

### Başqasının branch-ı lazımdır?

```bash
git clone https://github.com/mammadow/unbeatable-games
cd unbeatable-games
git checkout feature/someone-elses-branch
```

---

## 📊 GitHub Statuses

| Status | Mean |
|--------|------|
| 🟢 All checks passed | Approve + merge! |
| 🟡 Checks running... | Wait for CI |
| 🔴 Some checks failed | Fix errors first |
| 🟠 Waiting for review | Team review-ə gözlə |
| ✅ Approved | Go ahead, merge |

---

## 🎯 Merge etmə üncə Yoxla

- [ ] CI/CD ✅ green
- [ ] ən azı 1 approve ✅
- [ ] Conflict ❌ yoxdur
- [ ] develop-ə merge ediləcək (main-də DEYİL!)

**Merge seçim:**
```
"Squash and merge" seç
→ Tüm commits 1 clean commit-ə çevrilir
→ History təmiz qalır
```

---

## 📱 Our Team

| Role | Username | Branch | Area |
|------|----------|--------|------|
| Frontend | @elnur | `feature/ui-*` | UI, Auth, Styles |
| Backend | @mahammad | `feature/ai-*` | Tic Tac Toe, API |
| Games | @haci | `feature/game-*` | Connect 4, Number Target |

---

## 🔗 Links

- Docs: TEAM_WORKFLOW.md (full guide)
- Repo: https://github.com/mammadow/unbeatable-games
- Issues: https://github.com/mammadow/unbeatable-games/issues
- Projects: https://github.com/mammadow/unbeatable-games/projects

---

## 💡 Pro Tips

✅ Commit-ləri kiçik tut (1 feature = 1-3 commit)
✅ Açıq başlıq yaz (başqalar anlasın)
✅ PR-ı tez aç (1 gün > 3 gün)
✅ Review-ə cavab ver (ping team-ə)
✅ Outdated branch-ları sil

❌ Force push etmə (başqaların kodu kaybola bilər)
❌ Main-ə birbaşa push etmə
❌ Conflictlər ignorе et
❌ Merge etmədən test etmə

---

**Questions?** → GitHub Issues-da sual et yaxud team-ə yazı at! 🚀
