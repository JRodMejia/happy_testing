# GitHub Actions - Smart CI Pipeline

## 📋 Workflow Structure

The project uses an **optimized single pipeline** with intelligent path-based execution:

### Workflows:

1. **`main-ci.yml`** - Smart CI Pipeline (Primary) ⭐
   - **Triggers**: Automatic on push to `main`
   - **Detects changes**: Uses path filters to determine which tests to run
   - **Runs**: Only necessary jobs based on modified files
   - **Benefits**: No duplication, faster execution, cost-efficient
   - **Duration**: ~3-11 minutes (depends on what changed)

2. **`ci.yml`** - Full Pipeline (Manual Only)
   - **Triggers**: Manual execution only (`workflow_dispatch`)
   - **Runs**: All tests in parallel without path filtering
   - **Use case**: Pre-release validation, comprehensive testing
   - **Duration**: ~7-8 minutes

## 🎯 Smart Execution Examples

### Scenario 1: You modify API test files
```bash
git add api-tests/tests/auth.test.ts
git commit -m "feat: add login validation test"
git push
```
**Jobs Executed**: detect-changes → lint → api-tests  
**Jobs Skipped**: build, cypress-tests, playwright-tests  
**Duration**: ~3 minutes ✅

### Scenario 2: You modify UI components
```bash
git add src/app/dishes/page.tsx
git commit -m "fix: update dishes list UI"
git push
```
**Jobs Executed**: detect-changes → lint → build → cypress-tests + playwright-tests (parallel)  
**Jobs Skipped**: api-tests  
**Duration**: ~8 minutes ✅  
**Optimization**: Lint and build run only once (shared by both UI test suites)

### Scenario 3: You modify API routes
```bash
git add src/app/api/dishes/route.ts
git commit -m "feat: add pagination to dishes endpoint"
git push
```
**Jobs Executed**: detect-changes → lint → api-tests  
**Jobs Skipped**: build, cypress-tests, playwright-tests  
**Duration**: ~3 minutes ✅

### Scenario 4: You modify Prisma schema
```bash
git add prisma/schema.prisma
git commit -m "feat: add new User field"
git push
```
**Jobs Executed**: detect-changes → lint → build → api-tests + cypress-tests + playwright-tests (parallel)  
**Duration**: ~11 minutes ✅  
**Optimization**: ~15% faster than separate workflows due to shared lint/build

### Scenario 5: You modify documentation
```bash
git add README.md
git commit -m "docs: update setup instructions"
git push
```
**Jobs Executed**: detect-changes only  
**Jobs Skipped**: All test jobs  
**Duration**: <1 minute ✅

## 📂 Path Triggers Reference

| File Pattern | api-tests | cypress-tests | playwright-tests |
|--------------|-----------|---------------|------------------|
| `api-tests/**` | ✅ | ❌ | ❌ |
| `cypress/**` | ❌ | ✅ | ❌ |
| `e2e/**` | ❌ | ❌ | ✅ |
| `src/app/api/**` | ✅ | ❌ | ❌ |
| `src/**` (other) | ❌ | ✅ | ✅ |
| `prisma/**` | ✅ | ✅ | ✅ |
| `package.json` | ✅ | ✅ | ✅ |

## 🚀 Benefits of Optimized Pipeline

✅ **Smart execution** - Only relevant tests run based on file changes  
✅ **Cost efficient** - ~15% reduction in CI minutes, no duplicate jobs  
✅ **No duplication** - Lint runs once, build runs once  
✅ **Single source of truth** - One pipeline file to maintain  
✅ **Faster feedback** - Shared setup jobs, parallel test execution  
✅ **DRY principle** - Eliminates code duplication in CI/CD  
✅ **Clear status** - Conditional job execution shows exactly what ran

## 📊 Execution Reports

Go to https://github.com/JRodMejia/happy_testing/actions

You'll see workflow runs for:
- 🔵 **Smart CI Pipeline** (`main-ci.yml`) - Shows which jobs executed based on changes
- 🟢 **CI - Full Testing Pipeline** (`ci.yml`) - Manual comprehensive testing

### Artifacts Available (from `main-ci.yml`):

**API Tests Job**:
- `api-test-report.zip` - HTML report + JSON results

**Cypress Tests Job**:
- `cypress-screenshots.zip` - Screenshots (on failure)
- `cypress-videos.zip` - Videos (on failure)

**Playwright Tests Job**:
- `playwright-report.zip` - HTML report with traces

💡 **Tip**: Check the workflow summary to see which jobs were executed vs. skipped

## 🔧 Manual Full Pipeline

To run ALL tests together (e.g., before a major release):

1. Go to **Actions** tab
2. Select **"CI - Full Testing Pipeline"**
3. Click **"Run workflow"**
4. Choose branch and click **"Run workflow"**

This will execute all three test suites in parallel.

## ⚙️ Configuration Files

Each test type has its own configuration:

| Test Type | Config File | Database |
|-----------|------------|----------|
| API Tests | `api-tests/config/api.config.ts` | `nutriapp_api_test` |
| Cypress E2E | `cypress.config.js` | `nutriapp_test` |
| Playwright E2E | `playwright.config.ts` | `nutriapp_playwright` |

All test types are orchestrated by `main-ci.yml` with isolated database environments.

## 🔄 Workflow Status Badge

Add to your README.md:

```markdown
![CI Pipeline](https://github.com/JRodMejia/happy_testing/workflows/Smart%20CI%20Pipeline/badge.svg)
```

## 🏗️ Pipeline Architecture

The `main-ci.yml` workflow uses job dependencies and conditional execution:

```
GitHub Push → detect-changes → lint → build (if UI) → [api-tests | cypress-tests | playwright-tests]
                                                              ↓            ↓              ↓
                                                         (conditional) (conditional) (conditional)
```

**Key Features**:
- **Path filters**: Detects which files changed (`api/`, `cypress/`, `e2e/`, `src/`, `prisma/`)
- **Conditional jobs**: Only runs necessary tests using `if: needs.detect-changes.outputs.X == 'true'`
- **Shared setup**: Lint and build run once, not per test type
- **Parallel tests**: When multiple test types needed, they execute simultaneously
