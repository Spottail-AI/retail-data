import { SupplierGuide } from "./supplierGuideTypes";

// US supplier guides. Currency: USD ($) throughout.
export const supplierGuidesUS: SupplierGuide[] = [
  {
    slug: "walmart",
    name: "Walmart",
    country: "US",
    category: "Mass",
    cardBlurb: "The world's largest retailer — Supplier Center application, local routes and Open Call.",
    topGun: true,
    metaTitle: "How to Become a Walmart Supplier: Requirements, Process & Timeline | Spottail",
    metaDescription:
      "How to become a Walmart supplier: the Supplier Center application, local vs national routes, Open Call, D-U-N-S, EDI and OTIF requirements, timelines and costs.",
    kicker: "US · Mass Retail · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Walmart",
    h1Post: "supplier",
    readTime: "12 min read",
    quickAnswer:
      "To become a Walmart supplier, apply through **Walmart Supplier Center** (suppliercenter.walmart.com) — choosing your supplier type (national, local, or services) — and meet the entry requirements: a **federal TIN, a D&B D-U-N-S number, product liability insurance, GS1-issued UPCs**, and product test reports. Local suppliers can pitch store and regional managers; **Open Call** (Walmart's annual US-manufactured products event) is a real door for American-made brands. Compliance is day-one: **EDI, labeling and OTIF (on-time in-full) standards apply with no grace period**.",
    facts: [
      { n: "4,600+", l: "US stores" },
      { n: "90%", l: "of Americans within 10 miles" },
      { n: "0", l: "days' compliance grace period" },
      { n: "#1", l: "largest retailer on earth" },
    ],
    intro:
      "Walmart is the largest retailer in the world, and its supplier machine is correspondingly industrial: a structured application, hard prerequisites, and compliance expectations that start the day your first purchase order lands. The opportunity is equally industrial — a single national listing means thousands of stores. The realistic path for most brands runs through local or regional programs first, and Walmart has built genuine doors for that.",
    routesHeading: { pre: "The four routes", em: "into Walmart" },
    routes: [
      {
        title: "Supplier Center — the national application",
        body: "All new supplier applications go through [Walmart Supplier Center](https://corporate.walmart.com/suppliers/apply-to-be-a-supplier). Determine your supplier type, create an account, and complete the qualification process with your business, financial and product documentation. Complete applications with demand evidence progress; applying is not approval.",
      },
      {
        title: "The local route",
        body: "Local suppliers pitch at store level: if a store manager likes your product, they champion it to the regional general manager, whose approval moves you into the supplier application with sponsorship behind it. It's the most underrated door into Walmart — real shelf placement in a handful of stores, with expansion driven by sell-through.",
      },
      {
        title: "Open Call — for US-made products",
        body: "Walmart's annual **Open Call** event invites products made, grown or assembled in the USA to pitch buyers directly — thousands of meetings, deals signed on the day, from single-store placements to national listings. If your product qualifies as US-made, this is the highest-density buyer access that exists.",
      },
      {
        title: "Walmart Marketplace first",
        body: "Selling on Walmart Marketplace (the third-party platform) builds Walmart-customer sales data without the 1P compliance overhead. Strong Marketplace velocity is increasingly the evidence that earns a wholesale conversation — the audition before the contract.",
      },
    ],
    requirements: [
      { k: "Business prerequisites", v: "Federal Tax ID (TIN), D&B D-U-N-S number, and US business registration — checked before anything else." },
      { k: "Insurance", v: "Product liability insurance at Walmart's required coverage levels (commonly $2M+ per occurrence; higher for some categories)." },
      { k: "UPCs (GS1)", v: "GS1-issued UPC barcodes for every SKU — resold or unofficial barcodes fail item setup." },
      { k: "Product testing", v: "All product test reports shared; category-specific safety and regulatory compliance documentation." },
      { k: "EDI capability", v: "Full EDI trading from day one — orders, ASNs, invoices. No grace period for getting connected." },
      { k: "OTIF performance", v: "On-Time In-Full delivery standards enforced with fines from the start — your logistics must be Walmart-grade before the first PO." },
      { k: "Labeling & packaging", v: "Walmart's labeling, case-pack and pallet standards, correct from the first shipment." },
      { k: "Ethical sourcing", v: "Responsible sourcing audits and supply chain standards compliance." },
    ],
    note:
      "**Compliance warning:** Walmart expects suppliers to be fully operational from day one — EDI connected, labeling right, OTIF performance at threshold. There is no ramp-up period, and chargebacks for misses are automatic. Budget operational readiness before revenue, not after.",
    steps: [
      { title: "Get prerequisites in place", body: "TIN, D-U-N-S, GS1 UPCs, insurance, test reports — the checklist before the checklist.", time: "1–2 months" },
      { title: "Apply via Supplier Center", body: "Choose supplier type, complete the qualification with full business and product documentation.", time: "Weeks 0–8" },
      { title: "Buyer review", body: "Category buyers assess fit, differentiation, price and demand evidence — local sponsorship or Open Call accelerates this dramatically.", time: "2–6 months" },
      { title: "Agreement & setup", body: "Supplier agreement, EDI testing, item setup in Walmart's systems, factory audits where applicable.", time: "1–3 months" },
      { title: "First PO — fully compliant", body: "OTIF, labeling and EDI standards enforced from the first shipment.", time: "Launch" },
      { title: "Perform or exit", body: "Sell-through, OTIF scores and scorecard metrics decide modular reviews — Walmart prunes underperformers fast.", time: "Ongoing" },
    ],
    costs: [
      { item: "GS1 membership & UPCs", range: "$250–$2,500 initial" },
      { item: "Product liability insurance ($2M+)", range: "$2,000–$8,000 / year" },
      { item: "EDI setup & testing", range: "$5,000–$20,000" },
      { item: "Product testing & compliance", range: "$1,000–$5,000 per product" },
      { item: "Packaging to Walmart spec", range: "$10,000–$50,000" },
      { item: "OTIF-grade logistics", range: "3PL costs — scale-dependent" },
    ],
    costNote:
      "Walmart volume at Walmart prices is a low-margin, high-throughput business. Model chargebacks, EDI, logistics and price investment before celebrating the PO — plenty of brands have been sunk by winning here unprepared.",
    tips: [
      { title: "Start local or Marketplace.", body: "A five-store local win or strong Marketplace data de-risks the national conversation more than any deck." },
      { title: "Treat Open Call like the final.", body: "If you're US-made, prepare for Open Call for months: costed retail price points, capacity plan, compliance story." },
      { title: "Be operationally boring.", body: "Walmart buyers advance suppliers who feel like zero operational risk. OTIF-ready logistics is a pitch asset." },
      { title: "Price for the everyday.", body: "Walmart is EDLP — everyday low price — not promotional. Your cost price must sustain the shelf price permanently." },
    ],
    faqs: [
      { q: "How do I apply to become a Walmart supplier?", a: "Through Walmart Supplier Center (suppliercenter.walmart.com) — determine your supplier type, create an account and complete the qualification process. Completing it doesn't guarantee approval." },
      { q: "What do I need before applying?", a: "A federal TIN, D&B D-U-N-S number, product liability insurance, GS1-issued UPCs for each product, and product test reports." },
      { q: "What is Walmart Open Call?", a: "Walmart's annual event where products made, grown or assembled in the USA pitch buyers directly — deals from single stores to national listings are agreed at the event." },
      { q: "Can I start as a local supplier?", a: "Yes — pitch your local store manager; their support escalates to the regional general manager, whose approval sponsors your supplier application." },
      { q: "What is OTIF?", a: "On-Time In-Full — Walmart's delivery performance standard, enforced with automatic chargebacks from day one. There is no compliance grace period." },
      { q: "How long does becoming a Walmart supplier take?", a: "Typically 6–12+ months nationally; local placements and Open Call outcomes can move much faster." },
    ],
    sources: [
      { label: "Walmart — Apply to be a supplier", href: "https://corporate.walmart.com/suppliers/apply-to-be-a-supplier" },
      { label: "Walmart Supplier Help", href: "https://supplierhelp.walmart.com/s/" },
    ],
  },
  {
    slug: "target",
    name: "Target",
    country: "US",
    category: "Mass",
    cardBlurb: "Style-led mass retail — buyer-first process, Supplier Intake Form, invite-only Target Plus.",
    topGun: true,
    metaTitle: "How to Become a Target Vendor: Requirements, Process & Target Plus | Spottail",
    metaDescription:
      "How to become a Target supplier: connecting with buyers, the Supplier Intake Form, Partners Online, GS1/EDI requirements, and how invite-only Target Plus works.",
    kicker: "US · Mass Retail · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Target",
    h1Post: "vendor",
    readTime: "10 min read",
    quickAnswer:
      "To become a Target vendor, **connect with a Target buyer first** — Target's process works best buyer-led — then complete the **Supplier Intake Form** with your business, product and operational details, and onboard through **Partners Online** with GS1 UPCs and EDI. You must be a **registered US business** meeting Target's operational and compliance standards. Note the marketplace distinction: **Target Plus is invite-only** — you can't apply; Target picks the brands.",
    facts: [
      { n: "1,950+", l: "US stores" },
      { n: "Invite", l: "only Target Plus marketplace" },
      { n: "75/75", l: "catalog rule on Target Plus" },
      { n: "Style", l: "led mass positioning" },
    ],
    intro:
      "Target is mass retail with a design sensibility — its buyers curate more like department store merchants than warehouse operators, which changes how you pitch. Brand story, packaging and trend fit carry real weight alongside price. The vendor machinery is still industrial (intake forms, Partners Online, EDI, compliance), and its marketplace is deliberately exclusive: Target Plus is invitation-only, which makes wholesale relationships and buyer connections matter even more.",
    routesHeading: { pre: "The three routes", em: "into Target" },
    routes: [
      {
        title: "Buyer connection → Supplier Intake Form",
        body: "Target's own guidance points here: make an initial connection with the category buyer, who helps you understand what Target needs and sponsors your path. Then the **Supplier Intake Form** captures legal and financial details, product specifications and certifications, and your operational capabilities — complete and accurate wins.",
      },
      {
        title: "Target Plus — invite-only",
        body: "Target Plus, the third-party marketplace on Target.com, cannot be applied to — **Target selects and invites brands**, typically those with proven DTC or marketplace performance, clean data and fast domestic fulfillment. If invited: onboarding includes activating at least 75% of your agreed catalog within 75 days. The practical strategy is to build the metrics that get you noticed.",
      },
      {
        title: "Programs & diverse supplier routes",
        body: "Target runs supplier diversity programs and accelerator initiatives (like Target Forward Founders) that create structured entry points for underrepresented and emerging brands — worth pursuing in parallel with buyer outreach if you qualify.",
      },
    ],
    requirements: [
      { k: "US business registration", v: "A registered US business entity meeting Target's operational and compliance requirements." },
      { k: "Product data standards", v: "SKU data, taxonomy, GS1 UPC barcodes, images and pricing matching Target's standards — data quality is assessed." },
      { k: "EDI & Partners Online", v: "EDI or channel integration, item-data submission, and Partners Online access for vendor operations." },
      { k: "Fulfillment (Target Plus)", v: "Domestic US fulfillment, fast ship speeds, approved carriers, inventory accuracy and a returns process." },
      { k: "Insurance & financials", v: "Product liability insurance, business documentation, tax and banking setup, category-specific compliance paperwork." },
      { k: "Compliance & testing", v: "Category-specific safety and regulatory compliance, with documentation ready." },
    ],
    note:
      "**Positioning note:** Target's merchants buy design-forward. The same product that pitches on price at Walmart pitches on brand, packaging and trend fit at Target. Know which story you're telling — and if you want Target Plus, build the public sales metrics that get brands invited.",
    steps: [
      { title: "Identify and connect with the buyer", body: "Category buyer outreach with a design-conscious deck, demand evidence and retail-ready pricing.", time: "1–3 months" },
      { title: "Complete the Supplier Intake Form", body: "Business, financial, product and operational details — thorough and accurate.", time: "Weeks 0–4" },
      { title: "Review & vetting", body: "Merchandising review, compliance and financial vetting, data standards checks.", time: "1–3 months" },
      { title: "Onboarding", body: "Partners Online setup, EDI integration, item data and logistics arrangements.", time: "1–3 months" },
      { title: "Launch", body: "Initial placement — often limited stores or online-first — with performance tracked closely.", time: "Launch" },
      { title: "Earn expansion", body: "Sell-through and operational scores drive store-count growth and range extensions.", time: "Ongoing" },
    ],
    costs: [
      { item: "GS1 membership & UPCs", range: "$250–$2,500 initial" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI / integration setup", range: "$5,000–$20,000" },
      { item: "Product testing & compliance", range: "$1,000–$5,000 per product" },
      { item: "Retail-ready packaging", range: "$10,000–$40,000" },
    ],
    costNote:
      "Target's design-led positioning means packaging investment genuinely moves the needle here — it's not vanity spend, it's what the merchant is buying.",
    tips: [
      { title: "Pitch the guest, not just the product.", body: "Target calls customers 'guests' and buys for them — show who your buyer is and why she's already a Target guest." },
      { title: "Make packaging a weapon.", body: "Target's shelf rewards design. Packaging that photographs well wins merchants and social feeds simultaneously." },
      { title: "Build Target Plus-worthy metrics.", body: "Fast fulfillment, low defect rates, strong DTC reviews — the invitation algorithm watches operational excellence." },
      { title: "Use diversity and founder programs.", body: "If you qualify, Target's supplier diversity commitments are genuine structured doors — use them alongside buyer outreach." },
    ],
    faqs: [
      { q: "How do I become a Target vendor?", a: "Connect with the category buyer first, then complete Target's Supplier Intake Form with business, product and operational details, and onboard through Partners Online with GS1 UPCs and EDI." },
      { q: "Can I apply to sell on Target Plus?", a: "No — Target Plus is invite-only. Target selects brands, typically on proven sales performance, data quality and fast domestic fulfillment. Build the metrics; the invitation follows." },
      { q: "What is the 75/75 rule?", a: "Target Plus sellers must activate at least 75% of their agreed product catalog within 75 days of signing." },
      { q: "What does Target look for in new brands?", a: "Design-forward products with a clear guest story, trend relevance, clean data and operational reliability — brand matters alongside price." },
      { q: "How long does Target onboarding take?", a: "Typically 6–12 months from buyer connection to shelf, depending on category review cycles." },
    ],
    sources: [
      { label: "Crisp — How to become a Target supplier", href: "https://www.gocrisp.com/learning-center/retailer-guides/how-to-become-a-target-supplier" },
      { label: "SupplierWiki — Target supplier guide", href: "https://supplierwiki.supplypike.com/articles/how-to-become-a-target-supplier" },
    ],
  },
  {
    slug: "costco",
    name: "Costco",
    country: "US",
    category: "Warehouse Club",
    cardBlurb: "High-volume, low-SKU club buying — regional buyers, Roadshows, and 15%-below pricing.",
    topGun: true,
    metaTitle: "How to Become a Costco Supplier: Vendor Requirements & Process | Spottail",
    metaDescription:
      "How to become a Costco vendor: regional buyer contacts, volume requirements (10,000+ units/SKU), club pricing expectations, Roadshows as an entry route, and costs.",
    kicker: "US · Warehouse Club · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Costco",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become a Costco supplier, contact the right buying office — **corporate buyers for non-food, regional buyer offices for food and sundries** — and submit a vendor inquiry with your business plan, certifications and insurance. The model is unforgiving on scale: expect **10,000+ units per SKU** production capacity and **pricing around 15% below other retail channels**. For small brands, **Roadshows and Special Events** are the real entry route — lighter requirements, in-warehouse proof of demand, and a track record Costco buyers trust.",
    facts: [
      { n: "600+", l: "US warehouses" },
      { n: "~4,000", l: "SKUs per warehouse (vs 30k+ supermarkets)" },
      { n: "10k+", l: "units/SKU capacity expected" },
      { n: "15%", l: "below other channels on price" },
    ],
    intro:
      "Costco's model is the inverse of a supermarket: a tiny number of SKUs (about 4,000 per warehouse) bought in enormous volume and sold at deliberately thin markups to members. Winning a pallet at Costco is transformative — and structurally hard, because every item must earn extraordinary velocity. The buyer's question isn't \"is this good?\" but \"can this sell a warehouse-load a week at a price 15% below everyone else?\" Roadshows exist precisely so smaller brands can answer that with evidence.",
    routesHeading: { pre: "The three routes", em: "into Costco" },
    routes: [
      {
        title: "Buyer offices — corporate & regional",
        body: "Non-food and sundries route to **corporate buyers**; food and sundries also work through **regional buying offices** by geography. Initial contact is a vendor inquiry with business plan, certifications and insurance documentation. Costco buying is relationship-driven and skeptical of unproven volume claims — evidence first.",
      },
      {
        title: "Roadshows & Special Events — the small-brand door",
        body: "Costco **Roadshows** (temporary in-warehouse selling events, typically 10–14 days) have far lighter requirements than full vendor status. You staff a table, sell your product, and generate the exact data — units per warehouse per day — that makes a buyer conversation concrete. Many permanent Costco items started as Roadshow successes.",
      },
      {
        title: "Regional first, national later",
        body: "Costco frequently tests items in a single region before national rollout. Pitching a regional buyer for a regional test lowers the volume bar and matches how Costco itself de-risks new items — align with it rather than pitching national on day one.",
      },
    ],
    requirements: [
      { k: "Volume capacity", v: "Production aligned with club volume — typically 10,000+ units per SKU, with the working capital to fund runs of that size." },
      { k: "Club pricing", v: "Pricing merchandise around 15% below other retail channels — Costco's member value proposition is structural, not negotiable." },
      { k: "Club packaging", v: "Bulk/multi-pack formats designed for pallet merchandising — your supermarket SKU almost never translates directly." },
      { k: "Certifications", v: "Quality and safety certifications appropriate to category (HACCP/GFSI for food; ISO/GMP where relevant)." },
      { k: "Vendor Code of Conduct", v: "Compliance with Costco's labor, environmental and safety standards — audited." },
      { k: "Insurance & financials", v: "Product liability insurance and financial standing to support club-scale purchase orders." },
    ],
    note:
      "**The math that matters:** one Costco item = one pallet position that must justify itself weekly. Buyers think in units per warehouse per week. If you can't credibly model that number, run a Roadshow and measure it — real warehouse data beats any projection.",
    steps: [
      { title: "Fit-check your economics", body: "Club pricing at 15% below market, bulk formats, 10k+ unit runs — confirm the model works before pitching.", time: "Weeks 0–4" },
      { title: "Contact the right buying office", body: "Corporate (non-food) or regional (food/sundries) with vendor inquiry, business plan and documentation.", time: "1–3 months" },
      { title: "Or: book a Roadshow", body: "Lighter-requirement entry — sell in-warehouse and harvest velocity data.", time: "2–4 months" },
      { title: "Buyer evaluation", body: "Category buyer review, pricing analysis, and facility audits for serious candidates.", time: "2–4 months" },
      { title: "Regional test", body: "Common first step — prove velocity in one region's warehouses.", time: "3–6 months" },
      { title: "National rollout", body: "Performance-driven expansion — and the volume step-change that comes with it.", time: "Ongoing" },
    ],
    costs: [
      { item: "Club-format packaging development", range: "$10,000–$50,000" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "Certifications & audits", range: "$3,000–$10,000 / year" },
      { item: "Roadshow costs (staff, travel, stock)", range: "$5,000–$20,000 per run" },
      { item: "Volume production working capital", range: "Substantial — 10k+ unit runs" },
    ],
    costNote:
      "Costco pays reliably and buys big, but the working capital demands of club-scale POs sink unprepared brands. Secure production financing before the pallet order arrives, not after.",
    tips: [
      { title: "Run the Roadshow play.", body: "It's the designed entry point for emerging brands: lighter requirements, real velocity data, and buyer relationships built on evidence." },
      { title: "Redesign for the pallet.", body: "Club packs, display-ready pallets, bulk formats — show the buyer you understand the warehouse, not just the product." },
      { title: "Protect your other channels.", body: "The 15%-below rule creates channel conflict. Plan your pricing architecture (pack sizes, exclusives) so Costco doesn't torch your other retail relationships." },
      { title: "Model units per warehouse per week.", body: "It's the number the buyer is silently calculating. Bring your own credible version of it." },
    ],
    faqs: [
      { q: "How do I contact a Costco buyer?", a: "Non-food goes to corporate buying offices; food and sundries route through regional buyer offices by geography. Initial contact is a vendor inquiry with business plan, certifications and insurance." },
      { q: "What volume does Costco expect?", a: "Typically 10,000+ units per SKU production capacity — club buying is high-volume, low-SKU by design." },
      { q: "What is a Costco Roadshow?", a: "A temporary in-warehouse selling event (usually 10–14 days) with lighter requirements than full vendor status — the classic proving ground for smaller brands." },
      { q: "What pricing does Costco require?", a: "Merchandise priced around 15% below other retail channels — the member value model is structural. Plan your channel architecture accordingly." },
      { q: "How long does becoming a Costco vendor take?", a: "6–12+ months for a full listing; Roadshows can be arranged in 2–4 months and often accelerate everything after." },
    ],
    sources: [
      { label: "Costco vendor inquiry guidance (OIS)", href: "https://ordersinseconds.com/how-to-get-your-product-into-costco/" },
      { label: "Vividly — working with Costco", href: "https://www.govividly.com/blog/working-with-costco-a-guide-for-cpg-brands" },
    ],
  },
  {
    slug: "kroger",
    name: "Kroger",
    country: "US",
    category: "Grocery",
    cardBlurb: "America's largest supermarket operator — Go Fresh & Local accelerator plus standard vendor routes.",
    topGun: true,
    metaTitle: "How to Become a Kroger Supplier: Go Fresh & Local + Vendor Process | Spottail",
    metaDescription:
      "How to become a Kroger supplier: the Go Fresh & Local Supplier Accelerator (via RangeMe/ECRM), standard vendor onboarding, requirements, timelines and costs.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Kroger",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become a Kroger supplier, apply through the **Go Fresh & Local Supplier Accelerator** — Kroger's structured program for local and emerging producers, run with **RangeMe and ECRM**, where category managers review applications in rounds and finalists pitch Kroger executives — or pursue the standard vendor route via Kroger's supplier onboarding with your category manager. Kroger operates **2,700+ stores across multiple banners**, so a listing can mean regional divisions first, national later.",
    facts: [
      { n: "2,700+", l: "stores across banners" },
      { n: "#1", l: "US supermarket operator" },
      { n: "Rounds", l: "based accelerator reviews" },
      { n: "Fresh", l: "categories prioritized" },
    ],
    intro:
      "Kroger is America's largest traditional supermarket operator — a family of banners (Kroger, Ralphs, Fred Meyer, King Soopers and more) organized into regional divisions that buy with real autonomy. That structure is your opportunity: you don't need to win 2,700 stores at once. Go Fresh & Local formalizes the on-ramp for local producers, and division-level listings are how most emerging brands actually get in.",
    routesHeading: { pre: "The three routes", em: "into Kroger" },
    routes: [
      {
        title: "Go Fresh & Local Supplier Accelerator",
        body: "Kroger's [accelerator](https://www.thekrogerco.com/vendor-suppliers/go-fresh-local/) — run with ECRM and RangeMe — reviews applications in multiple rounds across fresh categories (produce, floral, deli, bakery, dairy, meat & seafood, specialty cheese). Finalists present to category managers and executives, with winners gaining listings and support. It's a genuine pathway built for local businesses of all sizes.",
      },
      {
        title: "Division-level buying",
        body: "Kroger's regional divisions range products for their geography — a local brand can win its home division without a national listing. Pitch the division category manager with local demand evidence; strong divisional velocity is then the internal case for expansion.",
      },
      {
        title: "Standard vendor onboarding",
        body: "Established brands work through Kroger's supplier processes: category manager engagement, vendor agreements, and Kroger's supplier portal ecosystem for item setup, compliance and data. RangeMe profiles support discovery here too.",
      },
    ],
    requirements: [
      { k: "Food safety", v: "GFSI-recognized certification appropriate to category and scale; fresh categories carry their own safety and cold-chain requirements." },
      { k: "Insurance", v: "Product liability insurance at grocery-retail levels with Kroger's required endorsements." },
      { k: "Item data & UPCs", v: "GS1 UPCs and complete item data through Kroger's systems." },
      { k: "EDI capability", v: "Electronic trading for stocked vendors." },
      { k: "Capacity (divisional)", v: "Ability to supply your division reliably — hundreds of stores, not thousands, to start." },
      { k: "Local credentials", v: "For Go Fresh & Local: American-grown/produced, with the local story and provenance documented." },
    ],
    note:
      "**Structural advantage:** Kroger's divisional autonomy means a Cincinnati brand pitches Cincinnati, not America. Win your home division with local identity and velocity, and the expansion conversation comes to you.",
    steps: [
      { title: "Choose your entry", body: "Go Fresh & Local (fresh categories, local story) or division category manager (everything else).", time: "Week 0" },
      { title: "Apply / pitch", body: "Accelerator application via RangeMe/ECRM in its rounds, or direct divisional pitch with local demand evidence.", time: "1–3 months" },
      { title: "Category review", body: "Category managers assess fit, differentiation and commercials; accelerator finalists pitch panels.", time: "1–3 months" },
      { title: "Vendor setup", body: "Agreements, insurance, item data, EDI and compliance onboarding.", time: "1–3 months" },
      { title: "Divisional launch", body: "Land in your division's stores; velocity and availability tracked from week one.", time: "Launch" },
      { title: "Expand across divisions", body: "Divisional success is the internal currency for cross-division and national ranging.", time: "Ongoing" },
    ],
    costs: [
      { item: "Food safety certification", range: "$2,000–$8,000 / year" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "EDI setup", range: "$3,000–$15,000" },
      { item: "GS1 UPCs & item data", range: "$250–$2,500 initial" },
      { item: "Promotional programs", range: "2–6% of sales" },
    ],
    costNote:
      "Kroger's promotional ecosystem (digital coupons, loyalty pricing) is data-driven and effectively expected — budget participation, and treat their loyalty data as part of what you're buying.",
    tips: [
      { title: "Lead with local.", body: "Kroger has institutionalized wanting local products — Go Fresh & Local exists because it works. Make your provenance impossible to miss." },
      { title: "Know your division.", body: "Each division has its own category managers and competitive dynamics. Pitch the geography you can actually serve." },
      { title: "Watch accelerator windows.", body: "Go Fresh & Local runs in application rounds — track announcements via Kroger, ECRM and RangeMe so you don't miss the cycle." },
      { title: "Use loyalty data once you're in.", body: "Kroger's data ecosystem (84.51°) is among retail's best — performing brands that engage with it earn merchant attention." },
    ],
    faqs: [
      { q: "What is Kroger's Go Fresh & Local Supplier Accelerator?", a: "Kroger's structured program for local and emerging producers across fresh categories, run with ECRM and RangeMe — applications reviewed in rounds, finalists pitching category managers and executives for listings." },
      { q: "Can I get into just my regional Kroger division?", a: "Yes — divisions range products for their geography, and divisional listings are the most common entry for emerging brands. Home-division velocity then drives expansion." },
      { q: "What categories does Go Fresh & Local cover?", a: "Fresh-focused: produce, floral, deli, bakery, specialty cheese, dairy, meat and seafood." },
      { q: "What are Kroger's baseline requirements?", a: "Category-appropriate food safety certification, product liability insurance, GS1 UPCs, complete item data and EDI trading." },
      { q: "How long does a Kroger listing take?", a: "Accelerator cycles run on their round timetables; standard divisional listings typically take 4–9 months from pitch to shelf." },
    ],
    sources: [
      { label: "Kroger — Go Fresh & Local", href: "https://www.thekrogerco.com/vendor-suppliers/go-fresh-local/" },
      { label: "RangeMe — Kroger accelerator FAQ", href: "https://help.rangeme.com/hc/en-us/articles/1500008848221-Kroger-s-Go-Fresh-Local-Supplier-Accelerator-FAQ" },
    ],
  },
  {
    slug: "home-depot",
    name: "Home Depot",
    country: "US",
    category: "Home Improvement",
    cardBlurb: "The #1 home improvement retailer — New Product Submission with a 60-day merchant response.",
    topGun: true,
    metaTitle: "How to Become a Home Depot Supplier: Vendor Application & Requirements | Spottail",
    metaDescription:
      "How to become a Home Depot vendor: the New Product Submission site, Supplier Hub registration, 60-day merchant review, EDI and compliance requirements, and costs.",
    kicker: "US · Home Improvement · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Home Depot",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become a Home Depot supplier, submit your product through Home Depot's **New Product Submission site** — the Merchant Team responds **within 60 days** — then complete registration and documentation through the **Supplier Hub**. Onboarding is structured: submission review, buyer contact, pitch, **EDI testing, item setup, first PO and distribution center shipping**, with insurance, packaging and labeling standards enforced throughout. Routes exist for both in-store and online (homedepot.com) assortments.",
    facts: [
      { n: "2,000+", l: "US stores" },
      { n: "60", l: "day merchant response window" },
      { n: "#1", l: "home improvement retailer" },
      { n: "2", l: "assortments: in-store & online" },
    ],
    intro:
      "Home Depot is the world's largest home improvement retailer, and its supplier process is one of the more transparent in US big-box retail: a public submission site, a stated 60-day merchant response, and a documented onboarding path. The filter is operational: pro-grade compliance, EDI, packaging and DC logistics. The online assortment (homedepot.com carries far more SKUs than stores) is the underused door for emerging brands.",
    routesHeading: { pre: "The three routes", em: "into Home Depot" },
    routes: [
      {
        title: "New Product Submission — the front door",
        body: "Prospective merchandise suppliers submit through Home Depot's [New Product Submission process](https://supplierhub-prospective.homedepot.com/hc/en-us/articles/360034558452-Becoming-a-Supplier), with the Merchant Team responding within 60 days. Submissions with clear category fit, pro/DIY relevance and demand evidence progress to buyer contact and pitch.",
      },
      {
        title: "Online assortment first",
        body: "Homedepot.com ranges vastly more SKUs than physical stores — and online-only vendor programs carry lighter shelf-competition. Proving velocity online is the modern route to an in-store planogram conversation; the merchant sees your conversion data either way.",
      },
      {
        title: "Trade shows & category reviews",
        body: "Hardware and home improvement buying still runs through the show circuit (National Hardware Show and category line reviews). Merchant line reviews are where assortments get decided — ask your merchant when your category reviews and build your pitch to that calendar.",
      },
    ],
    requirements: [
      { k: "Business & insurance", v: "Registered business with product liability insurance at Home Depot's required levels; documentation submitted via Supplier Hub." },
      { k: "EDI capability", v: "Full EDI trading with testing completed before first PO — orders, ASNs, invoices." },
      { k: "Packaging & labeling", v: "Home Depot's packaging and labeling guidelines, engineered for big-box handling and DC flow-through." },
      { k: "Product compliance", v: "Category-specific certifications (UL/ETL for electrical, EPA registrations, CARB, Prop 65 labeling) with test documentation." },
      { k: "DC logistics", v: "Shipping into Home Depot's distribution network at appointment-level reliability." },
      { k: "Item data", v: "GS1 UPCs and complete item data including rich content for homedepot.com." },
    ],
    note:
      "**Compliance note:** home improvement is regulation-dense — UL listings, EPA, CARB, Prop 65. Merchants can't advance non-compliant products regardless of enthusiasm, so arrive with certificates, not intentions.",
    steps: [
      { title: "Submit your product", body: "New Product Submission with specs, imagery, compliance status and demand evidence.", time: "Day 0" },
      { title: "Merchant review", body: "The Merchant Team responds within 60 days — successful submissions get buyer contact and next steps.", time: "≤60 days" },
      { title: "Pitch & line review", body: "Category pitch aligned to line review calendars; pricing, assortment role and channel (store/online) agreed.", time: "1–4 months" },
      { title: "Supplier Hub onboarding", body: "Registration, documentation, insurance verification and compliance checks.", time: "1–2 months" },
      { title: "EDI testing & item setup", body: "Systems integration, item data loading, packaging verification.", time: "1–2 months" },
      { title: "First PO & DC shipping", body: "Launch through the distribution network — operational scorecards begin immediately.", time: "Launch" },
    ],
    costs: [
      { item: "Product certifications (UL/ETL etc.)", range: "$2,000–$20,000 per product line" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI setup & testing", range: "$5,000–$20,000" },
      { item: "Big-box packaging engineering", range: "$5,000–$30,000" },
      { item: "GS1 UPCs & content", range: "$250–$2,500 initial" },
    ],
    costNote:
      "Certification is the long-lead item in this category — UL listings can take months. Start compliance before your submission, not after the merchant says yes.",
    tips: [
      { title: "Pitch the pro and the DIYer.", body: "Home Depot merchants think in both customers. Know which your product serves and what it replaces in the current set." },
      { title: "Use the online assortment strategically.", body: "Online-first listing lowers the entry bar and generates the conversion data that wins planogram space." },
      { title: "Align to line reviews.", body: "Assortment decisions happen on category calendars. A great pitch at the wrong time waits a year." },
      { title: "Engineer packaging for the aisle.", body: "Big-box packaging works harder than grocery: forklift-proof, shelf-ready, and self-selling to an unassisted customer." },
    ],
    faqs: [
      { q: "How do I submit a product to Home Depot?", a: "Through Home Depot's New Product Submission site for prospective merchandise suppliers — the Merchant Team responds within 60 days with next steps." },
      { q: "What is the Supplier Hub?", a: "Home Depot's registration and documentation platform where new vendors submit applications, company details, certifications and compliance paperwork." },
      { q: "What compliance do products need?", a: "Category-specific: UL/ETL for electrical, EPA registrations, CARB compliance, Prop 65 labeling and more — with test documentation ready at pitch." },
      { q: "Can I sell online only?", a: "Yes — homedepot.com carries a far larger assortment than stores, and online-first vendor routes are a genuine entry path that builds the case for store placement." },
      { q: "How long does Home Depot onboarding take?", a: "60 days for initial merchant response, then typically 4–9 months through pitch, onboarding, EDI testing and first PO." },
    ],
    sources: [
      { label: "Home Depot — Becoming a Supplier", href: "https://supplierhub-prospective.homedepot.com/hc/en-us/articles/360034558452-Becoming-a-Supplier" },
      { label: "Orderful — Home Depot EDI guide", href: "https://www.orderful.com/blog/how-to-sell-to-home-depot-edi-requirements" },
    ],
  },
  {
    slug: "whole-foods",
    name: "Whole Foods",
    country: "US",
    category: "Natural Grocery",
    cardBlurb: "The natural & organic benchmark — local producer programs, LEAP accelerator, UNFI/KeHE required.",
    topGun: false,
    metaTitle: "How to Become a Whole Foods Supplier: Requirements, LEAP & Process | Spottail",
    metaDescription:
      "How to get into Whole Foods: the Local & Regional Producer route, LEAP accelerator, quality standards, $2M insurance, UNFI/KeHE distribution, timelines and costs.",
    kicker: "US · Natural Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Whole Foods",
    h1Post: "supplier",
    readTime: "11 min read",
    quickAnswer:
      "To become a Whole Foods supplier, apply through the **Local and Regional Producer Program** (the strongest entry point for emerging brands) or the standard **Supplier Portal**, and meet the bars that define Whole Foods: **quality standards with banned-ingredient compliance, $2M product liability insurance with Whole Foods as additional insured, and distribution through UNFI or KeHE** (60–90 days to set up). The **LEAP accelerator** offers emerging local brands a 12-week program with shelf placement consideration. Full timeline: **3–9 months**, typically starting with a **5–15 store test**.",
    facts: [
      { n: "500+", l: "US stores" },
      { n: "$2M", l: "liability insurance required" },
      { n: "5–15", l: "store typical launch test" },
      { n: "12wk", l: "LEAP accelerator program" },
    ],
    intro:
      "Whole Foods remains the credibility benchmark for natural and organic brands — a listing signals quality to every other retailer in the country. Its requirements match the reputation: the strictest ingredient standards in mainstream grocery, mandatory distributor relationships, and region-by-region buying that starts brands small and scales the ones that prove velocity. For the right product, the local-first architecture is a gift: you don't pitch 500 stores, you pitch your region.",
    routesHeading: { pre: "The three routes", em: "into Whole Foods" },
    routes: [
      {
        title: "Local & Regional Producer Program",
        body: "The strongest entry point: Whole Foods gives genuine preference to brands local to a store or region, with **local foragers** historically scouting exactly these products. Apply with your regional story front and center — it's one of the most reliable ways to reach an initial buyer meeting.",
      },
      {
        title: "LEAP — the Local and Emerging Accelerator Program",
        body: "**LEAP** advances partnerships with local and emerging suppliers: selected participants complete a 12-week educational curriculum with mentorship and are considered for shelf placement in their home region. For early-stage natural brands, it's a structured on-ramp with Whole Foods' own team teaching you their system.",
      },
      {
        title: "Supplier Portal + distributor route",
        body: "The standard route runs through Whole Foods' supplier processes — and almost always **through UNFI or KeHE**: Whole Foods generally requires distributor supply rather than direct shipping. [UNFI setup](/become-a-supplier/unfi) is its own 60–90 day process with its own costs; run it in parallel, not after.",
      },
    ],
    requirements: [
      { k: "Quality standards", v: "Whole Foods' banned-ingredients list (no artificial preservatives, colors, flavors, hydrogenated fats), with organic certification and Non-GMO verification where applicable." },
      { k: "Ingredient transparency", v: "Complete ingredient lists with origin and organic status documentation." },
      { k: "Insurance", v: "Minimum $2M product liability coverage with Whole Foods Market named as additional insured." },
      { k: "Distribution", v: "UNFI (primary) or KeHE distributor relationship — budget 60–90 days for setup if you're not in their systems." },
      { k: "Local credentials", v: "For local programs: genuine regional production with the provenance to prove it." },
      { k: "Pricing architecture", v: "Margin structure that survives distributor fees (12–28% of wholesale) plus retailer margin plus promotions." },
    ],
    note:
      "**The distributor reality:** Whole Foods rarely buys direct — UNFI/KeHE sit in the middle, taking 12–28% of wholesale. Price your product from the shelf backwards through retailer margin *and* distributor margin, or the listing loses money elegantly.",
    steps: [
      { title: "Verify standards compliance", body: "Every ingredient against the banned list; organic and Non-GMO documentation in order.", time: "Weeks 0–4" },
      { title: "Apply — local program or LEAP", body: "Regional producer application or accelerator cohort with your local story leading.", time: "1–2 months" },
      { title: "Start distributor setup in parallel", body: "UNFI or KeHE onboarding — 60–90 days, its own requirements and costs.", time: "2–3 months" },
      { title: "Buyer/forager review", body: "Regional buyer evaluates product, standards fit and pricing; samples and meetings follow.", time: "1–3 months" },
      { title: "Launch in 5–15 stores", body: "The standard test: prove velocity in an initial store set.", time: "Launch" },
      { title: "Scale by region", body: "Velocity in the test set earns regional then multi-region expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance ($2M)", range: "$2,000–$6,000 / year" },
      { item: "UNFI/KeHE distributor margin", range: "12–28% of wholesale" },
      { item: "Distributor programs & promos", range: "$2,000–$40,000+ / year" },
      { item: "Organic/Non-GMO certification", range: "$1,500–$5,000 / year" },
      { item: "Free-fill & demo programs", range: "Common at launch — budget stock" },
    ],
    costNote:
      "Stack the full chain before signing: distributor margin, retailer margin, promotional programs, demos and free-fill. Whole Foods velocity is real, but underpriced natural brands die profitable-looking deaths here.",
    tips: [
      { title: "Lead with region, not nation.", body: "The local architecture is the door. Your hometown store set is winnable in months; national isn't." },
      { title: "Apply to LEAP if you qualify.", body: "Twelve weeks of Whole Foods teaching you Whole Foods, with shelf consideration attached — the highest-value accelerator in natural retail." },
      { title: "Start UNFI setup immediately.", body: "The 60–90 day distributor runway is the schedule-killer. Parallel-path it from your first buyer conversation." },
      { title: "Prove velocity with demos.", body: "In-store demos drive natural-channel velocity like nothing else. Budget them for your 5–15 store test and watch the numbers." },
    ],
    faqs: [
      { q: "How do I become a Whole Foods supplier?", a: "Apply through the Local and Regional Producer Program (the best entry for emerging brands) or the Supplier Portal — meeting quality standards, $2M insurance requirements, and setting up distribution through UNFI or KeHE." },
      { q: "What is LEAP?", a: "Whole Foods' Local and Emerging Accelerator Program — a 12-week curriculum with mentorship for local and emerging suppliers, with participants considered for shelf placement in their home region." },
      { q: "Do I need a distributor for Whole Foods?", a: "Almost always yes — UNFI (primary) or KeHE. Setup takes 60–90 days with its own requirements, so start it in parallel with your Whole Foods conversations." },
      { q: "What insurance does Whole Foods require?", a: "Minimum $2M product liability coverage with Whole Foods Market named as an additional insured." },
      { q: "How long does it take to get into Whole Foods?", a: "3–9 months from first contact to shelf, typically launching in a 5–15 store test where velocity determines expansion." },
    ],
    sources: [
      { label: "Opener — Whole Foods vendor requirements", href: "https://blog.getopener.ai/whole-foods-vendor-requirements-shelf-space" },
      { label: "Vividly — working with Whole Foods", href: "https://www.govividly.com/blog/working-with-whole-foods-market-a-guide-for-cpg-brands" },
    ],
  },
  {
    slug: "trader-joes",
    name: "Trader Joe's",
    country: "US",
    category: "Grocery",
    cardBlurb: "Cult grocer with a unique model — ~80% private label, no public application, buyer-led.",
    topGun: false,
    metaTitle: "How to Become a Trader Joe's Supplier: The Private-Label Reality | Spottail",
    metaDescription:
      "How Trader Joe's buying actually works: no public application, ~80% private label, direct-to-DC supply, buyer outreach strategies, and what it takes to supply them.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to supply",
    h1Em: "Trader Joe's",
    h1Post: "",
    readTime: "9 min read",
    quickAnswer:
      "Trader Joe's has **no public supplier application** — and roughly **80% of its range is private label**, so the realistic route for most companies is becoming a **private-label manufacturing partner**: producing a Trader Joe's-branded product to their spec, under strict confidentiality. Getting noticed means **direct buyer outreach** (corporate office, category buyers, LinkedIn/RangeMe presence) with a genuinely differentiated product. Suppliers must deliver **directly to Trader Joe's distribution centers** on strictly scheduled appointments.",
    facts: [
      { n: "560+", l: "US stores" },
      { n: "~80%", l: "of range is private label" },
      { n: "0", l: "public application routes" },
      { n: "DC", l: "direct delivery required" },
    ],
    intro:
      "Trader Joe's is the most idiosyncratic buyer in American grocery: a cult brand built on a tightly curated, overwhelmingly private-label range, sourced quietly from manufacturers who sign strict confidentiality agreements. There's no submission portal and no vendor fair — buyers find products, taste relentlessly, and convert winners into Trader Joe's-branded items. Supplying them is a manufacturing partnership more than a brand listing, and for the right producer it's transformative volume with zero marketing cost.",
    routesHeading: { pre: "The three routes", em: "into Trader Joe's" },
    routes: [
      {
        title: "Private-label manufacturing — the main door",
        body: "Most Trader Joe's products are made by established brand manufacturers and specialists under the TJ's label. If you have real production capability and a distinctive product, the pitch is: this, as a Trader Joe's item, at this cost, at this volume. Confidentiality is standard — many suppliers are never publicly known.",
      },
      {
        title: "Direct buyer outreach",
        body: "With no portal, discovery is human: call the corporate office and identify the buyer and assistant buyers for your category, connect on LinkedIn and RangeMe, and get samples into their hands. Trade bureau introductions and industry press visibility help. Persistence with courtesy is the operating mode.",
      },
      {
        title: "Be findable where buyers hunt",
        body: "TJ's buyers famously scout — trade shows (Fancy Food Show and category equivalents), trending DTC products, and regional favorites. Building a product with obvious cult potential and visible demand is itself a route: they often come to you.",
      },
    ],
    requirements: [
      { k: "Production capability", v: "Manufacturing capacity for chain-wide volume at consistent quality — TJ's ranges few items and expects each to perform." },
      { k: "Direct-to-DC logistics", v: "Delivery to Trader Joe's distribution centers on strictly scheduled appointments — no third-party distributor layer." },
      { k: "Confidentiality", v: "Private-label agreements typically include strict NDAs — supplying TJ's is often invisible by contract." },
      { k: "Cost structure", v: "Value pricing is core to the model — your manufacturing economics must support TJ's famous price points." },
      { k: "Quality & standards", v: "Product quality, sustainability and ethical practice standards applied through their sourcing decisions." },
      { k: "Differentiation", v: "The range is curated for distinctiveness — me-too products don't get shelf; genuinely novel ones do." },
    ],
    note:
      "**Strategic framing:** pitching Trader Joe's is closer to winning a manufacturing contract than a retail listing. Your brand likely won't appear; your product, renamed, might sell in 560 stores. Decide whether that trade — volume and validation for anonymity — fits your strategy before you invest in the chase.",
    steps: [
      { title: "Confirm the model fits", body: "Private-label economics, DC logistics, confidentiality — this is a manufacturing partnership decision.", time: "Week 0" },
      { title: "Identify your buyer", body: "Corporate office, LinkedIn, RangeMe and trade contacts — find the category buyer by name.", time: "Weeks 0–8" },
      { title: "Get samples tasted", body: "TJ's decisions are product-led. Samples with a tight cost/volume proposition beat decks.", time: "1–3 months" },
      { title: "Category evaluation", body: "Tasting panels and category review — differentiation and cost drive the decision.", time: "1–4 months" },
      { title: "Private-label development", body: "Spec, packaging (their design), and agreement — under confidentiality.", time: "2–6 months" },
      { title: "DC delivery & performance", body: "Strict appointment logistics; velocity decides an item's survival in a ruthlessly curated range.", time: "Ongoing" },
    ],
    costs: [
      { item: "Sample & pitch investment", range: "$500–$3,000" },
      { item: "Production scale-up capital", range: "Substantial — chain-wide volume" },
      { item: "DC logistics capability", range: "3PL or fleet — appointment-grade" },
      { item: "Marketing", range: "$0 — TJ's does it all" },
      { item: "Margin trade-off", range: "Manufacturer margins, high volume" },
    ],
    costNote:
      "The economics mirror M&S in the UK: no marketing cost and committed volume, at manufacturer margins under someone else's brand. Powerful for funding growth — just know what you're trading.",
    tips: [
      { title: "Pitch product-first.", body: "TJ's is run by tasters. A remarkable sample with clean costings is the entire pitch — save the brand deck." },
      { title: "Respect the confidentiality culture.", body: "Publicly claiming TJ's supply relationships breaks the norm (and often the contract). Discretion is part of the deal." },
      { title: "Build cult signals.", body: "Buyers scout trending products. Regional cult status, DTC virality and Fancy Food Show buzz are how they find you." },
      { title: "Nail DC logistics before you commit.", body: "Their delivery appointments are notoriously tight. Prove you can hit them or the relationship dies operationally." },
    ],
    faqs: [
      { q: "Does Trader Joe's have a supplier application?", a: "No — there's no public application or portal. Buyers discover products through outreach, scouting and industry networks, and most supply runs through private-label manufacturing agreements." },
      { q: "Can my brand be stocked in Trader Joe's?", a: "Rarely as your brand — roughly 80% of the range is Trader Joe's private label. The realistic route is manufacturing a TJ's-branded product to their specification." },
      { q: "How do I reach a Trader Joe's buyer?", a: "Identify the category buyer via the corporate office, connect on LinkedIn/RangeMe, use trade introductions, and get samples in front of them. Product quality does the persuading." },
      { q: "What logistics does Trader Joe's require?", a: "Direct delivery to their distribution centers on strictly scheduled appointments — no distributor intermediary." },
      { q: "Is supplying Trader Joe's worth the anonymity?", a: "For manufacturers, often yes: chain-wide committed volume, zero marketing cost, and cult-brand velocity. For brand-builders, it's a strategic trade to weigh deliberately." },
    ],
    sources: [
      { label: "Mr. Checkout — how to get into Trader Joe's", href: "https://mrcheckout.net/how-to-get-into-trader-joes/" },
      { label: "Zipline — TJ's supplier logistics", href: "https://ziplinelogistics.com/blog/trader-joes-suppliers-retail-specialized-logistics/" },
    ],
  },
  {
    slug: "sprouts",
    name: "Sprouts",
    country: "US",
    category: "Natural Grocery",
    cardBlurb: "The #1 launchpad for emerging natural brands — open submissions with a published process.",
    topGun: false,
    metaTitle: "How to Become a Sprouts Supplier: New Item Submission Process | Spottail",
    metaDescription:
      "How to get into Sprouts Farmers Market: the new item submission process, category calendars, sample shipping, KeHE distribution, Expo West, timelines and costs.",
    kicker: "US · Natural Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Sprouts",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Sprouts supplier, submit through **Sprouts' new item submission process** (about.sprouts.com) — covering grocery, dairy, frozen, bulk, vitamins, body care and produce — or email **submissions@sprouts.com** for meat, seafood, bakery and deli. Ship **samples to their Phoenix HQ** labeled by brand and category. Some categories follow a **submission calendar**, and category managers reach out if items progress. Sprouts is the most innovation-hungry major natural retailer — and its primary distributor is **KeHE**.",
    facts: [
      { n: "440+", l: "stores in 20+ states" },
      { n: "#1", l: "launchpad reputation in natural" },
      { n: "KeHE", l: "primary distribution partner" },
      { n: "Mar", l: "Expo West — where they scout" },
    ],
    intro:
      "Sprouts Farmers Market has deliberately positioned itself as the place where emerging natural brands break out — an innovation-first assortment strategy, published submission processes, and buyers who treat finding the next big thing as the job. For early-stage health, wellness and natural food brands, it's frequently the first major chain listing — and its performance data carries weight with every other natural-channel buyer.",
    routesHeading: { pre: "The three routes", em: "into Sprouts" },
    routes: [
      {
        title: "New item submission — the published process",
        body: "Sprouts' [submission process](https://about.sprouts.com/new-item-submission-process/) covers grocery, dairy, frozen, bulk, vitamins, body care and produce — with fresh departments (meat, seafood, bakery, deli) going to submissions@sprouts.com. Mail samples to their Phoenix HQ labeled by brand and category; confirmation comes by email and category managers reach out if you progress. Watch the **submission calendar** — some categories batch reviews.",
      },
      {
        title: "Expo West & the trade circuit",
        body: "Sprouts brings a significant buying contingent to **Natural Products Expo West** each March — the highest-density scouting event in the natural channel. A booth or well-orchestrated meetings there put your product in front of the exact category managers reviewing your submission.",
      },
      {
        title: "KeHE distribution alignment",
        body: "Sprouts' primary distributor is **KeHE** — being in KeHE's system (or ready to onboard) removes the operational friction from a yes. Distributor setup runs its own timeline, so parallel-path it with your submission. See also the [UNFI guide](/become-a-supplier/unfi) for how natural-channel distribution works.",
      },
    ],
    requirements: [
      { k: "Natural-channel standards", v: "Clean ingredient decks aligned with natural retail expectations — Sprouts' assortment skews attribute-rich (organic, non-GMO, functional)." },
      { k: "Capacity & distribution", v: "Significant capacity, distribution, insurance and marketing requirements to support Sprouts stores — their stated bar for suppliers." },
      { k: "Samples & data", v: "Physical samples to Phoenix plus complete product information through the submission process." },
      { k: "KeHE relationship", v: "Distribution through Sprouts' primary distributor (or a credible plan to onboard)." },
      { k: "Insurance", v: "Product liability insurance at grocery-retail levels." },
      { k: "Marketing participation", v: "Promotional and marketing program participation — innovation-led retail still runs on promotion." },
    ],
    note:
      "**Why Sprouts first:** its innovation-set strategy means buyers actively want what bigger chains wait to see proven. A Sprouts launch generates the natural-channel velocity data that [Whole Foods](/become-a-supplier/whole-foods) and conventional-grocery natural sets respect — it's the designed first rung of the ladder.",
    steps: [
      { title: "Check the category calendar", body: "Some categories review in set windows — align your submission to the cycle.", time: "Week 0" },
      { title: "Submit + ship samples", body: "Online submission with complete data; samples to Phoenix HQ labeled by brand and category.", time: "Weeks 0–4" },
      { title: "Category manager review", body: "Confirmation by email; category managers contact brands that progress.", time: "1–3 months" },
      { title: "Meetings & commercial terms", body: "Assortment role, pricing, promotional plan and distribution setup.", time: "1–3 months" },
      { title: "KeHE onboarding", body: "Distributor setup if not already in system — run in parallel where possible.", time: "1–3 months" },
      { title: "Launch & prove velocity", body: "Innovation sets are measured fast — early velocity decides expansion and renewal.", time: "Ongoing" },
    ],
    costs: [
      { item: "Samples & shipping", range: "$200–$1,000" },
      { item: "KeHE distributor margin", range: "% of wholesale — program-dependent" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "Promotional programs", range: "3–8% of sales" },
      { item: "Expo West presence (optional)", range: "$5,000–$30,000" },
    ],
    costNote:
      "Sprouts is accessible but not free — distributor margins and promotional participation are real. The compensation: faster yes, innovation-friendly buyers, and data every other natural buyer respects.",
    tips: [
      { title: "Lead with attributes.", body: "Organic, functional, free-from, novel ingredients — Sprouts merchandises attributes. Make yours unmissable in the submission." },
      { title: "Time submissions to the calendar.", body: "Batched category reviews mean a mistimed submission waits months. Ask, then align." },
      { title: "Work Expo West properly.", body: "Book Sprouts meetings ahead of the show — their buying contingent's calendar fills before the doors open." },
      { title: "Have KeHE conversations early.", body: "A yes with no distribution plan stalls. Parallel-path distributor onboarding from your first submission." },
    ],
    faqs: [
      { q: "How do I submit a product to Sprouts?", a: "Through Sprouts' new item submission process for grocery, dairy, frozen, bulk, vitamins, body care and produce — or submissions@sprouts.com for meat, seafood, bakery and deli — with samples mailed to their Phoenix HQ." },
      { q: "Does Sprouts have a submission calendar?", a: "Yes — some categories batch all submissions into set windows. Check the calendar and time your submission to the cycle." },
      { q: "Who distributes to Sprouts?", a: "KeHE is Sprouts' primary distribution partner — being in (or ready to join) KeHE's system smooths the path from yes to shelf." },
      { q: "Is Sprouts good for emerging brands?", a: "It's arguably the best major-chain launchpad in US natural retail — innovation-first assortment strategy and buyers actively hunting new brands." },
      { q: "How long does the Sprouts process take?", a: "Typically 3–7 months from submission to shelf, depending on category calendars and distribution setup." },
    ],
    sources: [
      { label: "Sprouts — New Item Submission Process", href: "https://about.sprouts.com/new-item-submission-process/" },
      { label: "Sprouts — new vendor FAQ", href: "https://www.sprouts.com/faqs/how-can-i-become-a-new-vendor-at-sprouts/" },
    ],
  },
  {
    slug: "cvs",
    name: "CVS",
    country: "US",
    category: "Drug & Convenience",
    cardBlurb: "9,000+ locations across health, beauty and consumables — submissions via RangeMe.",
    topGun: false,
    metaTitle: "How to Become a CVS Supplier: RangeMe Submissions & Line Reviews | Spottail",
    metaDescription:
      "How to get your product into CVS: the RangeMe submission portal, category line review cycles, WERCS registration, supplier onboarding, timelines and costs.",
    kicker: "US · Drug & Convenience · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "CVS",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a CVS supplier, submit your products through **RangeMe** — CVS's official submission portal for new suppliers, for both stores and CVS.com. Each category has a **Category Manager who reviews submissions during line review cycles** (assortment resets), so timing matters. Regulated products require **WERCS registration before New Item Forms**, and supplier onboarding runs through CVS's systems (cvssuppliers.com). Complete, specific submissions win: CVS buyers pass quickly on vague profiles.",
    facts: [
      { n: "9,000+", l: "US locations" },
      { n: "Line", l: "review cycles decide resets" },
      { n: "RangeMe", l: "official submission portal" },
      { n: "H&B", l: "health & beauty core" },
    ],
    intro:
      "CVS is one of America's biggest retail footprints — a health-led chain where beauty, wellness, OTC and consumables fight for compact shelf space refreshed through periodic line reviews. The process is unusually systematized: RangeMe in, category manager review, line-review timing, WERCS compliance for regulated products. For health and beauty brands especially, CVS is a scale channel that rewards preparation and punishes vagueness.",
    routesHeading: { pre: "The three routes", em: "into CVS" },
    routes: [
      {
        title: "RangeMe — the official portal",
        body: "CVS takes new supplier submissions through [RangeMe](https://www.rangeme.com) for stores and CVS.com. Build a complete profile: product name and category (CVS assigns buyers by category), quality imagery including lifestyle shots, a sharp description of what it is and who it's for, and MSRP plus wholesale pricing. Incomplete profiles get passed over fast.",
      },
      {
        title: "Line review timing",
        body: "Each category's **Category Manager** plans assortment resets during line review cycles — the windows when shelf space actually changes hands. Ask (via RangeMe, brokers or trade contacts) when your category reviews, and time your submission and follow-up to land ahead of it.",
      },
      {
        title: "Brokers & distributors",
        body: "The drug channel runs heavily on brokers and distributors who hold existing CVS relationships and know the line review calendar. For emerging brands, an experienced drug-channel broker often converts a cold submission into a warm meeting — at a commission worth modeling.",
      },
    ],
    requirements: [
      { k: "WERCS registration", v: "Regulated products (chemicals, OTC, many personal care items) must complete WERCS registration before New Item Forms are submitted." },
      { k: "Supplier onboarding", v: "CVS supplier setup through its self-onboarding systems (cvssuppliers.com), including vendor number establishment." },
      { k: "Category compliance", v: "FDA compliance for OTC/cosmetics, proper labeling, and category-specific documentation." },
      { k: "Complete product data", v: "GS1 UPCs, imagery, pricing and specifications matching CVS's data standards." },
      { k: "EDI capability", v: "Electronic trading for stocked vendors." },
      { k: "Insurance", v: "Product liability insurance at chain-retail levels." },
    ],
    note:
      "**Timing is the hidden variable:** a great product submitted just after a line review waits until the next cycle. Find your category's review calendar before you submit — it can compress your timeline by six months.",
    steps: [
      { title: "Complete compliance groundwork", body: "WERCS registration for regulated products; FDA/labeling compliance documented.", time: "1–2 months" },
      { title: "Submit on RangeMe", body: "Complete profile with imagery, pricing, and category-precise positioning.", time: "Weeks 0–4" },
      { title: "Category manager review", body: "Reviewed against the line review cycle — timing your submission to the calendar matters.", time: "1–6 months" },
      { title: "Meetings & terms", body: "Assortment role, pricing, promotional programs and store-count discussion.", time: "1–3 months" },
      { title: "Onboarding", body: "Vendor number setup, item forms, EDI and logistics arrangements.", time: "1–3 months" },
      { title: "Launch & perform", body: "Velocity against plan decides the next line review's verdict on your space.", time: "Ongoing" },
    ],
    costs: [
      { item: "WERCS registration", range: "$150–$1,500 per product" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI setup", range: "$3,000–$15,000" },
      { item: "Broker commission (if used)", range: "3–10% of sales" },
      { item: "Promotional programs", range: "3–8% of sales" },
    ],
    costNote:
      "Drug-channel promotion (circulars, ExtraCare offers) is a core trading mechanic — budget participation. A broker's commission often pays for itself in line-review access alone.",
    tips: [
      { title: "Submit category-precisely.", body: "CVS assigns buyers by category — a miscategorized submission reaches the wrong desk and dies quietly." },
      { title: "Invest in the profile.", body: "CVS buyers are flooded; complete profiles with lifestyle imagery and sharp positioning survive the first cut." },
      { title: "Learn your line review dates.", body: "The single highest-leverage piece of information in the entire process. Brokers know them." },
      { title: "Prove drug-channel fit.", body: "Velocity at regional drug or grocery chains, strong Amazon reviews in health/beauty — evidence this customer buys you." },
    ],
    faqs: [
      { q: "How do I submit a product to CVS?", a: "Through RangeMe — CVS's official submission portal for stores and CVS.com. Complete profiles with imagery, pricing and precise category placement reach the right Category Manager." },
      { q: "What is a line review?", a: "The periodic cycle when a Category Manager resets a category's assortment — the window when new products actually win shelf space. Time your submission to land ahead of it." },
      { q: "What is WERCS and do I need it?", a: "A product-data registration required for regulated products (chemicals, OTC, many personal care items) — it must be complete before CVS New Item Forms are submitted." },
      { q: "Should I use a broker for CVS?", a: "Often yes for emerging brands — drug-channel brokers hold relationships and line-review calendars that convert cold submissions into meetings, for a commission worth modeling." },
      { q: "How long does getting into CVS take?", a: "Highly cycle-dependent: 3–12 months depending on where your category's line review falls relative to your submission." },
    ],
    sources: [
      { label: "CVS Suppliers — become a supplier", href: "https://cvssuppliers.com/become-a-cvs-supplier" },
      { label: "CrossBridge — CVS product guide", href: "https://crossbridge.rs/blog/how-to-get-your-product-into-cvs-health" },
    ],
  },
  {
    slug: "ulta",
    name: "Ulta Beauty",
    country: "US",
    category: "Beauty",
    cardBlurb: "Where beauty brands break into US retail — discovery via RangeMe/MUSE, Sparked for emerging brands.",
    topGun: false,
    metaTitle: "How to Get Into Ulta Beauty: Sparked, MUSE & Brand Discovery | Spottail",
    metaDescription:
      "How Ulta Beauty finds new brands: no cold applications — discovery via RangeMe and the MUSE Accelerator, the quarterly Sparked program, vendor standards and costs.",
    kicker: "US · Beauty · Supplier Guide",
    h1Pre: "How to get into",
    h1Em: "Ulta Beauty",
    h1Post: "",
    readTime: "9 min read",
    quickAnswer:
      "Ulta Beauty **doesn't run a cold supplier application** — new brands get discovered through **RangeMe** and Ulta's **MUSE Accelerator**, then vetted against its vendor standards. The showcase route is **Sparked**: each quarter Ulta highlights emerging beauty brands with dedicated placement in 100+ stores, a landing page, and team mentorship. What gets brands chosen: **captivating founder stories, preexisting demand from Ulta's customers, and genuine product differentiation** — build visibility where Ulta's team hunts.",
    facts: [
      { n: "1,400+", l: "US stores" },
      { n: "4", l: "brands per Sparked quarter" },
      { n: "100+", l: "stores for Sparked placement" },
      { n: "0", l: "cold application routes" },
    ],
    intro:
      "Ulta is the definitive US beauty retailer for emerging brands — mass and prestige under one roof, with a customer who hunts newness. Its discovery model inverts the usual process: you don't apply to Ulta; Ulta finds you. That makes the strategy legible: be excellent where their team scouts (RangeMe, the MUSE Accelerator, social velocity, DTC traction), and build the founder story and demand signals their selection team is explicitly looking for.",
    routesHeading: { pre: "The three routes", em: "into Ulta" },
    routes: [
      {
        title: "RangeMe + MUSE Accelerator — the discovery surface",
        body: "Ulta's team discovers brands through **RangeMe** profiles and the **MUSE Accelerator** (its program elevating BIPOC-founded beauty brands with funding, mentorship and retail readiness). A complete RangeMe presence and — if eligible — a MUSE application put you directly in the scouting flow.",
      },
      {
        title: "Sparked — the emerging-brand showcase",
        body: "**Sparked** highlights a small cohort of emerging brands each quarter: dedicated tables in 100+ stores, a landing page on ulta.com, marketing exposure and access to Ulta team mentorship. Selection is proactive, based on founder story, existing customer demand, differentiation, growth potential and trend fit — including cross-over with Ulta's wellness and Conscious Beauty programs.",
      },
      {
        title: "Build the signals that get you found",
        body: "Ulta's selectors track social heat, DTC velocity, press and community. TikTok momentum, sold-out launches, strong reviews and a distinct founder narrative aren't vanity metrics here — they're literally the selection criteria. Make your traction visible and quantified.",
      },
    ],
    requirements: [
      { k: "FDA & labeling compliance", v: "US cosmetics compliance (MoCRA registration and listing, compliant labeling and claims) — table stakes before any retail conversation." },
      { k: "Vendor standards", v: "Ulta's published vendor standards on quality, testing, operations and data — brands are vetted against them once discovered." },
      { k: "Demand evidence", v: "Preexisting demand from Ulta's customer — DTC sales, social velocity, reviews, community — quantified and presentable." },
      { k: "Founder story & differentiation", v: "A captivating founder narrative and genuine product differentiation — explicit selection criteria for Sparked." },
      { k: "Operational readiness", v: "Capacity to supply 100+ stores (Sparked) or chain-wide, with retail-grade fulfillment." },
      { k: "Insurance", v: "Product liability insurance at beauty-retail levels." },
    ],
    note:
      "**The inversion to internalize:** every dollar spent cold-pitching Ulta is better spent building visible traction — the team finds brands through the signals, not the inbox. Your DTC and social performance *is* your Ulta application.",
    steps: [
      { title: "Get compliant", body: "MoCRA registration, labeling and claims review — beauty compliance before beauty retail.", time: "1–2 months" },
      { title: "Build the discovery surface", body: "Complete RangeMe profile, MUSE application if eligible, visible social and DTC traction.", time: "1–3 months" },
      { title: "Grow the signals", body: "Reviews, repeat rates, social velocity, press — quantified demand from Ulta's customer demographic.", time: "3–12 months" },
      { title: "Selection & vetting", body: "If chosen (Sparked or range), Ulta vets against vendor standards and negotiates terms.", time: "2–4 months" },
      { title: "Launch", body: "Sparked placement in 100+ stores or range listing — with Ulta marketing behind it.", time: "Launch" },
      { title: "Convert the showcase", body: "Sparked performance is the audition for permanent range space — treat the quarter accordingly.", time: "Ongoing" },
    ],
    costs: [
      { item: "MoCRA compliance & registration", range: "$1,000–$5,000" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "DTC & social growth investment", range: "Your marketing budget — it doubles as the pitch" },
      { item: "Retail-ready packaging & displays", range: "$10,000–$40,000" },
      { item: "Fulfillment scale-up", range: "3PL costs — 100+ store volume" },
    ],
    costNote:
      "The unusual economics: your customer-acquisition spend is also your retail pitch. Brands that treat DTC traction and Ulta discovery as one funnel spend once and win twice.",
    tips: [
      { title: "Quantify the founder story.", body: "Story plus numbers is the Sparked formula — why you built it, and the sell-through proving customers care." },
      { title: "Apply to MUSE if eligible.", body: "It's a designed pipeline into Ulta's ecosystem with funding and mentorship attached — the highest-probability structured route that exists." },
      { title: "Make RangeMe your storefront.", body: "Assume an Ulta scout sees it cold: complete, visual, current, with traction metrics front and center." },
      { title: "Engineer social proof.", body: "UGC, TikTok velocity and sold-out moments are selection signals. Build them deliberately and document them." },
    ],
    faqs: [
      { q: "Can I apply directly to Ulta Beauty?", a: "There's no cold supplier application — Ulta's team discovers brands through RangeMe, the MUSE Accelerator and market signals, then vets them against published vendor standards." },
      { q: "What is Sparked?", a: "Ulta's quarterly emerging-brand showcase: selected brands get dedicated placement in 100+ stores, an ulta.com landing page, marketing exposure and team mentorship." },
      { q: "What gets a brand selected?", a: "Captivating founder stories (with particular support for BIPOC founders via MUSE), preexisting demand from Ulta's customers, product differentiation, growth potential and trend fit." },
      { q: "What compliance do beauty brands need?", a: "US cosmetics compliance under MoCRA — facility registration, product listing, compliant labeling and substantiated claims — before any retail conversation progresses." },
      { q: "How do I improve my odds with Ulta?", a: "Build visible traction where their team scouts: a complete RangeMe profile, MUSE if eligible, and quantified DTC/social momentum. Your traction is the application." },
    ],
    sources: [
      { label: "SupplierDiversity — Ulta supplier program", href: "https://www.supplierdiversity.com/blog/how-to-become-an-ulta-supplier/" },
      { label: "Beauty Independent — Sparked program", href: "https://www.beautyindependent.com/ulta-beauty-sparked-program-center-stage-new-store-format/" },
    ],
  },
  {
    slug: "tj-maxx",
    name: "TJ Maxx",
    country: "US",
    category: "Off-Price",
    cardBlurb: "TJX's opportunistic buying — weekly-in-market buyers, closeouts and made-for programs.",
    topGun: false,
    metaTitle: "How to Sell to TJ Maxx: Become a TJX Vendor | Spottail",
    metaDescription:
      "How TJX buying works and how to become a vendor: category-specialist buyers in market weekly, closeout and made-for routes, vendor numbers across Marshalls and HomeGoods.",
    kicker: "US · Off-Price · Supplier Guide",
    h1Pre: "How to sell to",
    h1Em: "TJ Maxx",
    h1Post: "",
    readTime: "9 min read",
    quickAnswer:
      "To sell to TJ Maxx, reach the **TJX buying organization directly** — call the corporate office to identify the buyer and assistant buyers for your category, then connect via LinkedIn and RangeMe. TJX buying is unlike anywhere else: **category-specialist buyers are in the market weekly** (not seasonally), buying opportunistically — **closeouts, overruns, canceled orders and made-for-off-price programs**. A vendor number, once assigned, often works across **Marshalls and HomeGoods** too, since the chains share systems.",
    facts: [
      { n: "1,300+", l: "TJ Maxx US stores" },
      { n: "21,000+", l: "vendors globally (TJX)" },
      { n: "Weekly", l: "buyers in the market" },
      { n: "3", l: "chains share vendor systems" },
    ],
    intro:
      "TJX — parent of TJ Maxx, Marshalls and HomeGoods — runs the most opportunistic buying model in US retail: thousands of specialist buyers in the market every week, hunting brand-name goods at deal prices from closeouts, overruns and purpose-made programs. For vendors, that flexibility is the appeal — TJX buys what others won't, when others can't, in quantities others fear. It's both a relief valve for excess inventory and, for savvy brands, a deliberate volume channel.",
    routesHeading: { pre: "The three routes", em: "into TJX" },
    routes: [
      {
        title: "Direct buyer contact",
        body: "Call the TJX corporate office and identify the buyer and assistant buyers for your category — TJX buyers specialize narrowly (a buyer might cover just handbags), which makes finding the right one both harder and more valuable. Connect on LinkedIn and RangeMe, leave voicemails, use trade-bureau introductions. Off-price buying is relationship-driven and always-on: unlike seasonal retailers, there's no wrong week to pitch.",
      },
      {
        title: "Closeouts, overruns & canceled orders",
        body: "The classic TJX buy: excess inventory from brands and manufacturers, purchased opportunistically at sharp prices. If you have overstock, discontinued lines or canceled wholesale orders, TJX buyers are structurally the market's best bid — fast decisions, real volume, cash-flow rescue.",
      },
      {
        title: "Made-for-off-price programs",
        body: "A large share of off-price inventory is now **made for the channel**: production runs designed to hit TJX price points profitably. For manufacturers with flexible capacity, dedicated off-price programs (sometimes under diffusion labels) turn TJX from a clearance outlet into a planned, repeatable revenue line.",
      },
    ],
    requirements: [
      { k: "Deal economics", v: "Off-price margins: TJX buys sharply to sell at 20–60% below conventional retail — your price must leave them that room." },
      { k: "Brand or quality signal", v: "The treasure-hunt model runs on recognizable brands and evident quality — unbranded commodity products have less traction." },
      { k: "Volume flexibility", v: "Ability to move in TJX's quantities — sometimes enormous, sometimes small opportunistic lots — on fast timelines." },
      { k: "Vendor compliance", v: "TJX vendor standards: routing guides, ticketing/labeling requirements, and social compliance for made-for programs." },
      { k: "Vendor number", v: "Assigned on first deals — and often valid across Marshalls and HomeGoods, multiplying the relationship's value." },
      { k: "Insurance", v: "Product liability insurance at chain-retail levels." },
    ],
    note:
      "**Channel-strategy note:** off-price placement cuts both ways for brands — it moves volume and introduces customers, but visible discounting can strain full-price relationships. Manage with diffusion lines, packaging variants or made-for product that doesn't undercut your core range.",
    steps: [
      { title: "Define your off-price play", body: "Clearance relief, planned made-for programs, or both — the pitch differs.", time: "Week 0" },
      { title: "Find your category buyer", body: "Corporate office, LinkedIn, RangeMe, trade introductions — specialists buy narrow, so precision matters.", time: "Weeks 0–8" },
      { title: "Pitch the deal", body: "Product, quantities, pricing and availability — off-price pitches are concrete and fast.", time: "Weeks 2–12" },
      { title: "First transaction & vendor number", body: "Deal executed, vendor number assigned — often unlocking Marshalls and HomeGoods.", time: "1–2 months" },
      { title: "Build the relationship", body: "Weekly-in-market buying rewards vendors who reliably surface good deals — become a source they call.", time: "Ongoing" },
    ],
    costs: [
      { item: "Margin trade-off", range: "Sharp — off-price economics" },
      { item: "Ticketing & routing compliance", range: "$1,000–$5,000 setup" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "Made-for production runs", range: "Working capital — scale-dependent" },
    ],
    costNote:
      "Off-price pricing is aggressive but transactions are fast and volumes real — many vendors net better cash outcomes here than through slow clearance elsewhere. Model per-deal, not per-year.",
    tips: [
      { title: "Pitch deals, not decks.", body: "TJX buyers decide fast on concrete offers: this product, this quantity, this price, available now. Lead with the numbers." },
      { title: "Work all three chains.", body: "One vendor number often spans TJ Maxx, Marshalls and HomeGoods — pitch product where each chain's assortment fits." },
      { title: "Become a recurring source.", body: "Buyers in market weekly need reliable deal flow. Vendors who consistently bring good product become the first call." },
      { title: "Protect your full-price channel.", body: "Use made-for product or diffusion approaches so off-price volume doesn't erode your core pricing power." },
    ],
    faqs: [
      { q: "How do I become a TJ Maxx vendor?", a: "Contact the TJX buying organization directly — identify your category's buyer via the corporate office, connect on LinkedIn and RangeMe, and pitch concrete deals. Off-price buying is relationship-driven and runs year-round." },
      { q: "What does TJX buy?", a: "Opportunistically: closeouts, overruns, canceled orders and packaway deals — plus a large share of made-for-off-price production designed to hit their price points." },
      { q: "Does one vendor number cover Marshalls and HomeGoods?", a: "Often yes — the TJX chains share systems, so a vendor number from one frequently works across the others." },
      { q: "Is selling to TJ Maxx bad for my brand?", a: "It's a strategic choice: real volume and new customers versus visible discounting. Diffusion lines and made-for product let brands capture the volume without undercutting full-price channels." },
      { q: "How fast do TJX deals move?", a: "Faster than any conventional retailer — buyers are in market weekly and concrete offers can transact in weeks." },
    ],
    sources: [
      { label: "Retail MBA — TJX vendor guide", href: "https://www.retailmba.com/tjx-vendor/" },
      { label: "Harvard D3 — TJX buying model", href: "https://d3.harvard.edu/platform-rctom/?p=131" },
    ],
  },
  {
    slug: "nordstrom",
    name: "Nordstrom",
    country: "US",
    category: "Premium Department",
    cardBlurb: "Premium fashion & beauty — buyer-first vendor process plus a marketplace dropship route.",
    topGun: false,
    metaTitle: "How to Become a Nordstrom Vendor: Application, EDI & Marketplace | Spottail",
    metaDescription:
      "How to become a Nordstrom supplier: buyer outreach first, the vendor application and EDI onboarding, the marketplace/dropship route, and emerging-brand programs.",
    kicker: "US · Premium Department · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Nordstrom",
    h1Post: "vendor",
    readTime: "9 min read",
    quickAnswer:
      "To become a Nordstrom vendor, **contact the category buyer before submitting paperwork** — Nordstrom's application process moves far better with a buyer sponsoring it — then complete the **vendor application and EDI onboarding** for wholesale supply. A second route exists: Nordstrom's **marketplace (dropship) model**, where brands sell on nordstrom.com fulfilling orders themselves — a lighter entry that builds the sales case for wholesale. Buyers are held to **rigorous sell-through standards**, so demand evidence is the pitch.",
    facts: [
      { n: "350+", l: "stores incl. Nordstrom Rack" },
      { n: "2", l: "routes: wholesale & marketplace" },
      { n: "Premium", l: "fashion & beauty positioning" },
      { n: "Curated", l: "emerging-brand tradition" },
    ],
    intro:
      "Nordstrom is the US benchmark for premium department-store retail — fashion, beauty and lifestyle with a genuine history of introducing emerging brands (it's launched countless designers and beauty labels into American retail). Its buyers are measured hard on sell-through, which makes them selective and evidence-driven. The modern structure offers two doors: traditional wholesale, and a marketplace dropship model that lets brands audition on nordstrom.com with their own fulfillment.",
    routesHeading: { pre: "The three routes", em: "into Nordstrom" },
    routes: [
      {
        title: "Buyer connection → vendor application",
        body: "Before submitting Nordstrom's paperwork, contact the buyer for your category and make your intentions known — an internal contact moves applications through the process. Find buyers via the corporate office, LinkedIn and RangeMe; pitch with sell-through evidence, premium brand assets and wholesale pricing built for department-store margins.",
      },
      {
        title: "Marketplace / dropship — the audition",
        body: "Nordstrom's **marketplace model** lets approved brands sell on nordstrom.com while fulfilling orders themselves — expanding assortment without inventory risk to Nordstrom. For emerging premium brands it's the rational first door: lighter onboarding, real Nordstrom-customer data, and a performance record that de-risks the wholesale conversation.",
      },
      {
        title: "Emerging-brand & diversity programs",
        body: "Nordstrom runs concerted emerging-brand curation and supplier diversity commitments (including partnerships to grow Black- and minority-owned brands). If you qualify, these programs are structured attention from merchants explicitly tasked with finding new names.",
      },
    ],
    requirements: [
      { k: "Premium brand standards", v: "Product quality, packaging and brand presentation at department-store level — Nordstrom curates for its customer's expectations." },
      { k: "EDI capability", v: "Wholesale vendors trade via EDI — onboarding includes systems integration and testing." },
      { k: "Sell-through evidence", v: "Buyers carry rigorous sell-through targets and are correspondingly risk-averse — demand proof is the core of any pitch." },
      { k: "Fulfillment standards (marketplace)", v: "For dropship: your own fulfillment meeting Nordstrom's service, shipping and returns standards." },
      { k: "Capacity", v: "Production able to scale if Nordstrom volume lands — buyers check before committing." },
      { k: "Insurance & compliance", v: "Product liability insurance and category-appropriate compliance (MoCRA for beauty, CPSIA where applicable)." },
    ],
    note:
      "**Sequencing note:** the marketplace route inverts the old dynamic — instead of persuading a risk-averse buyer with projections, you hand them live nordstrom.com sales data. Audition first, negotiate wholesale second.",
    steps: [
      { title: "Build premium-grade assets", body: "Brand imagery, packaging, press and DTC proof at the level Nordstrom's customer expects.", time: "Ongoing" },
      { title: "Connect with the buyer", body: "Category buyer outreach with sell-through evidence and wholesale pricing — before paperwork.", time: "1–3 months" },
      { title: "Choose the route", body: "Marketplace dropship (lighter, faster) or wholesale application (bigger, slower).", time: "Week 0" },
      { title: "Application & onboarding", body: "Vendor application, EDI integration (wholesale) or fulfillment standards setup (marketplace).", time: "1–3 months" },
      { title: "Launch", body: "Marketplace listings or wholesale ranges — often online or select-door first.", time: "1–2 months" },
      { title: "Convert performance", body: "Marketplace velocity earns wholesale; wholesale sell-through earns door count.", time: "Ongoing" },
    ],
    costs: [
      { item: "EDI setup (wholesale)", range: "$5,000–$15,000" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "Marketplace commission & fulfillment", range: "% of sales + your logistics" },
      { item: "Premium packaging & content", range: "$10,000–$40,000" },
      { item: "Working capital (wholesale terms)", range: "Plan 30–60 day payment cycles" },
    ],
    costNote:
      "Department-store wholesale carries margin pressure, chargebacks and payment cycles; marketplace carries commission and fulfillment cost. Model both — the right first door depends on your cash position.",
    tips: [
      { title: "Give the buyer their defense.", body: "Sell-through-measured buyers need evidence that protects their decision. Your DTC, marketplace and social data is that defense — package it." },
      { title: "Audition via marketplace.", body: "Nordstrom-customer sales data is the strongest wholesale argument available. Get it before you ask for POs." },
      { title: "Ready production for the step-change.", body: "A Nordstrom yes means volume — inform your manufacturers early and have the capacity plan in the pitch." },
      { title: "Use the programs.", body: "Emerging-brand curation and supplier diversity initiatives are genuine structured doors — qualify and apply alongside buyer outreach." },
    ],
    faqs: [
      { q: "How do I become a Nordstrom vendor?", a: "Contact your category buyer first — applications move far better buyer-sponsored — then complete the vendor application and EDI onboarding for wholesale, or enter via the marketplace dropship route." },
      { q: "What is Nordstrom's marketplace?", a: "A dropship model where approved brands sell on nordstrom.com fulfilling orders themselves — lighter entry than wholesale, and a proving ground that generates the sales data wholesale buyers want." },
      { q: "What do Nordstrom buyers look for?", a: "Premium-standard product and presentation, and above all demand evidence — buyers carry rigorous sell-through targets and advance brands that protect those numbers." },
      { q: "Does Nordstrom support emerging brands?", a: "Yes — a long curation tradition plus current emerging-brand and supplier diversity programs create structured routes for new and underrepresented brands." },
      { q: "How long does Nordstrom onboarding take?", a: "Marketplace routes can move in 2–4 months; wholesale typically runs 4–9 months from buyer connection through EDI onboarding to launch." },
    ],
    sources: [
      { label: "Infocon — Nordstrom EDI supplier guide", href: "https://www.infoconn.com/blog/How-to-become-a-supplier-of-Nordstrom-EDI.htm" },
      { label: "CLOSO — Nordstrom vendor portal guide", href: "https://closo.co/blogs/platform-specific-guides/nordstrom-vendor-portal" },
    ],
  },
  {
    slug: "dicks-sporting-goods",
    name: "Dick's Sporting Goods",
    country: "US",
    category: "Sporting Goods",
    cardBlurb: "The largest US sporting goods retailer — RangeMe discovery and a structured vendor checklist.",
    topGun: false,
    metaTitle: "How to Become a Dick's Sporting Goods Vendor: Process & Requirements | Spottail",
    metaDescription:
      "How to become a Dick's Sporting Goods supplier: RangeMe discovery, buyer outreach, vendor onboarding checklist, EDI and compliance requirements, and costs.",
    kicker: "US · Sporting Goods · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Dick's",
    h1Post: "vendor",
    readTime: "8 min read",
    quickAnswer:
      "To become a Dick's Sporting Goods vendor, get in front of its buyers through **RangeMe** — Dick's buyers use it for product discovery — combined with **direct buyer outreach** (corporate office, LinkedIn) for your category. Successful vendors then work through Dick's structured **onboarding checklist: EDI integration, compliance documentation, insurance and item setup**. Buyers are sell-through-measured and risk-averse: they advance products with **proven demand and national-scale readiness**.",
    facts: [
      { n: "850+", l: "US stores" },
      { n: "#1", l: "US sporting goods retailer" },
      { n: "RangeMe", l: "buyer discovery channel" },
      { n: "National", l: "scale expectations" },
    ],
    intro:
      "Dick's Sporting Goods dominates US sporting goods retail — and its scale (850+ stores plus a strong dot-com and specialty concepts) sets the bar for vendors: buyers want products with demonstrated demand and suppliers ready for national distribution. The discovery layer is modern (RangeMe), the onboarding is classic big-box (EDI, compliance, routing guides), and the pitch that works is athlete-and-community-proven demand.",
    routesHeading: { pre: "The three routes", em: "into Dick's" },
    routes: [
      {
        title: "RangeMe — the discovery layer",
        body: "Dick's buyers use [RangeMe](https://www.rangeme.com/dsg) for product discovery — a complete profile with specs, imagery, pricing and demand evidence puts you in their sourcing flow. As everywhere, completeness and category precision decide whether a buyer looks twice.",
      },
      {
        title: "Direct buyer outreach",
        body: "Identify your category's buyer and assistant buyers via the corporate office and LinkedIn; pitch with sell-through data from specialty retail, DTC or marketplaces. Sporting goods buying is community-aware — team adoption, athlete endorsements and specialist credibility all register.",
      },
      {
        title: "Prove it in specialty first",
        body: "Specialty run/outdoor/team shops, regional chains and strong Amazon category performance build exactly the demand record a risk-averse national buyer needs. The specialty-to-national ladder is the standard path in this category.",
      },
    ],
    requirements: [
      { k: "Demand evidence", v: "Buyers held to rigorous sell-through standards advance products with proven velocity — specialty retail, DTC and marketplace data are your case." },
      { k: "National readiness", v: "Vendors are expected to be scalable and ready for national distribution — capacity, logistics and cash flow at 850-store scale." },
      { k: "EDI & onboarding checklist", v: "Structured onboarding: EDI integration, routing-guide compliance, item data and documentation." },
      { k: "Product compliance", v: "Category-specific safety standards (CPSIA for youth products, applicable ASTM standards, Prop 65 labeling)." },
      { k: "Insurance", v: "Product liability insurance at big-box levels — sporting goods carries real liability exposure." },
      { k: "Brand & community proof", v: "Sporting goods is credibility-driven: athlete use, team adoption and community traction strengthen every pitch." },
    ],
    note:
      "**Category note:** sporting goods liability is above-average — product testing, ASTM/CPSIA compliance and meaningful insurance limits are scrutinized. Have the safety file ready before the buyer asks.",
    steps: [
      { title: "Build the demand record", body: "Specialty retail placements, DTC velocity, marketplace reviews — quantified.", time: "Ongoing" },
      { title: "Profile on RangeMe + buyer outreach", body: "Complete discovery profile and direct category-buyer engagement in parallel.", time: "Weeks 0–8" },
      { title: "Pitch & evaluation", body: "Category review of product, pricing, demand evidence and scale readiness.", time: "1–4 months" },
      { title: "Onboarding checklist", body: "EDI, compliance documentation, insurance verification, item setup.", time: "1–3 months" },
      { title: "Launch — often dot-com or test doors", body: "Online or limited-door launches are common first steps.", time: "Launch" },
      { title: "Earn door count", body: "Sell-through drives expansion across the chain and concepts.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product testing & compliance", range: "$1,000–$10,000 per product line" },
      { item: "Product liability insurance", range: "$3,000–$10,000 / year" },
      { item: "EDI setup", range: "$5,000–$15,000" },
      { item: "GS1 UPCs & item data", range: "$250–$2,500 initial" },
      { item: "National-scale logistics", range: "3PL costs — scale-dependent" },
    ],
    costNote:
      "The gap between specialty-scale and Dick's-scale operations is where vendors stumble — price the 3PL, EDI and working-capital step-change into your wholesale economics before saying yes.",
    tips: [
      { title: "Climb the specialty ladder.", body: "Specialty shop credibility plus velocity data is the sporting-goods pitch that works — nationals buy what specialists proved." },
      { title: "Lead with community proof.", body: "Teams, athletes, clubs and communities using your product are evidence buyers in this category genuinely weight." },
      { title: "Prepare the safety file.", body: "ASTM, CPSIA, Prop 65 — compliance documentation ready at pitch removes the easiest reason to pass." },
      { title: "Accept the test-door start.", body: "Dot-com or limited doors first is the norm. Treat it as your velocity showcase, and the chain follows." },
    ],
    faqs: [
      { q: "How do I become a Dick's Sporting Goods vendor?", a: "Get discovered via RangeMe (Dick's buyers use it for sourcing) combined with direct category-buyer outreach — then complete the structured onboarding checklist: EDI, compliance, insurance and item setup." },
      { q: "What does Dick's look for in new vendors?", a: "Proven demand (specialty retail, DTC, marketplace velocity) and national-scale readiness — buyers are sell-through-measured and advance low-risk, evidence-backed products." },
      { q: "What compliance do sporting goods need?", a: "Category-specific safety standards — CPSIA for youth products, applicable ASTM standards, Prop 65 labeling — with testing documentation ready at pitch." },
      { q: "Will I launch in all stores?", a: "Rarely — dot-com or limited test doors are the common first step, with sell-through earning chain-wide expansion." },
      { q: "How long does the process take?", a: "Typically 4–9 months from discovery to launch, depending on category review timing and onboarding." },
    ],
    sources: [
      { label: "RangeMe × Dick's Sporting Goods", href: "https://www.rangeme.com/dsg" },
      { label: "SupplierWiki — Dick's vendor checklist", href: "https://supplierwiki.supplypike.com/articles/dicks-sporting-goods-vendor-requirements-and-onboarding-checklist" },
    ],
  },
  {
    slug: "meijer",
    name: "Meijer",
    country: "US",
    category: "Supercenter",
    cardBlurb: "Midwest supercenter pioneer — VendorNet registration and dedicated local & diverse supplier events.",
    topGun: false,
    metaTitle: "How to Become a Meijer Supplier: VendorNet & Local Vendor Programs | Spottail",
    metaDescription:
      "How to become a Meijer vendor: Prospective Vendor registration on VendorNet, local Midwest and diverse-supplier programs, requirements, timelines and costs.",
    kicker: "US · Supercenter · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Meijer",
    h1Post: "supplier",
    readTime: "8 min read",
    quickAnswer:
      "To become a Meijer supplier, register through the **Prospective Vendor section of VendorNet** — Meijer's vendor platform — with your company details, product descriptions and compliance certifications. Meijer runs genuine **local and diverse-supplier programs**: Midwest vendors (Michigan, Ohio, Indiana, Illinois, Kentucky, Wisconsin) and certified diverse-owned businesses get dedicated supplier events, with applications as simple as a **3-minute video pitch** for some programs. If selected, onboarding runs through VendorNet.",
    facts: [
      { n: "500+", l: "supercenters & stores" },
      { n: "6", l: "core Midwest states" },
      { n: "3min", l: "video pitch for local events" },
      { n: "1962", l: "invented the supercenter" },
    ],
    intro:
      "Meijer — the family-owned Michigan chain that invented the supercenter format — operates 500+ stores across the Midwest with a genuine institutional commitment to local and diverse suppliers. For brands based in its six-state footprint, Meijer is one of the most reachable large-format retailers in America: dedicated supplier events, video-pitch applications, and buyers explicitly tasked with finding regional products.",
    routesHeading: { pre: "The three routes", em: "into Meijer" },
    routes: [
      {
        title: "VendorNet — Prospective Vendor registration",
        body: "Meijer's [VendorNet](https://vendornet.meijer.com) platform handles vendor communication — register via the Prospective Vendor section with company history, product details and compliance certifications. Clear, accurate product data improves your odds of progressing to buyer evaluation.",
      },
      {
        title: "Local & diverse supplier events",
        body: "Meijer runs dedicated supplier events for **local Midwest vendors** (based in Michigan, Ohio, Indiana, Illinois, Kentucky, Wisconsin) and **certified diverse-owned businesses** (minority-, woman-, veteran-, LGBTQ+- and disability-owned, based anywhere). Applications for some programs are refreshingly light — a 3-minutes-or-less video introducing your business and products.",
      },
      {
        title: "Regional-first strategy",
        body: "Meijer's Midwest identity means regional relevance is a merchandising asset — local products are marked and marketed in-store. Lead with your local story, win your home-state stores, and let velocity argue for chain-wide placement.",
      },
    ],
    requirements: [
      { k: "Retail-ready product", v: "Compliant, retail-ready products with clear market demand — Meijer's stated bar for program applicants." },
      { k: "VendorNet registration", v: "Complete company, history and product information through the Prospective Vendor process." },
      { k: "Compliance certifications", v: "Category-appropriate certifications and product compliance documentation submitted with your application." },
      { k: "Local/diverse credentials", v: "For programs: Midwest base (six states) or recognized diversity certification (NMSDC, WBENC etc.)." },
      { k: "EDI & systems", v: "Selected suppliers onboard to VendorNet and Meijer's systems for orders and data exchange." },
      { k: "Insurance", v: "Product liability insurance at supercenter-retail levels." },
    ],
    note:
      "**Regional advantage:** if you're based in the Midwest, Meijer is arguably your most accessible large-format target — the local programs are real, the video-pitch application is genuinely light, and regional identity is merchandised, not just tolerated.",
    steps: [
      { title: "Register on VendorNet", body: "Prospective Vendor form with company, product and compliance details — complete and accurate.", time: "Weeks 0–4" },
      { title: "Apply to supplier events", body: "Local/diverse program applications (video pitch where applicable) when windows open.", time: "Varies" },
      { title: "Buyer evaluation", body: "Category review of product, demand evidence and fit — event participants pitch directly.", time: "1–3 months" },
      { title: "Selection & onboarding", body: "VendorNet access, systems setup, item data and logistics arrangements.", time: "1–3 months" },
      { title: "Launch regionally", body: "Home-state or regional placement first is common — with local merchandising support.", time: "Launch" },
      { title: "Expand on velocity", body: "Regional sell-through builds the chain-wide case.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "EDI/systems setup", range: "$3,000–$15,000" },
      { item: "GS1 UPCs & item data", range: "$250–$2,500 initial" },
      { item: "Diversity certification (if applicable)", range: "$350–$1,500" },
      { item: "Promotional programs", range: "2–6% of sales" },
    ],
    costNote:
      "Meijer's entry costs are standard big-box — the differentiator is access: local and diverse programs meaningfully lower the attention barrier that kills most cold applications elsewhere.",
    tips: [
      { title: "Make the video pitch count.", body: "Three minutes: who you are, what makes the product move, and the demand proof. Founder authenticity plays well here." },
      { title: "Certify your diversity status.", body: "If eligible, formal certification (NMSDC, WBENC, NVBDC) unlocks the dedicated events — worth the paperwork." },
      { title: "Lead with Midwest identity.", body: "Local provenance is merchandised at Meijer. Say where you're made early and often." },
      { title: "Watch for event windows.", body: "Supplier events run on announced cycles — follow Meijer's newsroom and vendor channels so you don't miss applications." },
    ],
    faqs: [
      { q: "How do I become a Meijer vendor?", a: "Register through the Prospective Vendor section of Meijer's VendorNet platform with company details, product descriptions and compliance certifications — selected suppliers onboard through VendorNet." },
      { q: "What are Meijer's local vendor programs?", a: "Dedicated supplier events for Midwest-based vendors (Michigan, Ohio, Indiana, Illinois, Kentucky, Wisconsin) and certified diverse-owned businesses nationwide — with applications as light as a 3-minute video pitch." },
      { q: "Do I need to be Midwest-based?", a: "Only for the local programs — diverse-owned business programs accept certified vendors based anywhere, and standard vendor registration is open nationally." },
      { q: "What does Meijer look for?", a: "Retail-ready, compliant products with clear market demand — and for its programs, genuine local or diverse-ownership credentials." },
      { q: "How long does the process take?", a: "Program cycles vary; standard registrations through evaluation and onboarding typically run 3–8 months." },
    ],
    sources: [
      { label: "Meijer — VendorNet supplier guide", href: "https://www.meijer.com/content/dam/meijer/meijer-corporate/vendornet/Meijer%20Supplier%20Guide.pdf" },
      { label: "Meijer Newsroom — supplier events", href: "https://newsroom.meijer.com/2022-08-26-Meijer-Expands-Opportunities-for-Local-and-Diverse-Owned-Businesses-with-Upcoming-General-Merchandise-and-Apparel-Supplier-Event" },
    ],
  },
  {
    slug: "unfi",
    name: "UNFI",
    country: "US",
    category: "Distribution",
    cardBlurb: "The biggest natural-products distributor — step one for most US grocery brands.",
    topGun: false,
    metaTitle: "How to Get Into UNFI: New Supplier Process, Costs & Strategy | Spottail",
    metaDescription:
      "How to become a UNFI supplier: the New Supplier Inquiry, the retailer-authorization shortcut, distributor fees (12–28%), advertising programs, and onboarding timelines.",
    kicker: "US · Distribution · Supplier Guide",
    h1Pre: "How to get into",
    h1Em: "UNFI",
    h1Post: "",
    readTime: "10 min read",
    quickAnswer:
      "To become a UNFI supplier, start with the **New Supplier Inquiry form** (unfi.com) covering your company, warehouse locations and product categories — but know the queue reality: qualifying submissions wait for future contact, and **the most reliable route is a retailer letter of authorization** (a retailer committing to stock you), which UNFI treats as a service request. Budget for the economics: **distributor fees of 12–28% of wholesale** depending on temperature control and service tier, plus optional **Annual Advertising Agreement programs ($1,920–$42,000 quarterly)**. Setup typically takes **60–90 days** once accepted.",
    facts: [
      { n: "30,000+", l: "retail locations served" },
      { n: "12–28%", l: "distributor fee range" },
      { n: "60–90", l: "days typical setup" },
      { n: "#1", l: "natural products distributor" },
    ],
    intro:
      "UNFI is the circulatory system of US natural and specialty grocery — the primary distributor to Whole Foods and tens of thousands of independent and chain natural retailers. For most emerging food brands, getting \"into distribution\" means getting into UNFI (or KeHE), because retailers increasingly won't buy direct. Understand the sequencing though: distributors follow retail demand, they don't create it. Your first job is a retailer who wants you; UNFI then connects the pipes.",
    routesHeading: { pre: "The three routes", em: "into UNFI" },
    routes: [
      {
        title: "Retailer letter of authorization — the reliable route",
        body: "If a retailer commits to stocking you and issues a letter of authorization, UNFI treats your setup as a **service request** — the queue evaporates because a customer is asking. This inverts the work: win the retailer first (see the [Whole Foods](/become-a-supplier/whole-foods) and [Sprouts](/become-a-supplier/sprouts) guides), then bring UNFI the demand.",
      },
      {
        title: "New Supplier Inquiry — the front door",
        body: "The [New Supplier Inquiry form](https://www.unfi.com/suppliers/supplier-inquiry.html) covers company basics, warehouse and logistics details, and product categories. Be aware: meeting requirements doesn't guarantee progression — qualifying suppliers enter a queue for future contact as UNFI's category needs evolve. Submit it, but don't build your plan on it.",
      },
      {
        title: "Trade presence & broker relationships",
        body: "UNFI category managers scout Expo West and the natural-channel circuit, and natural-products brokers maintain active UNFI relationships. A broker who knows which UNFI categories are open can compress months of queue into a meeting — for a commission worth paying at this stage.",
      },
    ],
    requirements: [
      { k: "Retail demand", v: "The real prerequisite: retailer commitments (letters of authorization) or credible retail interest that makes you a service request, not a queue entry." },
      { k: "Onboarding documentation", v: "Company, insurance, food safety and product documentation — varying by distribution centers served and product type." },
      { k: "Food safety", v: "Certifications appropriate to product risk (GFSI-recognized for most packaged food at scale)." },
      { k: "Distributor economics", v: "Wholesale pricing that survives 12–28% distributor fees plus retailer margin plus promotional programs — modeled before you sign." },
      { k: "Logistics capability", v: "Reliable delivery into UNFI's DC network at their receiving standards." },
      { k: "EDI & data", v: "Electronic trading and complete item data across UNFI's systems." },
    ],
    note:
      "**The economics deserve respect:** distributor fees (12–28%), advertising programs ($1,920–$42,000/quarter if you opt in), free-fill expectations, chargebacks and promotional deductions stack up. Brands that price for retail margin alone bleed at the distributor layer — build the full waterfall before signing.",
    steps: [
      { title: "Win retail demand first", body: "Retailer commitments or letters of authorization — the unlock for everything downstream.", time: "Months — see retailer guides" },
      { title: "Submit the inquiry / service request", body: "New Supplier Inquiry, or authorization-backed setup via your retailer.", time: "Weeks 0–4" },
      { title: "Onboarding documentation", body: "Insurance, food safety, product data and DC-specific requirements.", time: "1–2 months" },
      { title: "Program decisions", body: "Advertising agreements, promotional programs and service tiers — model each before opting in.", time: "Weeks" },
      { title: "DC setup & first orders", body: "Item setup, logistics arrangements, initial purchase orders into distribution centers.", time: "60–90 days total" },
      { title: "Manage the relationship", body: "Deductions, chargebacks and program performance need active management — treat UNFI as a channel to run, not a box ticked.", time: "Ongoing" },
    ],
    costs: [
      { item: "Distributor fees", range: "12–28% of wholesale" },
      { item: "Annual Advertising Agreement (optional)", range: "$1,920–$42,000 / quarter" },
      { item: "Free-fill & new-item programs", range: "Free goods at launch — budget stock" },
      { item: "Deductions & chargebacks", range: "2–8% of sales — manage actively" },
      { item: "EDI & data setup", range: "$3,000–$10,000" },
    ],
    costNote:
      "UNFI can put you in 30,000 stores' reach — and quietly consume your margin if unmanaged. Successful brands treat deduction management as a weekly discipline and revisit program ROI quarterly.",
    tips: [
      { title: "Sequence retail-first.", body: "A letter of authorization converts you from queue-waiter to service request. Every retailer guide on this site is upstream of this one." },
      { title: "Model the full waterfall.", body: "Shelf price → retailer margin → distributor fee → programs → deductions. If the founder math only works at DTC prices, fix pricing before distribution." },
      { title: "Start regional.", body: "Serving a few UNFI DCs near your demand keeps logistics manageable and free-fill affordable while you prove velocity." },
      { title: "Audit deductions monthly.", body: "Erroneous deductions are common industry-wide — brands that dispute systematically recover real margin." },
    ],
    faqs: [
      { q: "How do I become a UNFI supplier?", a: "Start with the New Supplier Inquiry form on unfi.com — but the most reliable route is a retailer letter of authorization, which UNFI treats as a service request rather than a queue entry." },
      { q: "What does UNFI cost?", a: "Distributor fees run 12–28% of wholesale depending on temperature control, case size and service tier, plus optional advertising programs ($1,920–$42,000 quarterly) and standard deductions." },
      { q: "How long does UNFI setup take?", a: "Budget 60–90 days once accepted — and start it in parallel with retailer conversations, since retailers like Whole Foods generally require UNFI or KeHE distribution." },
      { q: "Does submitting the inquiry guarantee acceptance?", a: "No — even qualifying suppliers are queued for future contact based on category needs. Retail demand is what moves you to the front." },
      { q: "UNFI or KeHE?", a: "Both are credible: UNFI is Whole Foods' primary distributor; KeHE is Sprouts'. Many scaled brands eventually run both — start where your first retailer's supply chain points." },
    ],
    sources: [
      { label: "UNFI — New Supplier Inquiry", href: "https://www.unfi.com/suppliers/supplier-inquiry.html" },
      { label: "CPG Guy — how distributors work", href: "https://www.cpg-guy.com/how-do-distributors-work" },
    ],
  },
  {
    slug: "publix",
    name: "Publix",
    country: "US",
    category: "Grocery",
    cardBlurb: "The Southeast's employee-owned giant — a published forms-and-samples process to corporate buyers.",
    topGun: false,
    metaTitle: "How to Become a Publix Supplier: Vendor Forms & Buyer Process | Spottail",
    metaDescription:
      "How to get your product into Publix: the retail product supplier process, required forms, sample submission to Lakeland, broker support, timelines and costs.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Publix",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Publix supplier, follow its published **retail product supplier process** (corporate.publix.com): review the Supplier Policies and Guidelines, complete the required forms — **Cost/Promotion Form, Item Data Form, and Vendor New Item Initiative Form** — and submit your product package **addressed to the category buyer at the Lakeland, FL corporate office**. Corporate Purchasing evaluates every item presented. Publix suggests (without requiring) **broker or distributor support** to navigate the process — in the Southeast grocery channel, that advice is worth taking.",
    facts: [
      { n: "1,400+", l: "stores across the Southeast" },
      { n: "#1", l: "employee-owned US company" },
      { n: "Lakeland", l: "FL — where samples go" },
      { n: "7", l: "states of operation" },
    ],
    intro:
      "Publix is the dominant grocer of the American Southeast — an employee-owned institution with famously loyal customers and a supplier process that's refreshingly documented: specific forms, a specific address, and a corporate purchasing team that evaluates every submission. The structure rewards preparation, and the regional footprint means you're pitching seven states, not fifty — which makes Publix one of the more approachable majors for brands with Southeast relevance.",
    routesHeading: { pre: "The three routes", em: "into Publix" },
    routes: [
      {
        title: "The published supplier process",
        body: "Publix's [retail product supplier route](https://corporate.publix.com/business/publix-business-connection/retail-product-supplier) is explicit: study the Supplier Policies and Guidelines, complete the Cost/Promotion, Item Data and Vendor New Item Initiative forms (plus the Bio-Terrorism Act sample form where applicable), and deliver or mail your labeled package to the category buyer at 3300 Publix Corporate Parkway, Lakeland, FL. The buyer's team responds to every submission.",
      },
      {
        title: "Broker & distributor support",
        body: "Publix itself notes suppliers may enlist a broker or distributor for insight and navigation — and Southeast grocery runs on those relationships. An experienced Publix broker knows category review timing and buyer preferences; the commission typically pays for itself in avoided missteps.",
      },
      {
        title: "Own-brand manufacturing",
        body: "Publix runs a substantial [own-brands program](https://corporate.publix.com/business/publix-business-connection/publix-branded-product-supplier) with its own supplier route — a separate, volume-led door for manufacturers who can produce to Publix's specifications.",
      },
    ],
    requirements: [
      { k: "Required forms", v: "Cost/Promotion Form, Item Data Form, Vendor New Item Initiative Form — completed accurately before the buyer sees your product." },
      { k: "Sample submission", v: "Physical samples labeled with the buyer's name, delivered or mailed to the Lakeland corporate office (Bio-Terrorism Act form for applicable food samples)." },
      { k: "Food safety", v: "GFSI-recognized certification appropriate to category and scale for food suppliers." },
      { k: "Regional capacity", v: "Ability to supply 1,400+ stores across seven states — or a divisional plan to start." },
      { k: "Insurance & data", v: "Product liability insurance, GS1 UPCs and complete item data per Publix's guidelines." },
      { k: "EDI", v: "Electronic trading for stocked vendors." },
    ],
    note:
      "**Cultural note:** Publix's employee ownership shapes its supplier relationships — decisions are deliberate, relationships run long, and the company's Southeast identity means regional relevance (Florida especially) genuinely helps a pitch.",
    steps: [
      { title: "Study the guidelines", body: "Publix's Supplier Policies and Guidelines — the process rewards those who follow it precisely.", time: "Weeks 0–2" },
      { title: "Complete the forms", body: "Cost/Promotion, Item Data and New Item Initiative forms, accurate and complete.", time: "Weeks 0–4" },
      { title: "Submit to the buyer", body: "Labeled sample package to the Lakeland corporate office, addressed to the category buyer.", time: "Week 4" },
      { title: "Buyer evaluation", body: "Corporate Purchasing evaluates the item; the buyer's team contacts you on the outcome.", time: "1–3 months" },
      { title: "Terms & onboarding", body: "Commercial terms, compliance verification, EDI and item setup.", time: "1–3 months" },
      { title: "Launch & perform", body: "Often divisional first — velocity earns chain-wide distribution.", time: "Ongoing" },
    ],
    costs: [
      { item: "Samples & shipping", range: "$200–$1,000" },
      { item: "Broker commission (recommended)", range: "3–8% of sales" },
      { item: "Food safety certification", range: "$2,000–$8,000 / year" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "EDI setup", range: "$3,000–$15,000" },
    ],
    costNote:
      "Publix's process itself is low-cost — the real investment is broker support and the production readiness to supply the Southeast's most demanding grocer.",
    tips: [
      { title: "Follow the forms exactly.", body: "A documented process means deviations get noticed. Complete paperwork signals a supplier who'll be easy to work with." },
      { title: "Lead with Southeast relevance.", body: "Florida provenance, regional flavors, or proven Southeast sales speak directly to Publix's identity." },
      { title: "Get a Publix-experienced broker.", body: "Publix itself suggests it — and brokers know the category review calendar you can't see from outside." },
      { title: "Respect the deliberate pace.", body: "Employee-owned and famously careful — pushy follow-up hurts more here than at most retailers." },
    ],
    faqs: [
      { q: "How do I submit a product to Publix?", a: "Complete the required forms (Cost/Promotion, Item Data, Vendor New Item Initiative), then deliver or mail your labeled sample package to the category buyer at Publix's Lakeland, FL corporate office. Corporate Purchasing evaluates every item." },
      { q: "Do I need a broker to sell to Publix?", a: "Not required — but Publix itself notes suppliers may benefit from broker or distributor support, and Southeast grocery largely runs on those relationships." },
      { q: "Where does Publix operate?", a: "Around 1,400 stores across seven Southeast states — Florida at the core, plus Georgia, Alabama, Tennessee, the Carolinas and Virginia." },
      { q: "Does Publix have an own-brand supplier route?", a: "Yes — a separate Publix-branded product supplier process for manufacturers producing to Publix's specifications." },
      { q: "How long does the Publix process take?", a: "Typically 3–8 months from submission through evaluation, terms and onboarding." },
    ],
    sources: [
      { label: "Publix — Retail Product Supplier", href: "https://corporate.publix.com/business/publix-business-connection/retail-product-supplier" },
      { label: "Publix — Supplier Information", href: "https://corporate.publix.com/business/publix-business-connection" },
    ],
  },
  {
    slug: "h-e-b",
    name: "H-E-B",
    country: "US",
    category: "Grocery",
    cardBlurb: "Texas's beloved grocer — the annual Quest for Texas Best open call plus standard sourcing.",
    topGun: false,
    metaTitle: "How to Become an H-E-B Supplier: Quest for Texas Best & Vendor Process | Spottail",
    metaDescription:
      "How to get your product into H-E-B: the Quest for Texas Best competition (up to $50,000 + shelf placement), eligibility, standard supplier routes, timelines and costs.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "H-E-B",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become an H-E-B supplier, the signature route is **Quest for Texas Best** — H-E-B's annual open call for **Texas-based** food, beverage and general merchandise makers: submit via the online portal during the application window, with finalists pitching H-E-B sourcing leaders for **up to $50,000 in prizes and placement on H-E-B shelves** (and many non-winners get stocked too). Non-Texas brands use standard supplier routes through H-E-B's sourcing teams. Requirements center on **Texas operations (for Quest), production capacity for statewide supply**, and standard grocery compliance.",
    facts: [
      { n: "430+", l: "stores across Texas" },
      { n: "$50k", l: "Quest grand prize + placement" },
      { n: "Texas", l: "based makers for Quest eligibility" },
      { n: "#1", l: "most-loved US regional grocer" },
    ],
    intro:
      "H-E-B is Texas grocery — a private, family-owned chain with cult-level customer loyalty and a genuine institutional commitment to Texas makers. Quest for Texas Best formalizes it: an annual open call where small Texas producers pitch sourcing leaders directly, win real money, and land shelf placement. It's arguably the best-designed supplier competition in US retail. If you're Texas-based, it's your door; if not, H-E-B's standard sourcing still prizes distinctive products, but the bar is higher without the Texas story.",
    routesHeading: { pre: "The three routes", em: "into H-E-B" },
    routes: [
      {
        title: "Quest for Texas Best — the open call",
        body: "H-E-B's [annual competition](https://www.heb.com/discover/quest-for-texas-best) for Texas-based makers: apply through the online portal during the spring window, attend info sessions with sourcing leaders, and — if you make the finals — pitch for prizes ($50,000 grand, $25,000/$15,000/$10,000 tiers) and shelf placement. Crucially, H-E-B stocks products from beyond the top finishers — entering well is itself a sourcing conversation.",
      },
      {
        title: "Standard supplier sourcing",
        body: "Outside Quest, H-E-B's category sourcing teams evaluate suppliers year-round — a conventional grocery pitch (product, differentiation, velocity evidence, compliance) through H-E-B's supplier channels. Texas relevance still helps; so does strength in H-E-B's celebrated fresh and Hispanic-food categories.",
      },
      {
        title: "Start local inside Texas",
        body: "H-E-B's regional buying gives genuinely local products a route into nearby stores before statewide distribution — the same prove-it-then-scale ladder as other regional giants, with H-E-B's local marketing actively celebrating Texas makers on shelf.",
      },
    ],
    requirements: [
      { k: "Texas credentials (Quest)", v: "Texas residency or a business validly operating in Texas, with products made by Texas makers — the competition's eligibility core." },
      { k: "Statewide capacity", v: "Quest entrants must be capable of supplying H-E-B stores throughout Texas — 430+ stores is real volume for a small maker." },
      { k: "Food safety", v: "GFSI-recognized certification appropriate to category and scale; H-E-B's quality standards are high across fresh and packaged." },
      { k: "Compliance & data", v: "Standard grocery requirements: insurance, GS1 UPCs, complete item data, EDI for stocked vendors." },
      { k: "Distinctiveness", v: "H-E-B curates hard — products need a reason to exist beside H-E-B's own strong private brands." },
      { k: "The story", v: "Texas provenance is merchandised in-store — document and tell yours properly." },
    ],
    note:
      "**Competition insight:** Quest finalists get sourcing-leader attention that cold suppliers never reach — and H-E-B has stocked many entrants who didn't win. Treat the application as a buyer pitch with a prize attached, not a lottery ticket.",
    steps: [
      { title: "Watch for the window", body: "Quest applications open annually (spring) — track H-E-B's newsroom and the Quest portal.", time: "Annual cycle" },
      { title: "Apply properly", body: "Portal submission with product, story and capacity evidence; attend the info sessions with sourcing leaders.", time: "Application window" },
      { title: "Rounds & finals", body: "Judging rounds narrow the field; finalists pitch H-E-B leadership directly.", time: "2–4 months" },
      { title: "Placement conversations", body: "Winners and standout entrants move into sourcing discussions and store placement.", time: "1–3 months" },
      { title: "Onboard & launch", body: "Compliance, item setup and launch — often regional Texas placement first.", time: "1–3 months" },
      { title: "Scale across Texas", body: "Velocity builds toward statewide distribution and H-E-B's marketing support.", time: "Ongoing" },
    ],
    costs: [
      { item: "Quest entry", range: "Free" },
      { item: "Food safety certification", range: "$2,000–$8,000 / year" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "Statewide production scale-up", range: "Working capital — 430+ stores" },
      { item: "EDI & item setup", range: "$3,000–$15,000" },
    ],
    costNote:
      "Quest is free to enter and the prize money is non-trivial — the real cost is being production-ready for statewide supply if you win the shelf. Plan capacity before the finals, not after.",
    tips: [
      { title: "Enter Quest even if you're small.", body: "Placement decisions extend beyond winners, and the sourcing-leader exposure alone outvalues most trade shows — for free." },
      { title: "Make the Texas story tangible.", body: "H-E-B merchandises Texas provenance on shelf — ingredients, hometown, family story. Bring it documented." },
      { title: "Attend the info sessions.", body: "H-E-B tells you what it's looking for before you apply — listening is a competitive advantage." },
      { title: "Respect the private-brand bar.", body: "H-E-B's own brands are excellent — pitch what they can't easily make: heritage, craft, cult local followings." },
    ],
    faqs: [
      { q: "What is Quest for Texas Best?", a: "H-E-B's annual open call for Texas-based food, beverage and GM makers — portal applications, sourcing-leader info sessions, and finals with up to $50,000 in prizes plus shelf placement. Many non-winning entrants get stocked too." },
      { q: "Who's eligible for Quest?", a: "Texas residents or businesses validly operating in Texas, capable of producing enough to supply H-E-B stores statewide." },
      { q: "Can non-Texas brands supply H-E-B?", a: "Yes — through standard category sourcing routes, though without the Quest fast-lane. Distinctiveness against H-E-B's strong own brands is the bar." },
      { q: "How many stores does H-E-B have?", a: "Around 430 across Texas (plus its Mexico operations), including the Central Market specialty format." },
      { q: "How long does it take to get stocked?", a: "Quest runs on its annual cycle (apply → finals → placement in roughly 4–8 months); standard sourcing runs 4–9 months like other regional majors." },
    ],
    sources: [
      { label: "H-E-B — Quest for Texas Best", href: "https://www.heb.com/discover/quest-for-texas-best" },
      { label: "H-E-B Newsroom — Quest", href: "https://newsroom.heb.com/heb-quest-for-texas-best/" },
    ],
  },
  {
    slug: "wegmans",
    name: "Wegmans",
    country: "US",
    category: "Grocery",
    cardBlurb: "The Northeast's premium grocer — vendor application, GFSI certification, genuine local-supplier appetite.",
    topGun: false,
    metaTitle: "How to Become a Wegmans Supplier: Vendor Application & Local Routes | Spottail",
    metaDescription:
      "How to get your product into Wegmans: the vendor application, GFSI and EDI/GDSN requirements, the local supplier route, buyer outreach, timelines and costs.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Wegmans",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Wegmans supplier, complete the **vendor application** with business documentation (tax ID, insurance certificates), submit products for evaluation, and meet **GFSI certification** requirements — then onboard through **EDI and GDSN-certified data synchronization**, facility audits and supplier agreements. Wegmans actively wants **local suppliers** across its Northeast footprint, and with **83 buyers** the practical move is identifying yours by category (RangeMe and direct outreach both work). Premium quality is the filter everything passes.",
    facts: [
      { n: "110+", l: "stores, Northeast & Mid-Atlantic" },
      { n: "83", l: "category buyers" },
      { n: "GFSI", l: "certification required" },
      { n: "#1", l: "perennial best-grocer rankings" },
    ],
    intro:
      "Wegmans is America's premium regional grocer — a family-owned Northeast institution whose stores are destinations and whose customers trust its curation completely. That trust is the supplier bar: GFSI-certified food safety, premium quality, and data discipline (EDI plus GDSN synchronization). The compensation is a retailer that genuinely champions local producers, merchandises quality beautifully, and whose listing signals premium credibility across the industry.",
    routesHeading: { pre: "The three routes", em: "into Wegmans" },
    routes: [
      {
        title: "The vendor application",
        body: "Wegmans' [supplier process](https://www.wegmans.com/service/for-our-suppliers) runs through a formal vendor application: business documentation, insurance, product submission and evaluation, GFSI verification, facility audits and supplier agreements — followed by EDI and GDSN data-pool integration for stocked vendors.",
      },
      {
        title: "Find your buyer (of 83)",
        body: "Wegmans buying is granular — 83 buyers across categories. Identify yours via the corporate line (1-800-WEGMANS), LinkedIn and [RangeMe](https://www.rangeme.com/wegmans), and pitch with premium positioning and velocity evidence. A category-precise approach beats a general one everywhere, but especially here.",
      },
      {
        title: "The local route",
        body: "Wegmans actively recruits local suppliers across its footprint — regional produce, dairy, baked goods and specialty products are part of its identity. Local brands near its stores can start with regional placement and the in-store 'local' merchandising that Wegmans customers actively seek out.",
      },
    ],
    requirements: [
      { k: "GFSI certification", v: "GFSI-recognized food safety certification (SQF, BRCGS or equivalent) — a stated requirement for food suppliers." },
      { k: "Business documentation", v: "Tax identification, insurance certificates and financial standing for the vendor application." },
      { k: "EDI + GDSN", v: "Electronic trading plus data synchronization through GDSN-certified data pools — Wegmans' data standards are among grocery's most rigorous." },
      { k: "Facility audits", v: "Site audits as part of onboarding for food suppliers." },
      { k: "Premium quality", v: "Wegmans curates for quality above price — product excellence is the actual filter." },
      { k: "Regional capacity", v: "110+ stores of supply, or a local subset to start." },
    ],
    note:
      "**Positioning note:** Wegmans' shelf is a quality signal the whole industry reads — natural and specialty brands routinely cite Wegmans listings in national pitches. Price the effort accordingly: this is a credibility listing with real volume, not just another regional." ,
    steps: [
      { title: "Get GFSI-certified", body: "The stated requirement — start certification before the application, not after.", time: "2–4 months if new" },
      { title: "Apply + find your buyer", body: "Vendor application with full documentation, parallel category-buyer outreach via RangeMe/LinkedIn.", time: "Weeks 0–8" },
      { title: "Product evaluation", body: "Category buyer assesses quality, differentiation and fit — samples and meetings follow interest.", time: "1–3 months" },
      { title: "Audits & agreements", body: "Facility audits, supplier agreements, insurance verification.", time: "1–2 months" },
      { title: "EDI/GDSN onboarding", body: "Systems integration and data-pool synchronization before first orders.", time: "1–2 months" },
      { title: "Launch & grow", body: "Often regional placement first — velocity and quality consistency drive expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "GFSI certification", range: "$3,000–$10,000 / year" },
      { item: "EDI + GDSN data pool", range: "$4,000–$15,000" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "Facility audit readiness", range: "$1,000–$5,000" },
      { item: "Premium packaging & content", range: "$5,000–$25,000" },
    ],
    costNote:
      "Wegmans' data and certification requirements front-load the cost — but they're the same infrastructure every national retailer eventually demands. Building it for Wegmans builds it for everyone.",
    tips: [
      { title: "Certify before you pitch.", body: "GFSI is stated, not negotiable — 'certification in progress with audit date' is the minimum viable pitch position." },
      { title: "Pitch quality, not price.", body: "Wegmans wins on curation and experience — your product's excellence story matters more than its cost story." },
      { title: "Use the local identity.", body: "Northeast provenance is merchandised and celebrated — local suppliers get real in-store support." },
      { title: "Respect the data bar.", body: "GDSN-synchronized, complete, accurate item data marks you as a professional operation — Wegmans notices." },
    ],
    faqs: [
      { q: "How do I become a Wegmans supplier?", a: "Complete the vendor application with business documentation, submit products for evaluation, meet GFSI certification requirements, then onboard through facility audits, supplier agreements and EDI/GDSN integration." },
      { q: "Is GFSI certification required?", a: "Yes for food suppliers — GFSI-recognized certification (SQF, BRCGS or equivalent) is part of Wegmans' stated requirements." },
      { q: "How do I find the right Wegmans buyer?", a: "Wegmans has 83 category buyers — identify yours via 1-800-WEGMANS, LinkedIn and RangeMe, and pitch category-precisely." },
      { q: "Does Wegmans support local suppliers?", a: "Actively — local sourcing is part of its identity, with regional placement and dedicated in-store local merchandising." },
      { q: "How long does onboarding take?", a: "Typically 4–9 months including certification verification, audits and EDI/GDSN integration." },
    ],
    sources: [
      { label: "Wegmans — For Our Suppliers", href: "https://www.wegmans.com/service/for-our-suppliers" },
      { label: "RangeMe × Wegmans", href: "https://www.rangeme.com/wegmans" },
    ],
  },
  {
    slug: "albertsons",
    name: "Albertsons",
    country: "US",
    category: "Grocery",
    cardBlurb: "2,200 stores across 20+ banners (Safeway, Vons, Jewel-Osco) — Coupa portal onboarding, divisional buying.",
    topGun: false,
    metaTitle: "How to Become an Albertsons/Safeway Supplier: Portal & Process | Spottail",
    metaDescription:
      "How to become an Albertsons Companies supplier: the Coupa Supplier Portal, Safeway supplier handbooks, RangeMe discovery, divisional routes, timelines and costs.",
    kicker: "US · Grocery · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "Albertsons",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become an Albertsons supplier, register through the **Coupa Supplier Portal** — Albertsons Companies' primary vendor onboarding system — completing your supplier profile with business category, NAICS codes and product information, and work the **supplier handbooks and new-item requirements** published on its vendor portals (suppliers.safeway.com for Safeway). Buyers also discover products via **RangeMe**, and an **annual supplier diversity application** creates a structured route for certified diverse-owned businesses. Like Kroger, the structure is divisional: **20+ banners** buying regionally.",
    facts: [
      { n: "2,200+", l: "stores across the US" },
      { n: "20+", l: "banners incl. Safeway, Vons, Jewel-Osco" },
      { n: "Coupa", l: "primary onboarding portal" },
      { n: "Annual", l: "diverse-supplier application cycle" },
    ],
    intro:
      "Albertsons Companies is America's second-largest traditional grocer — a federation of regional banners (Safeway, Vons, Jewel-Osco, Shaw's, Acme and more) organized into divisions that buy with local autonomy. For suppliers that's the same opportunity Kroger's structure offers: win your region's division first. The machinery is systematized — Coupa onboarding, published supplier handbooks, documented new-item requirements — and its supplier diversity program runs a genuine annual intake for certified diverse-owned brands.",
    routesHeading: { pre: "The three routes", em: "into Albertsons" },
    routes: [
      {
        title: "Coupa portal + supplier handbooks",
        body: "Registration runs through the **Coupa Supplier Portal** (Albertsons' primary onboarding system), with the operational rulebook — [supplier handbooks, new-supplier setup and new-item requirements](https://suppliers.safeway.com/pages/BecomeASupplier.htm?page=RequirementsforNewItemPresentation.htm) — published on the vendor portals. Reading the handbook before pitching is the cheapest advantage available.",
      },
      {
        title: "Divisional buying + RangeMe",
        body: "Divisions range for their geography, and buyers use [RangeMe](https://www.rangeme.com/albertsons) for discovery. A complete RangeMe profile plus a targeted divisional pitch (with regional velocity evidence) is the emerging-brand play — your home division is your entry point, not the national chain.",
      },
      {
        title: "Supplier diversity — the annual intake",
        body: "Albertsons runs an **annual application process for certified diverse-owned suppliers** (women, BIPOC, LGBTQ+, veteran and disability-owned businesses at 51%+ ownership) — a structured route with merchant attention attached. If you qualify, certify and apply on the cycle.",
      },
    ],
    requirements: [
      { k: "Coupa registration", v: "Supplier profile with business category, NAICS codes, diversity certification details and product information." },
      { k: "Handbook compliance", v: "Requirements for new supplier setup, item approval, product samples and routing per the published handbooks." },
      { k: "Food safety", v: "GFSI-recognized certification appropriate to category and scale." },
      { k: "Insurance & documentation", v: "Product liability insurance and standard vendor documentation." },
      { k: "EDI & item data", v: "Electronic trading, GS1 UPCs and complete item data through Albertsons' systems." },
      { k: "Divisional capacity", v: "Reliable supply for your division's store count — hundreds, not thousands, to start." },
    ],
    note:
      "**Structural play:** the banner system means a Bay Area brand pitches Safeway Northern California, a Chicago brand pitches Jewel-Osco — regional identity and local velocity data are the levers. National ranging is the reward for divisional performance, same as Kroger.",
    steps: [
      { title: "Read the handbooks", body: "New-supplier setup and new-item requirements — know the process before entering it.", time: "Weeks 0–2" },
      { title: "Register on Coupa + RangeMe", body: "Complete profiles on both — onboarding system and discovery surface respectively.", time: "Weeks 0–4" },
      { title: "Pitch your division", body: "Divisional category manager approach with regional evidence; diversity program application if eligible.", time: "1–3 months" },
      { title: "Item approval & setup", body: "New-item presentation per requirements, samples, commercial terms.", time: "1–3 months" },
      { title: "Onboarding", body: "EDI, item data, routing compliance and logistics setup.", time: "1–3 months" },
      { title: "Divisional launch → expansion", body: "Regional velocity builds the cross-division and national case.", time: "Ongoing" },
    ],
    costs: [
      { item: "Food safety certification", range: "$2,000–$8,000 / year" },
      { item: "Product liability insurance", range: "$2,000–$6,000 / year" },
      { item: "EDI setup", range: "$3,000–$15,000" },
      { item: "Diversity certification (if applicable)", range: "$350–$1,500" },
      { item: "Promotional programs", range: "2–6% of sales" },
    ],
    costNote:
      "Standard national-grocer economics — the divisional structure keeps initial capacity demands manageable, and promotional participation (loyalty pricing, digital offers) is the expected trading rhythm.",
    tips: [
      { title: "Pitch the banner, not the parent.", body: "Safeway NorCal and Jewel-Osco Chicago are different businesses with different buyers — regional precision wins." },
      { title: "Use the published requirements.", body: "Albertsons documents its new-item presentation standards — matching them exactly marks you as low-friction." },
      { title: "Certify for the diversity intake.", body: "The annual program is a genuine structured door with merchant attention — worth the certification paperwork if eligible." },
      { title: "Bring regional velocity data.", body: "Divisional buyers respond to evidence from their own geography — local chains, farmers' markets, regional natural retailers." },
    ],
    faqs: [
      { q: "How do I become an Albertsons supplier?", a: "Register through the Coupa Supplier Portal (Albertsons' primary onboarding system), follow the published supplier handbooks and new-item requirements, and pitch your regional division's category manager — with RangeMe as the discovery surface." },
      { q: "What banners does Albertsons operate?", a: "20+ including Safeway, Vons, Jewel-Osco, Shaw's, Acme, Tom Thumb and Randalls — organized into regional divisions that buy with local autonomy." },
      { q: "Can I supply just my region?", a: "Yes — divisional listings are the standard entry, with national expansion earned through regional performance." },
      { q: "Does Albertsons have a diversity program?", a: "Yes — an annual application process for certified diverse-owned suppliers (51%+ owned by women, BIPOC, LGBTQ+, veterans or people with disabilities)." },
      { q: "How long does onboarding take?", a: "Typically 4–9 months from registration through divisional launch." },
    ],
    sources: [
      { label: "AlbertsonsNet — Become a Supplier", href: "https://suppliers.safeway.com/pages/BecomeASupplier.htm?page=RequirementsforNewItemPresentation.htm" },
      { label: "RangeMe × Albertsons", href: "https://www.rangeme.com/albertsons" },
    ],
  },
  {
    slug: "walgreens",
    name: "Walgreens",
    country: "US",
    category: "Drug & Convenience",
    cardBlurb: "8,000+ drugstores — RangeMe is the official on-ramp, with line-review-cycle buying.",
    topGun: false,
    metaTitle: "How to Become a Walgreens Supplier: RangeMe On-Ramp & Requirements | Spottail",
    metaDescription:
      "How to get your product into Walgreens: the RangeMe submission route, retail-ready profile standards, category review cycles, diversity programs, timelines and costs.",
    kicker: "US · Drug & Convenience · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Walgreens",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Walgreens supplier, submit through **RangeMe** (rangeme.com/walgreens) — the official on-ramp for new suppliers, with **SupplierNet** serving established vendors. Build a profile that reads **retail-ready**: real UPC and case-pack details, **margin you can defend, and proof you can fulfill at retail volume** — category buyers review submissions on their **line-review cycles**. Diverse-owned businesses have additional structured routes: the **Top Shelf program** (with the WBDC) and Walgreens' annual **Supplier Diversity Summit**.",
    facts: [
      { n: "8,000+", l: "US drugstores" },
      { n: "RangeMe", l: "official new-supplier on-ramp" },
      { n: "Line", l: "review cycles drive resets" },
      { n: "Top Shelf", l: "8-week diverse-supplier program" },
    ],
    intro:
      "Walgreens is one of America's two drugstore giants — a health-led chain where beauty, wellness, OTC and consumables compete for compact shelf space that changes hands at line reviews. Its new-supplier process is unusually clear: RangeMe in, category-manager review on the cycle, retail-readiness as the filter. The parallel diversity infrastructure (Top Shelf, the annual Summit) is among retail's most developed — structured doors, not statements.",
    routesHeading: { pre: "The three routes", em: "into Walgreens" },
    routes: [
      {
        title: "RangeMe — the official on-ramp",
        body: "Create a supplier profile at [rangeme.com/walgreens](https://www.rangeme.com/walgreens), list products with pricing, packaging, certifications and availability, and submit into categories Walgreens is actively sourcing. Category buyers review on their own schedule — usually tied to line-review cycles — and profiles that read retail-ready (UPCs, case packs, defensible margin, fulfillment proof) survive the cut.",
      },
      {
        title: "Line-review timing",
        body: "As at [CVS](/become-a-supplier/cvs), assortments reset during category line reviews — the windows when shelf space actually moves. Learn your category's cycle (brokers know) and time submissions to land ahead of it; the same product submitted mid-cycle waits months.",
      },
      {
        title: "Diversity programs — Top Shelf & the Summit",
        body: "Certified diverse-owned businesses have real structured routes: **Top Shelf**, an eight-week program with the Women's Business Development Center teaching retail partnership and supply capacity, and the annual **Supplier Diversity Summit** where diverse brands pitch offerings directly. If you qualify, these doors come with education and merchant access attached.",
      },
    ],
    requirements: [
      { k: "Retail-ready profile", v: "Real UPC and case-pack details, imagery, certifications — Walgreens buyers filter hard on completeness and professionalism." },
      { k: "Defensible margin", v: "Drug-channel margin structures with promotional room — know your economics before the buyer asks." },
      { k: "Volume capability", v: "Proof you can fulfill at retail volume across thousands of stores — or a phased plan." },
      { k: "Category compliance", v: "FDA compliance for OTC/cosmetics (MoCRA), proper labeling, and regulated-product documentation." },
      { k: "EDI & systems", v: "Electronic trading; SupplierNet onboarding once established." },
      { k: "Insurance", v: "Product liability insurance at chain-drug levels." },
    ],
    note:
      "**Channel note:** Walgreens and CVS together are ~18,000 US doors of health-and-beauty shelf — the same preparation (retail-ready data, line-review timing, broker relationships) serves both pitches. Build the kit once, run it twice.",
    steps: [
      { title: "Complete compliance groundwork", body: "FDA/MoCRA compliance, labeling, regulated-product documentation.", time: "1–2 months" },
      { title: "Build the RangeMe profile", body: "Retail-ready: UPCs, case packs, pricing, certifications, fulfillment evidence.", time: "Weeks 0–4" },
      { title: "Time the category cycle", body: "Submit ahead of your category's line review — brokers and trade contacts know the calendar.", time: "Cycle-dependent" },
      { title: "Buyer review & meetings", body: "Category manager assessment, assortment role and commercial discussion.", time: "1–4 months" },
      { title: "Onboarding", body: "Vendor setup, SupplierNet, EDI and item data.", time: "1–3 months" },
      { title: "Launch & perform", body: "Velocity against plan decides the next line review's verdict.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI setup", range: "$3,000–$15,000" },
      { item: "MoCRA/FDA compliance", range: "$1,000–$5,000" },
      { item: "Broker commission (if used)", range: "3–10% of sales" },
      { item: "Promotional programs", range: "3–8% of sales" },
    ],
    costNote:
      "Drug-channel promotion (circulars, myWalgreens offers) is the trading rhythm — budget participation. The diversity programs, where eligible, are free education plus access most brands pay consultants for.",
    tips: [
      { title: "Make the profile flawless.", body: "Walgreens' stated filter is retail-readiness — incomplete UPC or case-pack data is the quiet killer of drug-channel submissions." },
      { title: "Learn the line-review calendar.", body: "The highest-leverage information in the channel — a well-timed submission compresses the timeline by months." },
      { title: "Apply to Top Shelf if eligible.", body: "Eight weeks of retail-partnership education with WBDC backing, purpose-built to make brands Walgreens-ready." },
      { title: "Run CVS in parallel.", body: "Same channel, same preparation, different resets — two pitches from one kit doubles your odds." },
    ],
    faqs: [
      { q: "How do I become a Walgreens supplier?", a: "Submit through RangeMe (rangeme.com/walgreens) — the official on-ramp for new suppliers — with a retail-ready profile: UPCs, case packs, pricing, certifications and fulfillment proof. Category buyers review on line-review cycles." },
      { q: "What is SupplierNet?", a: "Walgreens' established-vendor portal — RangeMe is the entry route; SupplierNet handles ongoing vendor operations once you're in." },
      { q: "What makes a submission 'retail-ready'?", a: "Real UPC and case-pack details, defensible margin, professional imagery, certifications, and evidence you can fulfill at retail volume." },
      { q: "What diversity routes exist?", a: "Top Shelf — an eight-week program with the Women's Business Development Center — and the annual Supplier Diversity Summit where diverse-owned brands pitch directly." },
      { q: "How long does it take?", a: "Cycle-dependent: 3–12 months depending on where your category's line review falls relative to submission." },
    ],
    sources: [
      { label: "RangeMe × Walgreens", href: "https://www.rangeme.com/walgreens" },
      { label: "SupplierDiversity — Walgreens on-ramp", href: "https://www.supplierdiversity.com/blog/how-to-become-a-walgreens-supplier/" },
    ],
  },
  {
    slug: "lowes",
    name: "Lowe's",
    country: "US",
    category: "Home Improvement",
    cardBlurb: "The #2 home improvement giant — Vendor Gateway application plus RangeMe discovery.",
    topGun: false,
    metaTitle: "How to Become a Lowe's Supplier: Vendor Gateway & Requirements | Spottail",
    metaDescription:
      "How to become a Lowe's vendor: the supplier application and Vendor Gateway, required documentation, RangeMe discovery, compliance standards, timelines and costs.",
    kicker: "US · Home Improvement · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Lowe's",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Lowe's supplier, apply through **Lowe's supplier program** (lowes.com/l/about/suppliers) via the **prospect vendor application on Vendor Gateway** — submitting tax forms (TIN, W-9), business licenses, financial statements, insurance and banking details. Lowe's also uses **RangeMe** for product discovery. The honest mechanics: **registration doesn't guarantee contact** — merchants reach out when your products align with assortment gaps, so category-precise positioning and demand evidence decide whether the phone rings.",
    facts: [
      { n: "1,700+", l: "US stores" },
      { n: "#2", l: "US home improvement retailer" },
      { n: "Gateway", l: "vendor application portal" },
      { n: "Gaps", l: "merchants contact on assortment fit" },
    ],
    intro:
      "Lowe's is the second pillar of US home improvement — 1,700+ big-box stores plus a growing dot-com assortment, buying across tools, hardware, garden, décor and building products. Its intake is systematized (prospect application on Vendor Gateway, documentation up front) but demand-driven: merchants engage when you fill a gap in their line review. That makes positioning — knowing precisely which assortment hole you fill — the real work of a Lowe's pitch, alongside the same operational readiness [Home Depot](/become-a-supplier/home-depot) expects.",
    routesHeading: { pre: "The three routes", em: "into Lowe's" },
    routes: [
      {
        title: "Vendor Gateway — the prospect application",
        body: "Lowe's [supplier program](https://www.lowes.com/l/about/suppliers) routes new vendors through the prospect application on **Vendor Gateway**: company details, TIN and W-9, business licenses, financial statements, insurance coverage and banking. Complete registration puts you in the merchant-visible pool — contact comes when your line matches a gap.",
      },
      {
        title: "RangeMe discovery",
        body: "Lowe's uses [RangeMe](https://www.rangeme.com) for product discovery alongside the formal application — a complete profile with category-precise positioning covers the passive surface while you work merchant outreach directly.",
      },
      {
        title: "Line reviews & online-first",
        body: "Home improvement assortments reset at category line reviews, and lowes.com carries far more SKUs than stores — the online-first entry (with conversion data building the store case) is the same modern route that works at Home Depot. Time pitches to review cycles; ask merchants when yours runs.",
      },
    ],
    requirements: [
      { k: "Business documentation", v: "TIN, W-9 (US suppliers), business licenses, financial statements and valid banking details for the application." },
      { k: "Insurance", v: "Product liability and general coverage at big-box requirements, verified at onboarding." },
      { k: "Product compliance", v: "Category-specific: UL/ETL for electrical, EPA/CARB where applicable, Prop 65 labeling — certificates ready before merchant contact." },
      { k: "EDI capability", v: "Full EDI trading with testing before first PO — standard big-box operations." },
      { k: "Packaging & logistics", v: "Big-box packaging standards and DC-network delivery at appointment reliability." },
      { k: "Assortment fit", v: "The actual filter: a clear story about which gap you fill in the current line." },
    ],
    note:
      "**Process reality:** Lowe's tells suppliers plainly that registration alone doesn't trigger contact — merchants engage on fit. The application is table stakes; the work is knowing the category's current assortment well enough to name the hole you fill.",
    steps: [
      { title: "Prepare documentation", body: "TIN, W-9, licenses, financials, insurance, banking — the application checklist complete.", time: "Weeks 0–4" },
      { title: "Apply on Vendor Gateway + RangeMe", body: "Prospect application submitted, discovery profile live.", time: "Weeks 0–4" },
      { title: "Merchant engagement", body: "Contact comes on assortment fit — direct category-merchant outreach with gap analysis accelerates it.", time: "1–6 months" },
      { title: "Pitch & line review", body: "Product evaluation against the category plan, pricing and channel (store/online) decisions.", time: "1–4 months" },
      { title: "Onboarding", body: "Vendor Gateway setup, EDI testing, item data, packaging verification.", time: "1–3 months" },
      { title: "Launch & scorecard", body: "Operational metrics and sell-through drive assortment growth.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product certifications (UL/ETL etc.)", range: "$2,000–$20,000 per line" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI setup & testing", range: "$5,000–$20,000" },
      { item: "Big-box packaging", range: "$5,000–$30,000" },
      { item: "GS1 UPCs & content", range: "$250–$2,500 initial" },
    ],
    costNote:
      "Identical cost architecture to Home Depot — and deliberately so: building compliance and EDI for one qualifies you for both. Most home-improvement brands should run the two pitches in parallel.",
    tips: [
      { title: "Name the gap.", body: "Lowe's merchants contact suppliers who fill assortment holes — your pitch should open with the gap, not the product." },
      { title: "Run Home Depot in parallel.", body: "Same documentation, same compliance, same packaging engineering — one preparation, two giants." },
      { title: "Start online.", body: "Lowes.com's larger assortment is the lower bar — conversion data there builds the store-shelf case." },
      { title: "Certify before applying.", body: "UL listings take months — starting compliance after merchant interest wastes the interest." },
    ],
    faqs: [
      { q: "How do I become a Lowe's supplier?", a: "Apply through Lowe's supplier program via the prospect vendor application on Vendor Gateway — with tax forms, licenses, financials, insurance and banking details — and maintain a RangeMe profile for discovery. Merchants engage when your products fit assortment gaps." },
      { q: "Does applying guarantee a response?", a: "No — Lowe's states that representatives contact suppliers whose offerings align with inventory gaps. Category-precise positioning and direct merchant outreach improve your odds materially." },
      { q: "What compliance do products need?", a: "Category-specific: UL/ETL for electrical, EPA and CARB where applicable, Prop 65 labeling — with documentation ready at pitch." },
      { q: "Can I sell on lowes.com only?", a: "Yes — the online assortment is far larger than stores and the online-first route builds the conversion data that earns shelf placement." },
      { q: "How long does it take?", a: "Highly fit-dependent: 3–12 months from application to first PO, with merchant engagement the variable step." },
    ],
    sources: [
      { label: "Lowe's — Supplier Program", href: "https://www.lowes.com/l/about/suppliers" },
      { label: "Lowe's — Prospect Vendor Application", href: "https://vendorgateway.lowes.com/prospect/" },
    ],
  },
  {
    slug: "sams-club",
    name: "Sam's Club",
    country: "US",
    category: "Warehouse Club",
    cardBlurb: "Walmart's club channel — Member's Mark summits, Open Calls and Local Calls via RangeMe.",
    topGun: false,
    metaTitle: "How to Become a Sam's Club Supplier: Open Calls & Member's Mark | Spottail",
    metaDescription:
      "How to get your product into Sam's Club: Open Call and Local Call events via RangeMe, the Member's Mark private-brand summit, club-pack economics, timelines and costs.",
    kicker: "US · Warehouse Club · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Sam's Club",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Sam's Club supplier, work its event-driven intake: **Open Calls and regional Local Calls** (Texas, California and others) gather pitches through **RangeMe**, while the **Member's Mark Private Brand Supplier Summit** recruits manufacturers for its flagship own brand — also via RangeMe submission. Standard vendor applications run through Walmart-family channels, and all suppliers meet **Sam's Club's Standards for Suppliers**, with sustainability and production ethics explicitly weighted. Club economics apply: **big packs, big volumes, sharp members' pricing**.",
    facts: [
      { n: "600", l: "US clubs" },
      { n: "Member's", l: "Mark — the private-brand door" },
      { n: "RangeMe", l: "gathers Open Call pitches" },
      { n: "Club", l: "packs & pallet volumes" },
    ],
    intro:
      "Sam's Club is Walmart's warehouse-club channel — 600 clubs selling curated, high-velocity assortments in club packs to members. Its supplier intake has gone event-driven: Open Calls and state-level Local Calls (pitch events sourced through RangeMe) and a Private Brand Supplier Summit feeding Member's Mark, the own brand Sam's is investing in heavily. The buying math is [Costco's](/become-a-supplier/costco): few SKUs, enormous volumes, members' pricing — with Walmart's supplier infrastructure underneath.",
    routesHeading: { pre: "The three routes", em: "into Sam's Club" },
    routes: [
      {
        title: "Open Calls & Local Calls",
        body: "Sam's Club runs **Open Call events** for new suppliers and regional **Local Calls** (Texas, California and more) sourcing local products — with pitches gathered through [RangeMe](https://www.rangeme.com). These events compress months of cold outreach into scheduled buyer meetings; watch RangeMe and Sam's Club channels for windows and apply properly when they open.",
      },
      {
        title: "Member's Mark — the private-brand summit",
        body: "Sam's Club is investing hard in **Member's Mark** and hosts a Private Brand Supplier Summit to find manufacturers of 'premium, disruptive items across all categories' — submissions via RangeMe. For capable producers, it's the club version of the own-label play: committed volume under their brand, meeting Standards for Suppliers with sustainability explicitly assessed.",
      },
      {
        title: "Standard vendor routes",
        body: "Conventional applications run through Walmart-family supplier channels (see the [Walmart guide](/become-a-supplier/walmart) — the infrastructure is shared): Supplier Center, D-U-N-S, GS1 UPCs, EDI and the compliance stack, with club-specific packaging and item decisions.",
      },
    ],
    requirements: [
      { k: "Club economics", v: "Club-pack formats at members' pricing — volumes and price points that make a pallet position pay weekly." },
      { k: "Standards for Suppliers", v: "Sam's Club's (Walmart-family) supplier standards — with production ethics, workplace safety and sustainability explicitly weighted." },
      { k: "Volume capacity", v: "600 clubs of committed supply — club POs are transformative and demanding in equal measure." },
      { k: "Walmart-stack prerequisites", v: "D-U-N-S, GS1 UPCs, product liability insurance, test reports and EDI — the shared family infrastructure." },
      { k: "Club packaging", v: "Pallet-ready, display-ready club packs engineered for warehouse merchandising." },
      { k: "Sustainability story", v: "How products are made and their impact — a stated evaluation criterion, not garnish." },
    ],
    note:
      "**Event strategy:** Open Calls and Local Calls are the designed small-brand doors — real buyer meetings, decisions sometimes same-day, and regional Local Calls lower the capacity bar. Treat application windows like product launches: prepared, costed, rehearsed.",
    steps: [
      { title: "Fit-check club economics", body: "Club packs, members' pricing, pallet velocity — model it before pitching.", time: "Weeks 0–4" },
      { title: "Watch for event windows", body: "Open Calls, Local Calls and the Private Brand Summit announce through RangeMe and Sam's channels.", time: "Event cycles" },
      { title: "Apply via RangeMe", body: "Complete, club-ready submissions into the event pipeline — or standard Walmart-family channels year-round.", time: "Window-dependent" },
      { title: "Pitch the buyer", body: "Event meetings or category-merchant conversations — capacity plan and club-pack samples ready.", time: "1–3 months" },
      { title: "Onboarding", body: "Supplier agreements, EDI, item setup and club logistics through the Walmart-family stack.", time: "1–3 months" },
      { title: "Perform on the pallet", body: "Club velocity is measured relentlessly — rotation decisions come fast.", time: "Ongoing" },
    ],
    costs: [
      { item: "Club-pack packaging development", range: "$10,000–$50,000" },
      { item: "GS1, D-U-N-S & prerequisites", range: "$500–$3,000" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "EDI setup", range: "$5,000–$20,000" },
      { item: "Volume production capital", range: "Substantial — club POs" },
    ],
    costNote:
      "Club economics compress margin and multiply volume — the working-capital step-change of a 600-club PO is the risk to plan for, same as Costco. Secure production financing before the yes.",
    tips: [
      { title: "Treat Local Calls as the entry ramp.", body: "Regional events lower the capacity bar and put you in front of real buyers — the designed route for emerging brands." },
      { title: "Consider the Member's Mark play.", body: "Sam's is investing in its own brand aggressively — manufacturers with capacity get committed volume without brand-building cost." },
      { title: "Lead with sustainability substance.", body: "It's a stated evaluation criterion — certifications, impact data and supply-chain transparency belong in the pitch." },
      { title: "Reuse your Walmart kit.", body: "Shared infrastructure means one preparation serves both — but pitch club-specific packs and economics, not shelf SKUs." },
    ],
    faqs: [
      { q: "How do I become a Sam's Club supplier?", a: "Through its event-driven intake — Open Calls and regional Local Calls gathering pitches via RangeMe — the Member's Mark Private Brand Supplier Summit for own-brand manufacturers, or standard Walmart-family vendor channels." },
      { q: "What is Member's Mark?", a: "Sam's Club's flagship private brand, recruiting manufacturers of premium, disruptive items through a dedicated supplier summit — submissions via RangeMe, meeting Standards for Suppliers with sustainability weighted." },
      { q: "What are Local Calls?", a: "Regional pitch events (Texas, California and others) sourcing local products for area clubs — a lower-capacity-bar entry route run through RangeMe." },
      { q: "What volumes does Sam's Club expect?", a: "Club-scale: 600 clubs buying few SKUs at high velocity in club packs — comparable working-capital demands to Costco." },
      { q: "How long does it take?", a: "Event-cycle-dependent: an Open Call can compress the path to weeks; standard routes run 4–9 months." },
    ],
    sources: [
      { label: "Sam's Club — Open Call", href: "https://corporate.walmart.com/about/samsclub/news/2022/01/17/want-to-be-a-sams-club-supplier-now-is-your-chance" },
      { label: "RangeMe — Sam's Club Local Call FAQ", href: "https://help.rangeme.com/hc/en-us/articles/20833518742423-Sam-s-Club-Texas-Open-Call-FAQ" },
    ],
  },
  {
    slug: "sephora",
    name: "Sephora",
    country: "US",
    category: "Prestige Beauty",
    cardBlurb: "Prestige beauty's kingmaker — merchant-curated brands plus the Accelerate incubator.",
    topGun: false,
    metaTitle: "How to Get Into Sephora: Accelerate Incubator & Brand Curation | Spottail",
    metaDescription:
      "How to get your beauty brand into Sephora: the Accelerate incubator (eligibility, application, video pitch), merchant curation, prestige positioning, timelines and costs.",
    kicker: "US · Prestige Beauty · Supplier Guide",
    h1Pre: "How to get into",
    h1Em: "Sephora",
    h1Post: "",
    readTime: "9 min read",
    quickAnswer:
      "To get into Sephora, there are two doors: **merchant curation** — Sephora's category merchants scout and select brands that fit its prestige, trend-defining assortment — and **Sephora Accelerate**, the annual brand incubator for **early-stage, North America-incorporated founders**: apply online (accelerate.sephora.com) with brand details and a **short founder video**, and selected cohorts get six months of mentorship, merchandising support, potential funding and the opportunity to **launch at Sephora**. Prestige positioning, proof of consumer demand and founder story are the currencies throughout.",
    facts: [
      { n: "500+", l: "US stores + Kohl's shops" },
      { n: "6mo", l: "Accelerate incubator program" },
      { n: "Annual", l: "application window (spring)" },
      { n: "#1", l: "prestige beauty kingmaker" },
    ],
    intro:
      "Sephora is prestige beauty's defining retailer — the shelf that makes brands, with a merchant team whose curation drives the category's trends and an incubator (Accelerate) purpose-built to manufacture its next generation of brands. There's no open vendor application; there's being worth curating. For early-stage founders, Accelerate is the structured door — mentorship, funding connections and a launch path. For established brands, the work is building the prestige positioning, retail-readiness and demand signals merchants can't ignore.",
    routesHeading: { pre: "The three routes", em: "into Sephora" },
    routes: [
      {
        title: "Sephora Accelerate — the incubator",
        body: "Sephora's [Accelerate program](https://accelerate.sephora.com) takes annual applications (typically closing late March) from early-stage, North America-incorporated brands: online application, brand details, and a short video introducing you and your product — with proven consumer interest or a tested prototype required. Cohorts get six months of mentorship, merchandising support, potential funding, investor connections and retail-readiness building, with the opportunity to launch at Sephora.",
      },
      {
        title: "Merchant curation",
        body: "Sephora's category merchants scout constantly — trend velocity, social heat, DTC sell-through, press and founder narrative are the signals. As with [Ulta](/become-a-supplier/ulta), your traction *is* the application: build visible, quantified momentum where merchants look, and warm introductions (investors, incubator alumni, brokers) carry real weight in prestige beauty.",
      },
      {
        title: "Adjacent proof channels",
        body: "Sephora at Kohl's, international Sephora markets, and prestige-adjacent retail (Nordstrom, Bluemercury) all generate the sell-through evidence that de-risks a core Sephora bet — and merchants watch what performs across the prestige ecosystem.",
      },
    ],
    requirements: [
      { k: "Prestige positioning", v: "Product quality, packaging, pricing and brand world at prestige level — Sephora's shelf is the category's most curated." },
      { k: "Accelerate eligibility", v: "Early-stage, North America-incorporated, founder-led — with proven consumer interest or a customer-tested prototype." },
      { k: "MoCRA compliance", v: "US cosmetics regulation: facility registration, product listing, safety substantiation and compliant claims." },
      { k: "Demand evidence", v: "DTC velocity, social momentum, waitlists, press — quantified proof consumers want you." },
      { k: "Retail readiness", v: "Capacity, testers/merchandising units, education materials and the operations to serve 500+ doors if scaled." },
      { k: "Founder story", v: "Prestige beauty is founder-led storytelling — Accelerate literally asks for it on video." },
    ],
    note:
      "**The economics to know:** prestige retail carries heavy go-to-market costs — testers, gratis, education, animations and marketing support on top of retailer margin. Brands that budget only for wholesale margin get hollowed out by the launch year. Model the full prestige stack before chasing the shelf.",
    steps: [
      { title: "Get MoCRA-compliant", body: "Registration, listings, claims and safety files — before any retail conversation.", time: "1–2 months" },
      { title: "Build prestige-grade assets", body: "Brand world, packaging, content and the demand signals merchants scout.", time: "Ongoing" },
      { title: "Apply to Accelerate (if eligible)", body: "Annual window — application, brand details and founder video, done properly.", time: "Annual cycle" },
      { title: "Or: earn merchant attention", body: "Quantified traction, warm introductions, prestige-adjacent sell-through.", time: "6–18 months" },
      { title: "Launch preparation", body: "Assortment, testers, education, marketing plan — the prestige launch stack.", time: "3–6 months" },
      { title: "Perform per door", body: "Sephora measures productivity per door ruthlessly — velocity decides expansion or exit.", time: "Ongoing" },
    ],
    costs: [
      { item: "MoCRA compliance", range: "$1,000–$5,000" },
      { item: "Prestige packaging & brand", range: "$20,000–$100,000+" },
      { item: "Testers, gratis & education", range: "3–10% of sales" },
      { item: "Marketing & animations", range: "Launch-year heavy — budget accordingly" },
      { item: "Accelerate application", range: "Free" },
    ],
    costNote:
      "Sephora can make a brand — and the launch-year investment to perform there is the highest in this guide series. Underfunded Sephora launches damage brands; well-funded ones define them.",
    tips: [
      { title: "Apply to Accelerate seriously.", body: "It's the designed early-stage door — free to enter, transformative if selected. Treat the video like the pitch of your life." },
      { title: "Build in public.", body: "Merchants scout social velocity and DTC momentum — visible, quantified traction is your application." },
      { title: "Learn the per-door math.", body: "Sephora thinks in productivity per door — model your velocity assumptions before the merchant asks." },
      { title: "Fund the launch year.", body: "Testers, education, marketing support — raise or reserve for it. The shelf is the start line, not the finish." },
    ],
    faqs: [
      { q: "How do I get my brand into Sephora?", a: "Two doors: merchant curation — building the prestige positioning and demand signals Sephora's scouts respond to — or Sephora Accelerate, the annual incubator for early-stage North American brands with a path to launching at Sephora." },
      { q: "What is Sephora Accelerate?", a: "Sephora's brand incubator: annual applications (online form plus founder video), six months of mentorship, merchandising support, potential funding and investor connections, with the opportunity to launch at Sephora." },
      { q: "Who's eligible for Accelerate?", a: "Founders 18+, North America-incorporated companies in early stages, with proven consumer interest or a customer-tested prototype." },
      { q: "Does Sephora have an open vendor application?", a: "No — outside Accelerate, brands are curated by category merchants based on prestige fit, traction and trend relevance." },
      { q: "What does launching at Sephora cost?", a: "The heaviest go-to-market stack in beauty retail: testers, gratis, education and marketing support on top of margin — budget the launch year like a raise." },
    ],
    sources: [
      { label: "Sephora Accelerate", href: "https://newsroom.sephora.com/2026-applications-open-for-sephora-accelerate-the-leading-us-beauty-brand-incubator-program/" },
      { label: "RETAILBOSS — Accelerate application guide", href: "https://retailboss.co/heres-how-to-apply-for-sephora-accelerate/" },
    ],
  },
  {
    slug: "rei",
    name: "REI",
    country: "US",
    category: "Outdoor",
    cardBlurb: "The outdoor co-op — buyer-approved vendors, sustainability standards, and Path Ahead Ventures.",
    topGun: false,
    metaTitle: "How to Become an REI Vendor: Approval Process & Path Ahead | Spottail",
    metaDescription:
      "How to become an REI supplier: the vendor approval process, REI's product impact and sustainability standards, EDI, and Path Ahead Ventures for founders of color.",
    kicker: "US · Outdoor · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "REI",
    h1Post: "vendor",
    readTime: "9 min read",
    quickAnswer:
      "To become an REI vendor, win a **category buyer** — REI's merchandising teams approve vendors whose products fit the co-op's outdoor assortment and meet its **Product Impact Standards** (sustainability and chemical-management expectations that apply to every brand on its shelves) — then onboard through vendor agreements and **EDI** (REI trades via the SPS network). For **founders of color** in the outdoor industry, REI's **Path Ahead Ventures** is a dedicated door: its Navigate program pairs founders with advisors, a cohort community, and a **$25,000 non-dilutive grant**, with potential paths into REI's assortment.",
    facts: [
      { n: "180+", l: "US stores" },
      { n: "24m+", l: "co-op members" },
      { n: "$25k", l: "Path Ahead Navigate grant" },
      { n: "Impact", l: "standards apply to all brands" },
    ],
    intro:
      "REI is American outdoor retail's flagship — a member-owned co-op whose curation carries specialty credibility no big box can match, and whose values genuinely gate its shelf: REI's Product Impact Standards set sustainability and chemicals expectations for every vendor. Buying is specialist and relationship-driven; community proof (guides, athletes, trail culture) counts. And Path Ahead Ventures — REI's venture fund and founder program for entrepreneurs of color — is one of specialty retail's most substantive structured doors.",
    routesHeading: { pre: "The three routes", em: "into REI" },
    routes: [
      {
        title: "Category buyer approval",
        body: "REI vendors are approved by category merchandising teams — the pitch is specialist: technical credibility, community adoption, differentiation from the current assortment, and compliance with [REI's Product Impact Standards](https://www.rei.com/greenlight). Specialty outdoor sell-through (independent shops, guide services, outdoor marketplaces) is the evidence that moves REI buyers.",
      },
      {
        title: "Path Ahead Ventures — for founders of color",
        body: "REI's [Path Ahead Ventures](https://www.rei.com/action/path-ahead) accelerates founders of color in the outdoor industry: the **Navigate** program pairs participants with dedicated advisors (operational readiness, assortment, pricing, buyer engagement), a founder cohort, and a **$25,000 non-dilutive grant** — with potential paths into REI's assortment or partnership. Entry is by invitation; interested founders contact pathaheadventures@rei.com.",
      },
      {
        title: "Community-proven credibility",
        body: "Outdoor specialty buys what the community already trusts — guide and athlete adoption, expedition use, specialty-shop velocity and authentic trail presence. Build the credibility layer first; REI's buyers are members of the community they buy for.",
      },
    ],
    requirements: [
      { k: "Product Impact Standards", v: "REI's sustainability and chemicals-management expectations apply to all vendors — preferred attributes, restricted substances and impact documentation." },
      { k: "Technical credibility", v: "Outdoor gear is trust-critical — testing, materials transparency and field-proof appropriate to the category." },
      { k: "EDI (SPS network)", v: "REI trades via EDI on the SPS Commerce network — onboarding includes systems integration." },
      { k: "Specialty economics", v: "Wholesale pricing for specialty retail margins, with co-op member pricing dynamics understood." },
      { k: "Capacity", v: "180+ stores plus rei.com — or a curated-door start with room to scale." },
      { k: "Insurance & compliance", v: "Product liability insurance and category safety compliance (CPSIA, applicable ASTM standards)." },
    ],
    note:
      "**Values are load-bearing here:** REI's impact standards and co-op identity aren't marketing — they gate the assortment. Brands with substantive sustainability stories (materials, repairability, certifications) hold a real advantage; brands without them face questions before commercials.",
    steps: [
      { title: "Build community proof", body: "Specialty sell-through, guide/athlete adoption, authentic outdoor presence — quantified.", time: "Ongoing" },
      { title: "Document impact credentials", body: "Materials, certifications, chemicals compliance against REI's standards.", time: "1–2 months" },
      { title: "Pitch the category buyer", body: "Specialist deck: technical story, community evidence, assortment differentiation, impact documentation.", time: "1–4 months" },
      { title: "Or: pursue Path Ahead", body: "Founders of color contact pathaheadventures@rei.com for Navigate consideration.", time: "Program cycles" },
      { title: "Vendor onboarding", body: "Agreements, SPS-network EDI, item data and logistics setup.", time: "1–3 months" },
      { title: "Launch & earn doors", body: "Often curated-door or online-first — specialty velocity drives expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "Impact documentation & certifications", range: "$1,000–$10,000" },
      { item: "Product testing (category-dependent)", range: "$1,000–$10,000 per line" },
      { item: "EDI via SPS network", range: "$3,000–$15,000" },
      { item: "Product liability insurance", range: "$2,000–$8,000 / year" },
      { item: "Community marketing (athletes, events)", range: "Your credibility budget" },
    ],
    costNote:
      "Specialty outdoor economics are kinder than mass retail — better margins, curated assortments — but the credibility investment (community, testing, impact documentation) is the real entry cost, and it compounds across every outdoor retailer.",
    tips: [
      { title: "Lead with impact substance.", body: "REI's standards gate the shelf — certifications, preferred materials and transparency belong on page one of the pitch." },
      { title: "Prove it in specialty first.", body: "Independent outdoor shops and guide adoption are the evidence REI's community-member buyers trust." },
      { title: "Founders of color: pursue Path Ahead.", body: "A $25k non-dilutive grant, dedicated advisors and REI proximity — among the most substantive founder programs in retail." },
      { title: "Pitch the co-op member.", body: "REI buys for members, not customers — durable, repairable, genuinely useful gear over trend-chasing." },
    ],
    faqs: [
      { q: "How do I become an REI vendor?", a: "Win approval from the category merchandising team — with technical credibility, community-proven demand and compliance with REI's Product Impact Standards — then onboard through vendor agreements and EDI on the SPS network." },
      { q: "What is Path Ahead Ventures?", a: "REI's venture fund and founder program accelerating founders of color in the outdoor industry — the Navigate program provides dedicated advisors, a cohort community and a $25,000 non-dilutive grant, with potential paths into REI's assortment. Contact pathaheadventures@rei.com." },
      { q: "What are REI's Product Impact Standards?", a: "Sustainability and chemicals-management expectations applying to all REI vendors — covering preferred attributes, restricted substances and supply-chain impact." },
      { q: "What evidence do REI buyers want?", a: "Community proof: specialty-shop sell-through, guide and athlete adoption, and technical credibility appropriate to the category." },
      { q: "How long does it take?", a: "Typically 4–9 months from buyer engagement through onboarding — with community credibility-building the real (longer) runway." },
    ],
    sources: [
      { label: "REI — Path Ahead Ventures", href: "https://www.rei.com/action/path-ahead" },
      { label: "TradeBeyond — REI vendor approval", href: "https://www.tradebeyond.com/blog/how-to-become-an-approved-rei-vendor" },
    ],
  },
  {
    slug: "kehe",
    name: "KeHE",
    country: "US",
    category: "Distribution",
    cardBlurb: "The natural & specialty distributor behind Sprouts — supplier submissions, EDI, and a new-brand program.",
    topGun: false,
    metaTitle: "How to Get Into KeHE: New Supplier Process, Costs & Strategy | Spottail",
    metaDescription:
      "How to become a KeHE supplier: the submission routes, product preferences (organic, wellness), EDI requirements, onboarding, the new-supplier flat-rate program and costs.",
    kicker: "US · Distribution · Supplier Guide",
    h1Pre: "How to get into",
    h1Em: "KeHE",
    h1Post: "",
    readTime: "9 min read",
    quickAnswer:
      "To become a KeHE supplier, submit through **KeHE's supplier channels** (kehe.com/suppliers, the CONNECT Direct inquiry, or **RangeMe**, which KeHE buyers use for discovery) — with your supply chain, certifications and **EDI readiness** in order first, since KeHE processes orders electronically. KeHE favors **organic, non-GMO, ethically sourced products with clear wellness benefits**, runs a rigorous onboarding (product evaluation, financial assessment, compliance), and notably offers **new and small suppliers (under $500k, first year) a 2% flat-rate program**. As [Sprouts'](/become-a-supplier/sprouts) primary distributor, KeHE is the natural channel's second pillar alongside [UNFI](/become-a-supplier/unfi).",
    facts: [
      { n: "30k+", l: "retail locations served" },
      { n: "2%", l: "flat-rate program for new suppliers" },
      { n: "B Corp", l: "certified, employee-owned" },
      { n: "Sprouts", l: "primary distribution partner" },
    ],
    intro:
      "KeHE is the second engine of US natural and specialty distribution — a B Corp-certified, employee-owned distributor serving 30,000+ stores, and the primary supply partner of Sprouts. The strategic logic mirrors UNFI: retailers in the natural channel buy through distributors, so KeHE is infrastructure you'll likely need — and its posture toward emerging brands is notably friendly, from RangeMe discovery to a flat-rate program built for first-year suppliers. Same rule as UNFI though: retail demand pulls you in; the inquiry form alone doesn't.",
    routesHeading: { pre: "The three routes", em: "into KeHE" },
    routes: [
      {
        title: "Supplier submission + RangeMe",
        body: "KeHE takes new products through [its supplier channels](https://www.kehe.com/suppliers/) and the CONNECT Direct inquiry — and its buyers use [RangeMe](https://www.rangeme.com/kehe) for discovery. Before submitting: supply chain, inventory management, certifications and **EDI readiness** in order, because that's how KeHE processes orders.",
      },
      {
        title: "Retailer pull — the reliable route",
        body: "As with UNFI, a retailer commitment (Sprouts, a regional natural chain, an independent group) converts you from cold submission to service necessity. Win the shelf first — see the [Sprouts guide](/become-a-supplier/sprouts) — and bring KeHE the demand; the distribution follows the retail, never the reverse.",
      },
      {
        title: "Category management & launch programs",
        body: "Once in, KeHE's category management team drives new-item launches — expect to co-build a launch plan with promotional support behind it. The **2% flat-rate program** for new suppliers (under $500k, first year at KeHE, subject to supplier-manager approval) meaningfully softens the early economics.",
      },
    ],
    requirements: [
      { k: "Product profile", v: "KeHE favors organic, non-GMO, ethically sourced products with clear health and wellness benefits — FDA-compliant and meeting KeHE quality standards." },
      { k: "EDI readiness", v: "Electronic trading in place — KeHE processes supplier orders via EDI, plus item maintenance and pricing submissions through its systems." },
      { k: "Onboarding rigor", v: "Product evaluations, financial assessments and compliance checks — the standard distributor gauntlet." },
      { k: "Retail demand", v: "The real prerequisite: retailer interest or commitments that make your setup a service request." },
      { k: "Launch investment", v: "A co-built launch plan with promotional support — new items don't sell themselves through a catalog." },
      { k: "Distributor economics", v: "Wholesale pricing that survives distributor margins plus programs — modeled before signing (the 2% flat-rate program helps year one)." },
    ],
    note:
      "**UNFI or KeHE?** Run the decision from your retailers: UNFI is Whole Foods' primary, KeHE is Sprouts' — and many scaled brands eventually carry both. KeHE's new-supplier flat-rate program and B Corp culture make it the gentler first distributor for many emerging natural brands.",
    steps: [
      { title: "Win retail demand first", body: "Retailer commitments or strong interest — the unlock for distributor attention.", time: "Months — see retailer guides" },
      { title: "Get EDI and compliance ready", body: "Systems, certifications and documentation in order before submitting.", time: "1–2 months" },
      { title: "Submit + RangeMe profile", body: "KeHE supplier channels, CONNECT Direct inquiry, and discovery presence.", time: "Weeks 0–4" },
      { title: "Onboarding gauntlet", body: "Product evaluation, financial assessment, compliance checks; program decisions (flat-rate if eligible).", time: "1–3 months" },
      { title: "Co-build the launch", body: "Category management launch plan with promotional support committed.", time: "1–2 months" },
      { title: "Manage the channel", body: "Deductions, promotions and program ROI — active weekly management, as with any distributor.", time: "Ongoing" },
    ],
    costs: [
      { item: "Distributor margin / programs", range: "% of wholesale (2% flat-rate program if eligible, year one)" },
      { item: "EDI setup", range: "$3,000–$10,000" },
      { item: "Launch & promotional programs", range: "3–8% of sales" },
      { item: "Free-fill & new-item support", range: "Free goods at launch — budget stock" },
      { item: "Deductions management", range: "2–8% of sales — manage actively" },
    ],
    costNote:
      "The flat-rate program is a genuine early-stage subsidy — but the full distributor waterfall (margin, programs, deductions, free-fill) still applies at scale. Model shelf-price-backwards before signing anything.",
    tips: [
      { title: "Sequence retail-first.", body: "Sprouts interest, regional chains, independents — retail pull is what moves a KeHE submission from queue to setup." },
      { title: "Claim the flat-rate program.", body: "Under $500k and in your first KeHE year? Ask your supplier manager about the 2% program explicitly — it exists for you." },
      { title: "Fit the wellness profile.", body: "Organic, non-GMO, functional benefits — KeHE's stated preferences. Make your attributes unmissable in the submission." },
      { title: "Plan UNFI + KeHE as a system.", body: "Whole Foods pulls UNFI, Sprouts pulls KeHE — your retailer roadmap dictates your distributor roadmap." },
    ],
    faqs: [
      { q: "How do I become a KeHE supplier?", a: "Submit through KeHE's supplier channels (kehe.com, CONNECT Direct) or RangeMe — with EDI, certifications and supply chain ready — and ideally with retailer demand pulling you in. Onboarding includes product evaluation, financial assessment and compliance checks." },
      { q: "What products does KeHE favor?", a: "Organic, non-GMO, ethically sourced products with clear health and wellness benefits, FDA-compliant and meeting KeHE's quality standards." },
      { q: "What is the new-supplier flat-rate program?", a: "KeHE offers new and small suppliers (under $500k, within their first KeHE year) a 2% flat-rate program, pending supplier-manager approval — a meaningful early-economics subsidy." },
      { q: "KeHE or UNFI first?", a: "Follow your retailers: KeHE is Sprouts' primary distributor, UNFI is Whole Foods' — many brands eventually run both." },
      { q: "How long does KeHE onboarding take?", a: "Typically 2–4 months once engaged — faster with retailer authorization pulling the setup." },
    ],
    sources: [
      { label: "KeHE — Submit Your Products", href: "https://www.kehe.com/suppliers/" },
      { label: "Foodbevy — KeHE guide", href: "https://guide.foodbevy.com/s7-chapter-04-kehe/" },
    ],
  },
];
