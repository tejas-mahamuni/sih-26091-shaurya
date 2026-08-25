# SIH 2026 — PS 26091 | Team Shaurya

Private repository contribution guide.

## 1. Workflow Synopsis

**Clone → Sync `main` → Create branch → Code → Commit → Push branch → Create PR → Review → Merge → Sync `main`**

> ⚠️ **NEVER commit directly to `main`.**
>
> ⚠️ **NEVER push directly to `main`.**
>
> All changes must reach `main` through a Pull Request and review.

---

## 2. First-Time Setup

### Clone the repository

```bash
git clone https://github.com/tejas-mahamuni/sih-26091-shaurya.git
cd sih-26091-shaurya
```

Check the remote:

```bash
git remote -v
```

You should see:

```text
origin  https://github.com/tejas-mahamuni/sih-26091-shaurya.git (fetch)
origin  https://github.com/tejas-mahamuni/sih-26091-shaurya.git (push)
```

Because you are a collaborator on the private repository, you can clone and push branches to it.

---

## 3. Before Starting Any New Task

Always start from the latest `main`.

```bash
git switch main
git pull origin main
```

Check:

```bash
git status
```

Your working tree should be clean before creating a new branch.

---

## 4. Create Your Feature Branch

**Do not work directly on `main`.**

```bash
git switch -c feature/<your-task>
```

Examples:

```bash
git switch -c feature/frontend
git switch -c feature/backend-api
git switch -c feature/ai-analysis
git switch -c feature/database
git switch -c feature/financial-engine
```

For bug fixes:

```bash
git switch -c fix/<issue-name>
```

Example:

```bash
git switch -c fix/emi-calculation
```

---

## 5. Work on Your Task

Make changes only on your feature/fix branch.

Check changed files:

```bash
git status
```

Review changes:

```bash
git diff
```

---

## 6. Commit Your Changes

```bash
git add .
git status
git commit -m "feat: add business feasibility module"
```

### Commit examples

```text
feat: add business feasibility module
feat: implement financial calculator
feat: add village location search
fix: correct loan eligibility calculation
fix: resolve API response error
docs: update project setup
refactor: improve recommendation service
test: add financial calculation tests
```

### Never commit

```text
.env
API keys
passwords
database credentials
private credentials
large generated files
```

---

## 7. Push Your Branch

```bash
git push -u origin feature/<your-task>
```

Example:

```bash
git push -u origin feature/frontend
```

**Do not push to `main`.**

---

# 8. Create a Pull Request

Open:

```text
https://github.com/tejas-mahamuni/sih-26091-shaurya
```

Click **Compare & pull request**, or go to:

**Pull requests → New pull request**

Make sure the direction is:

```text
YOUR FEATURE BRANCH
        ↓
      main
```

Example:

```text
feature/frontend → main
```

### PR title

```text
feat: implement frontend onboarding flow
```

### PR description

```md
## Changes
- Added onboarding form
- Added location selection
- Added business category selection

## Testing
- Tested locally
- No build errors

## Notes
- Ready for review
```

---

# 9. Pull Request Review Rules

Every PR must be reviewed before merging.

### Code

- [ ] Code works locally
- [ ] Code follows project structure
- [ ] No unnecessary files
- [ ] No hard-coded secrets
- [ ] No `.env` committed
- [ ] Existing functionality is not unnecessarily broken

### Testing

- [ ] Feature tested locally
- [ ] Existing functionality checked
- [ ] Build/tests pass where applicable

### Integration

- [ ] No unresolved merge conflicts
- [ ] PR is based on the latest `main`
- [ ] Changes are relevant to the assigned task

---

# 10. If Changes Are Requested

Continue working on the **same branch**.

```bash
git switch feature/<your-task>
```

Make the requested changes:

```bash
git add .
git commit -m "fix: address review comments"
git push
```

The existing PR will automatically update.

---

# 11. If PR Is Approved

After review and approval:

```text
PR
 ↓
Review
 ↓
Approved
 ↓
Merge Pull Request
 ↓
main
```

The repository maintainer/version-control manager performs the merge.

### Preferred merge method

Use:

> **Squash and merge**

when a PR contains many small/fix commits and the final feature should appear as one clean commit in `main`.

---

# 12. After a PR Is Merged

Everyone must update their local `main` before starting another task.

```bash
git switch main
git pull origin main
```

Then create a new branch:

```bash
git switch -c feature/<next-task>
```

---

# 13. Complete Daily Workflow

```bash
# 1. Go to main
git switch main

# 2. Get latest code
git pull origin main

# 3. Create your own branch
git switch -c feature/<task-name>

# 4. Work on the task

# 5. Check changes
git status
git diff

# 6. Stage changes
git add .

# 7. Commit
git commit -m "feat: describe your change"

# 8. Push branch
git push -u origin feature/<task-name>

# 9. Create Pull Request on GitHub

# 10. Wait for review

# 11. Resolve review comments if required

# 12. After approval, PR is merged

# 13. Sync main
git switch main
git pull origin main
```

---

# 14. Important Rules

## Rule 1 — Never commit on `main`

❌ Don't:

```bash
git switch main
# edit files
git add .
git commit -m "..."
```

✅ Do:

```bash
git switch main
git pull origin main
git switch -c feature/my-task
```

---

## Rule 2 — Never push directly to `main`

❌ Don't:

```bash
git push origin main
```

✅ Do:

```bash
git push origin feature/my-task
```

Then create a PR.

---

## Rule 3 — One task = One branch

Good:

```text
feature/frontend
feature/backend-api
feature/ai-analysis
fix/login
```

Avoid putting unrelated work into one branch.

---

## Rule 4 — Keep branches focused

A PR should ideally represent one logical feature/fix.

Avoid:

```text
feat: frontend + database + AI + README + random fixes
```

Prefer separate PRs when the work is unrelated.

---

## Rule 5 — Pull before starting new work

Always:

```bash
git switch main
git pull origin main
```

Then create your branch.

---

## Rule 6 — Never commit secrets

Never commit:

```text
.env
.env.local
API keys
passwords
JWT secrets
cloud credentials
database credentials
```

Use environment variables instead.

---

# 15. Recommended Branch Structure

```text
main 🔒
│
├── feature/frontend
├── feature/backend-api
├── feature/ai-analysis
├── feature/database
├── feature/financial-engine
├── feature/geospatial
│
├── fix/login
└── fix/calculation
```

Branches are temporary working spaces.

Once a PR is merged, the branch can normally be deleted.

---

# 16. Main Branch Protection

The repository maintainer should configure GitHub rules for `main`.

Recommended rules:

- ✅ Require Pull Request before merging
- ✅ Require at least 1 approval
- ✅ Require conversation resolution
- ✅ Prevent direct pushes to `main`
- ✅ Require status checks once CI/testing is configured

The goal is:

```text
                  main 🔒
                    ▲
                    │
                 PR only
                    │
              feature branch
                    ▲
                    │
                  commit
                    ▲
                    │
                   code
```

No direct path from a developer's working directory to `main`.

---

# 17. Quick Cheat Sheet

### Start work

```bash
git switch main
git pull origin main
git switch -c feature/my-task
```

### Save work

```bash
git add .
git commit -m "feat: description"
```

### Push

```bash
git push -u origin feature/my-task
```

### Create PR

```text
GitHub
→ Pull Requests
→ New Pull Request
→ feature/my-task → main
→ Create Pull Request
```

### After merge

```bash
git switch main
git pull origin main
```

---

# Team Shaurya Golden Rule

> **No direct commits to `main`. No direct pushes to `main`. Every change goes through a branch → Pull Request → review → approval → merge.**
