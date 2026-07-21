// Build-time prerender entry for the Become a Supplier pages.
// Loaded by scripts/prerender.mjs via Vite's ssrLoadModule — renders each
// route to static HTML that gets baked into dist/ for SEO.
import ReactDOMServer from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SupplierHub from "./pages/SupplierHub";
import SupplierGuide from "./pages/SupplierGuide";

export { supplierGuides } from "./data/supplierGuides";

export function renderRoute(path: string): string {
  return ReactDOMServer.renderToString(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/become-a-supplier" element={<SupplierHub />} />
        <Route path="/become-a-supplier/:slug" element={<SupplierGuide />} />
      </Routes>
    </MemoryRouter>
  );
}
