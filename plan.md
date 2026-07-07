## Plan: Frontend Audit and Stabilization for Ecommerce UI

TL;DR: Perform a comprehensive frontend audit of the existing React + Tailwind app, identify broken routes and incomplete ecommerce flows, then stabilize the architecture by creating a modular feature-based structure, centralizing state/logic, filling missing storefront functionality, and preparing the app for future Laravel CMS/backend synchronization.

**Steps**
1. Audit current frontend implementation and document all findings.
   - Confirm current routes and page coverage.
   - List broken/unimplemented navigation targets.
   - Identify placeholder content, hardcoded demo data, and missing features.
   - Map current component usage and repeated patterns.

2. Create a stabilization strategy focused on the existing architecture.
   - Retain React 19, React Router, and Tailwind-based UI.
   - Introduce a centralized app shell and page layout abstraction.
   - Replace ad hoc state management with a shared context or lightweight state store for cart, wishlist, user session, and search.
   - Create a reusable API/data service layer for future backend integration.
   - Define a component registry / dynamic section system as a CMS-ready foundation.

3. Refactor frontend structure into feature modules.
   - Group pages, components, and data by domain: home, product, cart, user, search, categories, content.
   - Move shared utilities and constants into centralized `src/lib` and `src/config` if needed.
   - Keep the existing page and component naming where practical, but reorganize for scalability.

4. Stabilize ecommerce flows and UX.
   - Implement missing routes or explicitly disable broken navigation links until pages exist.
   - Complete the cart flow with persistent storage and checkout validation.
   - Turn wishlist into a real state-driven feature, not a hardcoded demo list.
   - Add actual search filtering logic and product/category discovery behaviors.
   - Strengthen category navigation so overlays and sidebar selections filter product lists.

5. Complete product and storefront features.
   - Build full product variant options, stock indicators, SKU-like metadata, reviews, and related product logic.
   - Add category listing page support and product listing filters/sorting.
   - Harden product detail page with dynamic metadata and accessible tabbed content.
   - Add missing pages: blogs, contact, flash deal, compare, seller shop, brand/campaign landing skeletons.

6. Implement frontend quality improvements.
   - Add responsive design fixes and mobile behavior for all layouts.
   - Add skeleton loaders, empty states, error states, and success states for data-driven views.
   - Improve accessibility: semantic markup, labels, keyboard focus, contrast, aria attributes.
   - Introduce SEO metadata support and structural data placeholders for future SSR/SSG.
   - Normalize Tailwind usage with reusable spacing and typography classes.

7. Create CMS-ready architecture pillars.
   - Add a section registry pattern for dynamic page composition.
   - Support JSON-driven section rendering and metadata-driven pages.
   - Keep content decoupled from layout so the frontend can later consume Laravel CMS payloads.

8. Plan Laravel backend and API synchronization after frontend stabilization.
   - Delay backend architecture until frontend is stable and feature-complete.
   - Design CMS sync interfaces, page schema contracts, and API versioning strategy.

**Relevant files**
- `src/App.tsx` — central router and current state management hotspot.
- `src/main.tsx` — app bootstrap.
- `src/pages/Home.tsx`, `src/pages/AllProducts.tsx`, `src/pages/ProductDetails.tsx` — existing page implementations to stabilize and expand.
- `src/components/Navbar.tsx`, `src/components/SubNavbar.tsx` — broken route links, missing search and category integration.
- `src/components/CartDrawer.tsx`, `src/components/WishlistDrawer.tsx`, `src/components/ProfileDrawer.tsx`, `src/components/PurchasePopup.tsx` — current checkout/wishlist/profile flows.
- `src/components/CategoryOverlay.tsx`, `src/components/CategorySidebar.tsx` — category discovery UI and missing product filtering.
- `src/components/ProductCard.tsx`, `src/components/ProductGrid.tsx` — product presentation and navigation.
- `src/data/mockData.ts`, `src/data/categories.ts`, `src/types.ts` — hardcoded data sources and missing domain models.
- `src/lib/utils.ts` — utility normalization point.
- `package.json`, `vite.config.ts` — dependency and build environment.

**Verification**
1. Confirm route coverage by visiting `/`, `/allproducts`, `/productdetails/:productName`, and verifying no broken links to unimplemented pages.
2. Run `npm run lint` and `npm run dev`; ensure the app starts cleanly and TypeScript is valid.
3. Validate cart / checkout interaction end-to-end with add/remove, quantity updates, and purchase modal behavior.
4. Validate wishlist state updates when real state is connected.
5. Validate search input and category overlays filter product lists as expected.
6. Audit mobile rendering on responsive breakpoints and fix any collapsed or overflow issues.
7. Confirm key accessibility improvements: focus management, aria labels, button semantics.

**Decisions**
- Preserve the existing React + Tailwind architecture rather than rewrite fully.
- Use the app’s present component library as the starting point and systematically complete it.
- Treat backend/CMS planning as a later phase once the frontend is stable and data-driven.
- Build a lightweight shared state layer now so data sync and commerce flows can be integrated cleanly later.

**Further considerations**
1. Decide whether to keep Vite SPA or move to hybrid/SSR for SEO; initial stabilization can remain SPA while planning SEO metadata and potential future SSR migration.
2. Determine if authentication should be stubbed with local mocks or integrated with a lightweight auth provider for enterprise readiness.
3. Prioritize building a search/filter system and wishlist/cart persistence before full theme builder work.