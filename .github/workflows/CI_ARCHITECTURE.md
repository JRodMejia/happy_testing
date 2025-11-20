# CI/CD Pipeline Architecture - Smart Single Pipeline

## 🔄 Optimized Pipeline Flow

```
Git Push/PR to main
         ↓
   Path Filter Detection (detect-changes job)
         ↓
    ┌────┴────┬────────────┬─────────────┐
    ↓         ↓            ↓             ↓
api: true  cypress: true playwright: true  (booleans)
    ↓         ↓            ↓             ↓
    └─────────┼────────────┘
              ↓
         lint (runs once)
              ↓
         build (runs once if UI tests needed)
              ↓
    ┌─────────┼────────────┐
    ↓         ↓            ↓
┌────────┐ ┌──────┐  ┌──────────┐
│API Tests│Cypress │  │Playwright│  (conditional execution)
│ (if api)│(if cy) │  │(if pw)   │
└────────┘ └──────┘  └──────────┘
```

## 📋 Workflow Architecture

### Primary Workflow: `main-ci.yml` ⭐

**Triggers:**
- Automatic on push to `main`

**Jobs:**

#### 1️⃣ detect-changes (Path Filter)
Analyzes modified files and outputs boolean flags:
- `api: true/false` - API tests needed?
- `cypress: true/false` - Cypress tests needed?
- `playwright: true/false` - Playwright tests needed?

**Path Detection:**
```yaml
api:
  - 'api-tests/**'
  - 'src/app/api/**'
  - 'prisma/**'
  - 'package*.json'

cypress:
  - 'cypress/**'
  - 'src/**'
  - 'prisma/**'
  - 'package*.json'
  - 'cypress.config.js'

playwright:
  - 'e2e/**'
  - 'src/**'
  - 'prisma/**'
  - 'package*.json'
  - 'playwright.config.ts'
```

#### 2️⃣ lint (Runs Once)
**Condition:** `if: needs.detect-changes.outputs.api == 'true' || needs.detect-changes.outputs.cypress == 'true' || needs.detect-changes.outputs.playwright == 'true'`

**Steps:**
- Checkout code
- Setup Node.js 20
- Install dependencies (with npm cache)
- Run ESLint

**Duration**: ~1 minute

---

#### 3️⃣ build (Runs Once if UI Tests Needed)
**Condition:** `if: needs.detect-changes.outputs.cypress == 'true' || needs.detect-changes.outputs.playwright == 'true'`

**Steps:**
- Checkout code
- Setup Node.js 20
- Install dependencies (with npm cache)
- Build Next.js application

**Duration**: ~2 minutes

---

#### 4️⃣ api-tests (Conditional)
**Condition:** `if: needs.detect-changes.outputs.api == 'true'`

**Steps:**
- Setup PostgreSQL (`nutriapp_api_test`)
- Install dependencies
- Run migrations + seed
- Execute API tests (22 tests)
- Upload artifacts

**Duration**: ~2 minutes  
**Artifacts**: `api-test-report.zip`

---

#### 5️⃣ cypress-tests (Conditional)
**Condition:** `if: needs.detect-changes.outputs.cypress == 'true'`

**Steps:**
- Setup PostgreSQL (`nutriapp_test`)
- Install dependencies
- Run migrations + seed
- Build + Start server
- Execute Cypress tests
- Upload artifacts

**Duration**: ~4 minutes  
**Artifacts**: 
- `cypress-screenshots.zip` (on failure)
- `cypress-videos.zip` (on failure)

---

#### 6️⃣ playwright-tests (Conditional)
**Condition:** `if: needs.detect-changes.outputs.playwright == 'true'`

**Steps:**
- Setup PostgreSQL (`nutriapp_playwright`)
- Install dependencies + browsers
- Fresh DB reset + seed
- Build application
- Execute Playwright tests
- Upload artifacts

**Duration**: ~3 minutes  
**Artifacts**: `playwright-report.zip`

---

### Secondary Workflow: `ci.yml` (Manual Only)

**Triggers:**
- Manual execution only (`workflow_dispatch`)

**Jobs:**
```
1. lint → 2. build → 3. Parallel Execution:
                        ├─ cypress-tests
                        ├─ playwright-tests
                        └─ playwright-api-tests
```

**Duration**: ~7-8 minutes  
**Use case**: Pre-release comprehensive testing

## 🗄️ Database Isolation Strategy

Each test suite gets its own PostgreSQL database to prevent:
- ❌ Race conditions
- ❌ Data conflicts
- ❌ Test interdependencies

| Job | Database | Port | Strategy |
|-----|----------|------|----------|
| Build | Mock | - | No real DB |
| Cypress | `nutriapp_test` | 5432 | migrate deploy |
| Playwright E2E | `nutriapp_playwright` | 5432 | migrate reset (fresh) |
| Playwright API | `nutriapp_api_test` | 5432 | migrate deploy |

## 🎯 Execution Examples

### Example 1: API Test Changes Only
```bash
git add api-tests/tests/dishes.test.ts
git commit -m "test: add dish pagination tests"
git push
```
**Jobs Executed:**
1. detect-changes → `api: true`, `cypress: false`, `playwright: false`
2. lint (runs once)
3. api-tests

**Jobs Skipped:** build, cypress-tests, playwright-tests  
**Duration**: ~3 minutes  
**CI minutes used**: 3

---

### Example 2: UI Component Changes
```bash
git add src/app/dishes/page.tsx
git commit -m "feat: improve dishes list layout"
git push
```
**Jobs Executed:**
1. detect-changes → `api: false`, `cypress: true`, `playwright: true`
2. lint (runs once)
3. build (runs once - shared by both)
4. cypress-tests (parallel)
5. playwright-tests (parallel)

**Jobs Skipped:** api-tests  
**Duration**: ~8 minutes  
**CI minutes used**: ~8  
**Optimization:** Lint and build run only once instead of twice

---

### Example 3: API Route Changes
```bash
git add src/app/api/dishes/route.ts
git commit -m "feat: add filtering to dishes endpoint"
git push
```
**Jobs Executed:**
1. detect-changes → `api: true`, `cypress: false`, `playwright: false`
2. lint (runs once)
3. api-tests

**Jobs Skipped:** build, cypress-tests, playwright-tests  
**Duration**: ~3 minutes  
**CI minutes used**: 3

---

### Example 4: Database Schema Changes
```bash
git add prisma/schema.prisma
git commit -m "feat: add category field to Dish model"
git push
```
**Jobs Executed:**
1. detect-changes → `api: true`, `cypress: true`, `playwright: true`
2. lint (runs once)
3. build (runs once)
4. api-tests (parallel)
5. cypress-tests (parallel)
6. playwright-tests (parallel)

**Duration**: ~11 minutes  
**CI minutes used**: ~11  
**Optimization:** ~15% faster than separate workflows due to shared lint/build

---

### Example 5: Documentation Changes
```bash
git add README.md
git commit -m "docs: update setup instructions"
git push
```
**Jobs Executed:**
1. detect-changes → `api: false`, `cypress: false`, `playwright: false`

**Jobs Skipped:** All test jobs  
**Duration**: <1 minute  
**CI minutes used**: <1

## 📦 Artifacts Generated

All artifacts are available for **30 days** after the run.

### Cypress Artifacts
- `cypress-screenshots` (only on failure)
- `cypress-videos` (only on failure)

### Playwright E2E Artifacts  
- `playwright-report/` (always)
  - index.html (interactive report)
  - trace files
  - screenshots

### Playwright API Artifacts ⭐ NEW
- `api-test-report/` (always)
  - `html-report/index.html` (interactive report)
  - `results.json` (machine-readable)

## 🔍 Viewing Reports

### Option 1: Download Artifacts (Current)
1. Go to Actions tab
2. Click on workflow run
3. Scroll to "Artifacts" section
4. Download ZIP files
5. Extract and open `index.html`

### Option 2: GitHub Pages (If enabled)
Direct link to reports:
```
https://jrodmejia.github.io/happy_testing/reports/[RUN_NUMBER]/
```

## 🛠️ Configuration Files

| Test Type | Config File | Database | Triggers On |
|-----------|-------------|----------|-------------|
| API Tests | `api-tests/config/api.config.ts` | `nutriapp_api_test` | `api-tests/**`, `src/app/api/**`, `prisma/**` |
| Cypress E2E | `cypress.config.js` | `nutriapp_test` | `cypress/**`, `src/**`, `prisma/**` |
| Playwright E2E | `playwright.config.ts` | `nutriapp_playwright` | `e2e/**`, `src/**`, `prisma/**` |

All orchestrated by **`main-ci.yml`** with isolated database environments and conditional execution.

## 💰 CI Minutes Optimization

**Traditional approach (single pipeline, no path filters):**
- Every commit runs ALL tests
- Average: ~12 minutes per commit
- 10 commits/day = **120 CI minutes/day**

**Separate workflows approach:**
- API-only changes: 2 min (lint) + 2 min (api-tests) = 4 minutes
- UI-only changes: 2 min (lint×2) + 2 min (build×2) + 7 min (tests) = 15 minutes
- DB schema changes: 2 min (lint×3) + 2 min (build×2) + 7 min (tests) = 15.5 minutes
- Average: ~8 minutes per commit
- 10 commits/day = **80 CI minutes/day**

**Optimized single pipeline (main-ci.yml):** ⭐
- API-only changes: 1 min (lint) + 2 min (api-tests) = 3 minutes
- UI-only changes: 1 min (lint) + 2 min (build) + 7 min (tests) = 10 minutes
- DB schema changes: 1 min (lint) + 2 min (build) + 7 min (tests) = 11 minutes
- Documentation: <1 minute
- Average: ~6.5 minutes per commit
- 10 commits/day = **65 CI minutes/day**

**Savings: 46% reduction vs traditional, 19% reduction vs separate workflows** 💰

### Key Optimizations:
✅ **Lint runs once** (not 3× in separate workflows)  
✅ **Build runs once** (not 2× in separate workflows)  
✅ **No duplicate jobs** (DRY principle)  
✅ **Documentation changes skip all tests** (0 minutes)  
✅ **Shared setup** reduces total execution time

## 🔐 Environment Variables

All jobs use the same environment variable pattern:

```yaml
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/[DB_NAME]
  CI: true  # Enables CI-specific behavior
```

The `CI=true` flag triggers:
- ✅ Headless browser mode
- ✅ No test retries (fail fast)
- ✅ Strict mode (forbids `.only()`)
- ✅ Single worker for Playwright API

## 🚨 Failure Handling

### When a test fails:

1. **Cypress**: Uploads screenshots + videos
2. **Playwright E2E**: Includes traces in HTML report
3. **Playwright API**: JSON results show exact failure

### Retry Strategy:

- **Lint**: No retries
- **Build**: No retries
- **Cypress**: Handled by Cypress action
- **Playwright E2E**: 2 retries (configured in playwright.config.ts)
- **Playwright API**: 2 retries (configured in api.config.ts)

## 📈 Best Practices Implemented

✅ **Single source of truth**: One pipeline file (`main-ci.yml`)  
✅ **No code duplication**: DRY principle for CI/CD  
✅ **Smart conditional execution**: Path filters + conditional jobs  
✅ **Fast feedback**: Lint runs first (fail fast)  
✅ **Parallel execution**: Test jobs run simultaneously when needed  
✅ **Database isolation**: No cross-test contamination  
✅ **Comprehensive reports**: HTML + JSON + screenshots  
✅ **Artifact retention**: 30 days for debugging  
✅ **Health checks**: PostgreSQL readiness verification  
✅ **Conditional uploads**: Screenshots only on failure  
✅ **Cache optimization**: npm cache for faster installs  
✅ **Cost efficient**: Shared setup jobs save resources  

## 🎯 Adding New Tests

To add tests to the pipeline:

### For E2E Tests:
1. Add test files to `e2e/tests/`
2. They'll automatically run in `playwright-tests` job

### For Cypress Tests:
1. Add test files to `cypress/e2e/tests/`
2. They'll automatically run in `cypress-tests` job

### For API Tests: ⭐
1. Add test files to `api-tests/tests/`
2. They'll automatically run in `playwright-api-tests` job

No changes to `ci.yml` needed!

## 🔄 Local Testing Before Push

Test the same environment locally:

```bash
# Run linting
npm run lint

# Run build
npm run build

# Run Cypress tests
npm run cypress:run

# Run Playwright E2E tests
npm run playwright:test

# Run Playwright API tests
npm run test:api
```

## 📊 Success Criteria

The pipeline succeeds only if ALL jobs pass:
- ✅ Lint: No errors
- ✅ Build: Successful compilation
- ✅ Cypress: All tests pass
- ✅ Playwright E2E: All tests pass
- ✅ Playwright API: All tests pass

If any job fails → entire pipeline fails → PR cannot be merged
