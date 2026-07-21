// Prerenders the Become a Supplier hub + all guide pages into dist/ after
// `vite build`, and regenerates dist/sitemap.xml with the new URLs.
//
// Run automatically via the "build" script: vite build && node scripts/prerender.mjs
// Override output dir for testing: DIST=/tmp/build node scripts/prerender.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = process.env.DIST ? path.resolve(process.env.DIST) : path.join(root, "dist");
const SITE = "https://spottail.ai";

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const templatePath = path.join(DIST, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error(`[prerender] ${templatePath} not found — run vite build first.`);
  process.exit(1);
}
const template = fs.readFileSync(templatePath, "utf8");

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const { renderRoute, supplierGuides } = await vite.ssrLoadModule("/src/prerender-entry.tsx");

  const buildPage = ({ url, title, description, appHtml, jsonLd, jsonLdId }) => {
    let out = template;
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    out = out.replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${esc(description)}" />`
    );
    out = out.replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${esc(title)}" />`
    );
    out = out.replace(
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${esc(description)}" />`
    );
    out = out.replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${SITE}${url}" />`
    );
    out = out.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${esc(title)}" />`
    );
    out = out.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${esc(description)}" />`
    );
    const headExtras = `<link rel="canonical" href="${SITE}${url}" /><script type="application/ld+json" id="${jsonLdId}">${JSON.stringify(
      jsonLd
    )}</script>`;
    out = out.replace("</head>", `${headExtras}\n  </head>`);
    out = out.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    return out;
  };

  const write = (url, html) => {
    const dir = path.join(DIST, url.replace(/^\//, ""));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    console.log(`[prerender] ${url}`);
  };

  // Hub
  const hubUrl = "/become-a-supplier";
  write(
    hubUrl,
    buildPage({
      url: hubUrl,
      title: "Become a Supplier: How to Get Stocked at Major Retailers | Spottail",
      description:
        "Step-by-step supplier guides for major retailers — Tesco, Walmart, Boots, Target, Costco and more. Requirements, timelines, buyer contacts, and how to get your product on shelves.",
      appHtml: renderRoute(hubUrl),
      jsonLdId: "supplier-hub-jsonld",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Become a Supplier — Retailer Guides",
        url: `${SITE}${hubUrl}`,
        description: "Step-by-step supplier guides for major retailers.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Become a Supplier", item: `${SITE}${hubUrl}` },
          ],
        },
      },
    })
  );

  // Guides
  for (const g of supplierGuides) {
    const url = `/become-a-supplier/${g.slug}`;
    write(
      url,
      buildPage({
        url,
        title: g.metaTitle,
        description: g.metaDescription,
        appHtml: renderRoute(url),
        jsonLdId: "supplier-guide-jsonld",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Become a Supplier", item: `${SITE}/become-a-supplier` },
              { "@type": "ListItem", position: 3, name: g.name, item: `${SITE}${url}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: g.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      })
    );
  }

  // Sitemap: existing entries from public/sitemap.xml + supplier pages.
  const today = new Date().toISOString().slice(0, 10);
  const srcSitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
  const supplierEntries = [
    `\n<url>\n  <loc>${SITE}/become-a-supplier</loc>\n  <lastmod>${today}</lastmod>\n</url>\n`,
    ...supplierGuides.map(
      (g) => `\n<url>\n  <loc>${SITE}/become-a-supplier/${g.slug}</loc>\n  <lastmod>${today}</lastmod>\n</url>\n`
    ),
  ].join("");
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), srcSitemap.replace("</urlset>", `${supplierEntries}\n</urlset>`));
  console.log(`[prerender] sitemap.xml updated with ${supplierGuides.length + 1} supplier URLs`);
  console.log(`[prerender] done — ${supplierGuides.length + 1} pages prerendered.`);
} finally {
  await vite.close();
}
