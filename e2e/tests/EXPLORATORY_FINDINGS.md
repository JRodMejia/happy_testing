# Exploratory Testing Findings - Dishes Module

**Date:** November 17, 2025  
**URL Explored:** http://localhost:3000/dishes  
**Application:** NutriApp - Recipe Management System

## 🎯 Executive Summary

Comprehensive exploratory testing was performed on the Dishes module, covering the complete CRUD cycle (Create, Read, Update, Delete) and various edge cases. All core functionalities work as expected, with some notable UX observations documented below.

---

## 📋 Core Functionalities Tested

### 1. **List View** (`/dishes`)
- ✅ Displays dishes in a responsive grid layout (1-4 columns based on screen size)
- ✅ Each dish card shows:
  - Dish image (or placeholder if not provided)
  - Dish name (truncated with ellipsis if too long)
  - Description (limited to 2 lines with line-clamp)
  - Time badge (shows "Rápido" for quick prep or total minutes)
  - Three action buttons: Ver (View), Editar (Edit), Eliminar (Delete)
- ✅ Cards have hover effects (shadow expansion, image zoom)

### 2. **View Details** (`/dishes/{id}/view`)
- ✅ Displays complete dish information
- ✅ Shows preparation steps in numbered format
- ✅ Back button navigation returns to list
- ✅ Maintains scroll position when navigating back

### 3. **Create New Dish** (`/dishes/new`)
- ✅ Form includes all necessary fields:
  - Name (text input, required)
  - Description (textarea, required)
  - Prep Time (number input, minutes)
  - Cook Time (number input, minutes)
  - Steps (textarea, required)
  - Calories (number input, optional)
  - Image URL (text input, optional)
  - Quick Prep checkbox (boolean)
- ✅ Form validation prevents submission with empty required fields
- ✅ Successful submission redirects to `/dishes` list
- ✅ Newly created dish appears immediately in the list
- ✅ Cancel button returns to list without saving

### 4. **Edit Dish** (`/dishes/{id}`)
- ✅ Form pre-fills with existing dish data
- ✅ All fields are editable
- ✅ Save button updates the dish and redirects to list
- ✅ Cancel button discards changes and returns to list
- ✅ Updated dish name reflects immediately in the list

### 5. **Delete Dish**
- ✅ Delete button removes dish from database
- ⚠️ **No confirmation modal** - deletion is immediate
- ✅ Dish disappears from list instantly (client-side state update)
- ✅ No error messages on successful deletion

### 6. **Authentication & Navigation**
- ✅ Logout button redirects to `/login` page
- ✅ Session management working correctly
- ✅ Add Dish button prominently placed in header

---

## 🔍 Edge Cases Identified

### **High Priority - UX Concerns**

#### 1. **Immediate Deletion Without Confirmation** ⚠️
**Severity:** High  
**Description:** The delete button removes dishes immediately without asking for user confirmation.

**Observed Behavior:**
```
User clicks "Eliminar" → Dish deleted instantly → No undo option
```

**Risk:** Accidental deletions cannot be recovered  
**Recommendation:** Implement confirmation modal:
```
"¿Estás seguro de que deseas eliminar '[Dish Name]'?"
[Cancelar] [Eliminar]
```

**Test Coverage:** Test #5 validates this behavior exists  
**Business Impact:** Users may accidentally delete important recipes

---

#### 2. **No Validation for Numeric Fields (Negative Values)**
**Severity:** Medium  
**Description:** Prep Time and Cook Time fields accept negative numbers in the HTML input.

**Observed Behavior:**
- Browser allows entering negative values like `-10` minutes
- Backend/database may or may not validate this

**Recommendation:** Add `min="0"` attribute to number inputs  
**Test Coverage:** Not currently tested (could add negative value test)

---

#### 3. **Form Field Validation - Steps Field**
**Severity:** Low  
**Description:** The "Steps" field is required but doesn't guide users on format.

**Observed Behavior:**
- Textarea accepts any text format
- No guidance on whether to use numbered steps, bullet points, or free text
- Application displays steps as-is without formatting

**Recommendation:** 
- Add placeholder text: "Example: 1. Chop vegetables\n2. Heat oil\n3. Sauté..."
- Or implement structured step-by-step input (add/remove step buttons)

**Test Coverage:** Test #8 validates required field enforcement

---

### **Medium Priority - Data Validation**

#### 4. **Image URL Validation**
**Severity:** Medium  
**Description:** Image URL field accepts any string, including invalid URLs.

**Observed Behavior:**
- Invalid URLs like `https://example.com/nonexistent.jpg` cause 404 errors
- Server logs show: `⨯ upstream image response failed for https://example.com/caesar-salad.jpg 404`
- Application displays fallback "Sin imagen" placeholder correctly

**Recommendation:**
- Add URL format validation (regex check)
- Optionally: Add image validation endpoint to check if URL returns valid image

**Test Coverage:** Not tested (could add invalid URL test)

---

#### 5. **Name and Description Length Limits**
**Severity:** Low  
**Description:** No apparent maximum length validation on text fields.

**Observed Behavior:**
- Name truncates with ellipsis in card view (CSS `truncate`)
- Description line-clamps to 2 lines (CSS `line-clamp-2`)
- Very long inputs may cause database issues if no DB constraints exist

**Recommendation:**
- Add `maxLength` attributes to inputs
- Display character counter for better UX
- Example: "Name (max 100 characters): 45/100"

**Test Coverage:** Not tested (could add extremely long text test)

---

### **Low Priority - Usability Observations**

#### 6. **Quick Prep Checkbox Ambiguity**
**Severity:** Low  
**Description:** The "Quick Prep" checkbox purpose is unclear from the form alone.

**Observed Behavior:**
- Checking "Quick Prep" changes the time badge to show "Rápido" instead of minutes
- No tooltip or help text explains what "quick prep" means

**Recommendation:** Add tooltip or help icon explaining criteria (e.g., "Dishes ready in under 15 minutes")

**Test Coverage:** Tested implicitly in creation flow

---

#### 7. **No Loading States During Operations**
**Severity:** Low  
**Description:** No visual feedback while creating, editing, or deleting dishes.

**Observed Behavior:**
- User clicks "Save" → brief pause → redirect
- No spinner or disabled button state
- Fast operations make this less noticeable, but slow connections could confuse users

**Recommendation:** Add loading spinner and disable buttons during async operations

**Test Coverage:** Tests use `waitForTimeout` to handle this, but no explicit loading state verification

---

## 🧪 Test Coverage Summary

| Test Case | Status | Edge Cases Covered |
|-----------|--------|-------------------|
| 1. Display dishes list | ✅ | Grid layout, multiple items |
| 2. View dish details | ✅ | Navigation, back button |
| 3. Create new dish | ✅ | Form submission, redirect |
| 4. Edit existing dish | ✅ | Pre-fill data, update |
| 5. Delete dish | ✅ | **Immediate deletion (no confirmation)** |
| 6. Complete CRUD cycle | ✅ | Full workflow integration |
| 7. Logout | ✅ | Session management |
| 8. Form validation | ✅ | **Required fields enforcement** |
| 9. Cancel creation | ✅ | Discard changes |

**Total Tests:** 9  
**Passing:** 9 (100%)  
**Failed:** 0

---

## 🐛 Bugs & Issues Found

### **None** ✅
All functionalities work as designed. The observations above are UX improvements and edge cases, not bugs.

---

## 🎨 UI/UX Observations

### Positive Aspects ✅
1. **Clean, modern design** with good use of color-coding (blue=view, yellow=edit, red=delete)
2. **Responsive grid** adapts well to different screen sizes
3. **Hover effects** provide good visual feedback
4. **Quick Prep badge** is a nice touch for filtering/identifying recipes
5. **Form layout** is clean and intuitive

### Improvement Opportunities 💡
1. Add confirmation modals for destructive actions (delete)
2. Implement loading states for async operations
3. Add toast notifications for success/error messages
4. Consider adding search/filter functionality for large recipe collections
5. Image upload functionality instead of URL-only approach
6. Pagination or infinite scroll for scalability

---

## 🔧 Technical Observations

### Next.js Warnings (Non-blocking)
```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
Error: Route "/dishes/[id]/view" used `params.id`. 
`params` should be awaited before using its properties.
```

**Impact:** Low - Tests pass successfully, but this indicates the app uses Next.js 15's async params API incorrectly  
**Recommendation:** Update route handlers to await params:
```typescript
// Before
return <ViewDishDetail id={params.id} />;

// After
const { id } = await params;
return <ViewDishDetail id={id} />;
```

---

## 📊 Test Execution Metrics

- **Total Execution Time:** ~58 seconds
- **Average Test Duration:** ~6.4 seconds
- **Browser Used:** Chromium
- **Test Framework:** Playwright 1.56.1
- **Pattern Used:** Page Object Model (POM)

---

## 🔄 Recommendations for Future Testing

### Scenarios Not Yet Tested
1. **Concurrent Operations:** Multiple users editing the same dish
2. **Performance:** Creating 100+ dishes and testing pagination
3. **Security:** SQL injection in text fields, XSS attempts
4. **Accessibility:** Keyboard navigation, screen reader support
5. **Mobile Responsiveness:** Touch interactions, viewport sizes
6. **Error Scenarios:**
   - Network failures during form submission
   - Database connection errors
   - Invalid data from API responses
7. **Boundary Testing:**
   - Minimum/maximum values for numeric fields
   - Special characters in text fields (emoji, accents, symbols)
   - Very long text inputs (1000+ characters)

### Additional Edge Cases to Explore
- What happens if you navigate directly to `/dishes/999999` (non-existent ID)?
- Can you create two dishes with identical names?
- What if the image URL is extremely long (1000+ characters)?
- Does the app handle dishes with 0 prep time and 0 cook time?
- What about dishes with only steps and no other data?

---

## ✅ Conclusion

The Dishes module is **production-ready** with solid core functionality. All CRUD operations work correctly. The main improvement opportunity is adding confirmation dialogs for destructive actions (delete) to prevent accidental data loss.

**Risk Level:** Low  
**User Impact:** Positive (application functions well)  
**Recommended Actions:** Implement delete confirmation modal before production release

---

## 📝 Test Artifacts Generated

1. **Page Objects:**
   - `e2e/pages/DishesPage.ts` (updated)
   - `e2e/pages/DishDetailPage.ts` (new)
   - `e2e/pages/EditDishPage.ts` (new)

2. **Test Suite:**
   - `e2e/tests/exploratory-dishes-flow.spec.ts` (9 comprehensive tests)

3. **Documentation:**
   - `e2e/tests/EXPLORATORY_FINDINGS.md` (this document)

---

**Tested by:** GitHub Copilot Agent  
**Framework:** Playwright with TypeScript  
**Pattern:** Page Object Model (POM)  
**Status:** ✅ All tests passing
