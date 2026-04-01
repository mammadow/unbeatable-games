# 🤝 Komanda Üçün GitHub İş Axını

## 1️⃣ Branch Strategiyası (Git Flow)

```
main          ← YALNIZ PRODUCTION (birbaşa push YASAQDIR! 🔒)
develop       ← aktiv inkişaf branchi
feature/*     ← hər yeni xüsusiyyət
fix/*         ← bug düzəltmələri
hotfix/*      ← kritik production problemləri
```

### Komanda Rolları

| Üzv | Sahə | Branch Prefiksi | Məs. |
|-----|------|-----------------|------|
| **Elnur** | Frontend, UI/UX | `feature/ui-*` | `feature/ui-leaderboard-page` |
| **Mahammad** | Tic Tac Toe, AI | `feature/ai-*` | `feature/ai-chess-engine` |
| **Haci** | Number Target, Connect Four | `feature/game-*` | `feature/game-connect-four` |

---

## 2️⃣ Gündəlik İş Axını

### Sabah (Yeni tapşırıq başlamaq)

```bash
# 1. Başlamaq üncə, develop-ü yeniləmə
git checkout develop
git pull origin develop

# 2. Öz feature branch-ı yarat
git checkout -b feature/tapsirig-adi

# Məs: Elnur leaderboard page yazacaqsa
git checkout -b feature/ui-leaderboard-page
```

### Gün ərzində (Commit etmə)

```bash
# Hər meaningful dəyişiklik üçün commit et
git add .
git commit -m "feat: add leaderboard filtering by game type"

# Commit mesajı formatı:
# feat:    yeni xüsusiyyət
# fix:     bug düzəltmə
# docs:    dokumentasiya
# style:   formatting (kod dəyişməyib)
# refactor: kod yenidən yazılıb
# test:    testlər əlavə etmə
```

### Axşam (Push + PR)

```bash
# İş bitdikdən sonra push et
git push origin feature/ui-leaderboard-page

# GitHub-da PR aç:
# 1. Repo → Pull requests → New PR
# 2. Compare: feature/ui-leaderboard-page → develop (NOT main!)
# 3. PR template-i doldur (aşağıda)
```

---

## 3️⃣ Pull Request (PR) Prosesi

### PR açanda istifadə ediləcək template:

```markdown
## 📌 Başlıq
Qısa açıqlama: Nə əlavə etdin?

## 🔗 Bağlı Issue
Closes #23
(əgər issue varsa)

## ✅ Testlər
- [ ] Local-da işləyir
- [ ] Console error-u yoxdur
- [ ] Mobile-da test edilib (əgər UI-sa)
- [ ] Bütün oyunlar açılır

## 📸 Screenshots (əgər UI dəyişlikləri varsa)
[screenshots buraya]

## 🤔 Necə review etmək olar?
1. Local-da feature branch-ı pull et
2. `npm install` + `npm run dev` aç
3. Davranışı test et
4. Kod oxu

## ⚠️ Breaking Changes?
- [ ] Yox
- [ ] Bəli, belə ki: [açıqlama]
```

### PR Review Qaydaları

✅ **Hər PR-ina 1 komanda üzvü review etməlidir**
- "LGTM" yazmaq yetərli DEYİL — konkret şərh yaz
- Kodda problem varsa: `Request changes` seç
- Yaxşıdırsa: `Approve` seç

```
Yaxşı review şərhi:
❌ LGTM

✅ Kod rahat oxunur. Bir neçə issue:
   1. Line 45-də memory leak risk var, async await lazım
   2. TypeScript type missing: userData parameter
   3. Test coverage 60% ol bilər: unit tests əlavə et

   Düzəltdikdən sonra re-review edəm ✅
```

### PR Merge Qaydaları

```
✅ Merge etmɘ üncə:
   1. CI/CD green olmalı (testlər keçməli) ✅
   2. ən azı 1 approve olmalı ✅
   3. Conflict olmamalı ✅
   4. develop-ə merge edilməli (main-ə YOXDUR!)

Merge seçimi: "Squash and merge" seç
→ Tüm commit-lər 1 clean commit-ə çevrilir
```

---

## 4️⃣ GitHub Issues — Tapşırıq İdarə Etməsi

### Issue Template

Repo → Settings → Issues → Add template:

```markdown
## 📋 Tapşırıq Təsviri
Qısa açıqlama...

## 📝 Qəbul Meyarları
- [ ] Tək 1: ...
- [ ] Tələb 2: ...
- [ ] Tələb 3: ...

## 🔧 Texniki Detallar
- Fayllar əlaqəli: `/src/games/`, `/src/ui/`
- Vaxt: ~2 saat

## 📌 Priority
High / Medium / Low

## 👤 Təyin edilib
@elnur / @mahammad / @haci
```

### Kanban Board (Projects)

Repo → Projects → New Project → Board:

```
📥 Backlog     → 🔨 In Progress  → 👀 Under Review  → ✅ Done
   (5 issues)      (1 active)       (2 pr-da)         (8 bitib)
```

**Gündəlik rutini:**
- Suat əvvəli: Backlog-dan 1 issue seç → "In Progress" daşı
- Hazırladıqda: PR aç → "Under Review" daşı
- PR merge olduqda: "Done"-a daşı

---

## 5️⃣ Branch Protection Rules (Kritik!)

Repo → Settings → Branches → Add branch protection rule:

### main branchi üçün:
```
✅ Require a pull request before merging
✅ Require approvals: 1 review
✅ Require status checks to pass (CI/CD)
✅ Include administrators (admin-lar da bypass edə bilməsin!)
✅ Restrict who can push: Yalnız admins
```

### develop branchi üçün:
```
✅ Require a pull request before merging
✅ Require approvals: 1 review
✅ Require status checks to pass
```

**Nə istəyir bu?**
- Heç kim birbaşa main-ə push edə bilməz
- Hər dəyişiklik PR-dan keçməlidir
- Hər PR ən azı 1 adminin aprovesi lazım
- CI testləri sınırsa, merge edilmir
- Kod tapıntısı QAYD edilir

---

## 6️⃣ GitHub Actions — CI/CD Avtomatlaşdırma

`.github/workflows/main.yml` faylı (artıq var):

```yaml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build frontend
        run: npm run build

      - name: Backend tests
        run: cd backend && npm run test

      - name: Security check
        run: npm audit --audit-level=moderate
```

**Nə olur?**
- Hər PR-a avtomatik build + test keçir
- Sınırsa, PR-ı merge etmə deyir
- Green checkmark ✅ görüncə merge et

---

## 7️⃣ CODEOWNERS — Avtomatik Review Sorğusu

`.github/CODEOWNERS` faylı yarat:

```
# Hər file pattern-ə kim review etməli

src/games/tic-tac-toe/     @mahammad
src/games/number-target/   @haci
src/games/connect-four/    @haci
src/ui/                    @elnur
src/context/               @elnur
backend/                   @mahammad @elnur
database/                  @mahammad
```

**Nə olur?**
- Someone PR açdıqda relevant developers avtomatik invite edilir
- Heç kim override edə bilməz — code owner-ə cavabdeh

---

## 8️⃣ Milestones (Fazalar)

Repo → Issues → Milestones:

```
📌 Faza 1 — MVP
   Deadline: Həftə 2
   Status: 4/5 issues bitib ✅
   - [x] Authentication
   - [x] Tic Tac Toe AI
   - [ ] Leaderboard UI

📌 Faza 2 — Backend
   Deadline: Həftə 5

📌 Faza 3 — Deploy
   Deadline: Həftə 8
```

**Issue açanda:**
- Assign milestone
- Priority seç
- Label əlavə et: `backend`, `frontend`, `ai`, `bug`, etc

---

## 9️⃣ Releases (Hər Faza Bitdikdə)

```bash
# Local terminal-da
git tag -a v1.0.0 -m "MVP Release — 3 oyun, auth, leaderboard"
git push origin v1.0.0
```

GitHub-da:
- Releases → Create release
- Tag: v1.0.0 seç
- Title: "MVP — v1.0.0"
- Description: nə yeni (from CHANGELOG)

---

## 🔟 Gündəlik Checklist

**Hər sabah:**
- [ ] `git pull origin develop` — ən yeni kod
- [ ] Slack/Discord-da komanda ilə sinkron ol
- [ ] Öz feature branch-ını yarat

**Gün ərzində:**
- [ ] Meaningful commit-lər et (5x gün ərzində minimal)
- [ ] Sonunda push et
- [ ] PR-ı açıqanda description-u doldur

**PR review etsən:**
- [ ] Kodu oxu, test et
- [ ] Konkret şərh yaz
- [ ] Approve/Request Changes seç
- [ ] Merge-ə hazırsa — Squash and merge seç

**Həftə sonu:**
- [ ] Bütün PR-ları review və merge et
- [ ] Projects board-u yenilə
- [ ] Milestone progress-i yoxla
- [ ] Hansı 3 issue next week olacaq?

---

## 1️⃣1️⃣ Conflict Həlli

Əgər 2 nəfər eyni faylı redaktə etsə:

```bash
# Conflict varsa, şu komandalar:
git pull origin develop
# Merge conflict-ləri icinde görsən, düzəlt

# VSCode-da açıqsan:
# Current Change     ← Sənin kodu
# Incoming Change    ← Other nəfərin kodu
# Both              ← Hər ikisiniz saxla

# Düzəltdikdən sonra:
git add .
git commit -m "fix: resolve merge conflict in leaderboard"
git push origin feature/ui-leaderboard-page
```

---

## 1️⃣2️⃣ Kommunikasyon Qanunları

```
✅ DO:
   • Hər dəyişiklik üçün PR aç
   • PR title-ı aydın yaz: "feat: add chess AI", not "update stuff"
   • Commit message-lər təmiz tut
   • Questions? → GitHub Issues-da sual et
   • PR açanda, əgər WIP-sə: başlığa [WIP] əlavə et

❌ DON'T:
   • main-ə birbaşa push etmə
   • PR-ı approve etmədən merge etmə
   • Başqasının branch-ına push etmə (clone et)
   • Çox yaşlı branch-ları keep etmə (silmə)
   • Səhv commit-lər üçün force push etmə (reset etmə, new commit aç)
```

---

## 🎯 İlk Həftə Setup

**Pazartesi:**
```bash
# Əvvəlcə GitHub repo settings-lərini qur (1 admin)
1. Branch protection rules: main + develop
2. CODEOWNERS file əlavə et
3. Issue + PR templates əlavə et
4. Projects board yaratmaq

# Hər team member:
git clone https://github.com/mammadow/unbeatable-games
git checkout develop
git checkout -b feature/oz-tapsirig
```

**Tiyin ərzində:**
- Hər nəfər öz branch-ında işlə
- Gündəlik 1-2 commit push et
- Müvəqqət problem olsa → GitHub Issues-da report et

**Cümə:**
- PR-ları review et (admin)
- develop-ə merge et
- Milestone progress-i yoxla
- Next week-in 3 issue-sini seç

---

## 📚 GitHub Crib Sheet

```bash
# Yeni feature başlamaq
git checkout develop && git pull && git checkout -b feature/name

# İş bitdikdə
git add . && git commit -m "feat: description"
git push origin feature/name

# PR merge olduqda cleanup
git checkout develop && git pull
git branch -d feature/name
git push origin --delete feature/name

# Qəzət commit (local)
git revert <commit-hash>

# Last commit dəyişdirmə (yalnız local-da!)
git commit --amend

# Develop-dən update almaq
git fetch origin
git rebase origin/develop
```

---

## 🚀 Nəticə

Bu strukturu tətbiq etsəniz:
✅ Kod toqquşmaları minimuma düşür
✅ Hər kəs nə etdiyini bilir
✅ Code history təmiz qalır
✅ Yeni developers qoşmaq asandır
✅ Müəllimlər/müəmmilərinə çox peşəkar görünür

**Questions?** GitHub Discussions-da sual et yaxud team-də diskussiya açın! 🎯
