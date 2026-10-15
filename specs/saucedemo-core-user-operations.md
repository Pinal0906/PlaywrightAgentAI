# Sauce Demo — Core User Operations Test Plan

**Application:** https://www.saucedemo.com  
**Coverage:** Five independent end-user operations: sign in, browse and sort products, manage the cart, complete checkout, and sign out.  
**Test data:** Use the public demo account `standard_user` / `secret_sauce` where authentication is required.  
**Fresh-state assumption:** Start each scenario in a new browser context with no persisted session or cart. Clear cookies/storage between scenarios. For negative sign-in checks, begin on the login page. Restore a fresh context before each independent scenario.

## Environment and shared expectations

1. Open the application at the URL above in a supported desktop browser.
2. Confirm the expected page or state after each action and verify visible errors are associated with the relevant operation.
3. Unless stated otherwise, use the standard demo account. Treat demo products and prices as test data; avoid asserting image pixel details or a specific price beyond the values displayed by the app.
4. A scenario passes only when every expected result is met and no unexpected navigation, lost cart item, or unhandled error occurs. Any missing, contradictory, or inaccessible result is a failure.

## 1. Sign in and handle invalid credentials

**Starting state:** Fresh context at the login screen.

1. Submit the form with both username and password empty.
   - **Expected:** Sign-in is rejected, the user remains on the login screen, and a clear required-field error is shown.
2. Dismiss the error if a close control is available. Enter a valid username and leave the password empty; submit.
   - **Expected:** Sign-in is rejected with a password-required message; no authenticated inventory view is shown.
3. Enter a non-existent username and a non-empty password; submit.
   - **Expected:** Sign-in is rejected with an invalid-credentials message and no authenticated session is created.
4. Enter `standard_user` and an incorrect password; submit.
   - **Expected:** Sign-in remains rejected and the user can correct the fields.
5. Enter `standard_user` / `secret_sauce` and submit.
   - **Expected:** The inventory page opens, the product list and sort control are visible, and the cart starts empty.

**Success criteria:** Validation prevents incomplete and incorrect sign-in, while valid credentials reach inventory.  
**Failure conditions:** An invalid submission authenticates, fails silently, or leaves an unusable form; valid credentials do not reach inventory.

## 2. Browse the catalog and sort products

**Starting state:** Fresh context signed in as `standard_user`; empty cart.

1. Review the inventory page. Confirm each product card presents a name, description, price, image, and add-to-cart control.
2. Open a product by selecting its name or image.
   - **Expected:** Product detail view shows the selected product’s matching name, description, price, image, and an add-to-cart control.
3. Return to the inventory list using the page’s back-to-products control.
   - **Expected:** Inventory is restored and the selected item has not been added merely by opening its details.
4. Change the sort control to price low-to-high. Compare visible prices in sequence.
   - **Expected:** Prices are nondecreasing and products remain available.
5. Change the sort control to name Z-to-A. Compare product names in sequence.
   - **Expected:** Names are in descending alphabetical order; changing sort does not alter cart contents.
6. Select the default name A-to-Z sort (or reload inventory if the default option is represented that way).
   - **Expected:** Names are in ascending alphabetical order.

**Success criteria:** Product details correspond to the selected item and supported sort options reorder the list correctly without adding items.  
**Failure conditions:** Detail content mismatches, sort order is wrong, or browsing changes cart state unexpectedly.

## 3. Add, review, and remove cart items

**Starting state:** Fresh context signed in as `standard_user`; empty cart.

1. Add two different products from inventory.
   - **Expected:** Each control changes to its remove state, and the cart badge shows 2.
2. Open the cart using the cart icon.
   - **Expected:** Both selected products appear with matching names and displayed prices; quantity and badge reflect two items.
3. Remove one item from the cart.
   - **Expected:** Only that item disappears and the badge decrements to 1.
4. Continue shopping and return to inventory.
   - **Expected:** The remaining item is preserved and its control reflects that it is already in the cart.
5. Remove the remaining item from inventory, then reopen the cart.
   - **Expected:** The badge is absent or indicates zero, and the cart displays its empty state with no stale item rows.
**Success criteria:** Add/remove actions, cart rows, badge, and state across navigation stay synchronized.  
**Failure conditions:** Duplicate/stale rows, incorrect badge count, lost item during navigation, or empty cart can be checked out.

## 4. Complete checkout and validate required customer details

**Starting state:** Fresh context signed in as `standard_user`; add at least one product to cart and open the cart.

1. Select checkout.
   - **Expected:** Checkout information form opens.
2. Submit the form with all fields blank.
   - **Expected:** Checkout is blocked and a clear first-name-required validation message is shown.
3. Fill first name and last name, leave postal code blank, and submit.
   - **Expected:** Checkout remains blocked and a postal-code-required message is shown.
4. Enter a postal code and continue.
   - **Expected:** Order overview shows the selected item(s), payment and shipping information, item subtotal, tax, and total; the displayed total equals subtotal plus tax.
5. Cancel checkout from the overview.
   - **Expected:** User returns to the inventory or cart as designed; the cart contents are preserved and no order is completed.
6. Repeat checkout with valid first name, last name, and postal code; continue and select Finish.
   - **Expected:** The “Checkout: Complete!” confirmation appears with an order thank-you message and a Back Home action.
7. Return to inventory.
   - **Expected:** Inventory is accessible and the completed cart is cleared (no stale cart badge/items).

**Success criteria:** Required data validation works, totals are internally consistent, cancel preserves the pending cart, and a valid order reaches confirmation and clears the cart.  
**Failure conditions:** Missing required data advances, incorrect total, cancel finalizes or loses cart, or Finish does not produce confirmation.

## 5. Sign out and verify session boundary

**Starting state:** Fresh context signed in as `standard_user` on inventory; cart may contain one item to check how sign-out handles session state.

1. Open the navigation menu.
   - **Expected:** Menu opens and exposes All Items, About, Logout, and Reset App State actions.
2. Select logout.
   - **Expected:** Login screen appears and authenticated inventory is no longer displayed.
3. Use the browser Back action.
   - **Expected:** Protected inventory is not usable as an authenticated session; the app returns to login or requires re-authentication.
4. Sign in again with the standard credentials.
   - **Expected:** Inventory loads under a new authenticated session; cart state follows the app’s documented behavior and does not show an inconsistent badge/list.

**Success criteria:** Logout ends the authenticated session and protected content cannot be resumed through browser history without signing in.  
**Failure conditions:** Logout leaves the user on an authenticated page, browser history restores an active protected session, or a fresh session has conflicting cart badge and contents.

## Execution notes

- Each operation is intended to run independently from a fresh browser context; checkout’s explicit cancel-and-retry steps are within that one scenario.
- The demo site’s seeded account and catalog are shared test fixtures. If site data or labels change, update expected copy while retaining the behavioral assertions.
- Verify outcomes using visible UI state and navigation; do not depend on implementation details such as CSS classes or backend storage.
