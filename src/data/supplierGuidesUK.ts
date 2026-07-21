import { SupplierGuide } from "./supplierGuideTypes";

// UK supplier guides. Currency: GBP (£) throughout.
export const supplierGuidesUK: SupplierGuide[] = [
  {
    slug: "tesco",
    name: "Tesco",
    country: "UK",
    category: "Grocery",
    cardBlurb: "The UK's largest retailer. BRCGS, RangeMe & Red Door routes, 6–18 months to shelf.",
    topGun: true,
    metaTitle: "How to Become a Tesco Supplier (UK): Requirements, Process & Timeline | Spottail",
    metaDescription:
      "Step-by-step guide to becoming a Tesco supplier: BRCGS requirements, the RangeMe and Red Door routes, realistic timelines (6–18 months), costs, and how to improve your odds.",
    kicker: "UK · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Tesco",
    h1Post: "supplier",
    readTime: "12 min read",
    quickAnswer:
      "To become a Tesco supplier, list your products on **RangeMe** (where Tesco buyers discover new products) or submit through **Tesco's Red Door** innovation programme, meet the core requirements — **BRCGS Grade A/AA certification** for food, **£10m product liability insurance**, audited accounts and **EDI capability** — then pass product assessment, site audits and commercial negotiation. The full process typically takes **6–18 months**.",
    facts: [
      { n: "3,400+", l: "UK stores" },
      { n: "27m", l: "weekly customers" },
      { n: "6–18", l: "months to shelf" },
      { n: "27%", l: "UK grocery share" },
    ],
    intro:
      "Tesco is the UK's largest retailer — which makes it both the most valuable listing a brand can win and one of the hardest. Its buying teams receive hundreds of supplier approaches every year, and the qualification bar is deliberately high. This guide covers every route in, exactly what Tesco requires, what it costs, and how to give your brand a realistic shot.",
    routesHeading: { pre: "The four routes", em: "into Tesco" },
    routes: [
      {
        title: "RangeMe — where Tesco buyers actually look",
        body: "Tesco's buying teams use [RangeMe](https://www.rangeme.com/tesco) for new product discovery. Creating a profile is free: upload product specs, imagery, pricing and certifications, and category buyers browse when reviewing their ranges. The lowest-friction starting point — but passive. A listing without outreach is a shop window on a quiet street.",
      },
      {
        title: "Tesco Red Door — the innovation route",
        body: "Tesco's [Red Door](https://www.tescoplc.com/innovation) is a single point of access for anything genuinely new: food and drink innovation, packaging, and technology. Submissions go to Tesco's group innovation team, who evaluate ideas and route promising ones to the right category. If your product has a real point of difference, this gets you evaluated by people whose job is to find what buyers might miss.",
      },
      {
        title: "Direct category buyer outreach",
        body: "Every Tesco category has a buying team led by a category manager — the person who actually decides on your listing. Well-targeted, concise outreach (under 150 words, with a spec sheet, imagery and evidence your product sells elsewhere) gets response rates around 4–6%. That sounds low; it's better than most trade fairs deliver per pound spent.",
      },
      {
        title: "Start smaller: regional trials and wholesale",
        body: "Tesco runs local and regional sourcing, and will sometimes trial promising products in a limited region before a national decision. Many brands reach Tesco shelves indirectly — proving sales through wholesalers like [Booker](/become-a-supplier/booker) (Tesco-owned) or independent retail first, then arriving at the buyer conversation with sell-through data instead of promises.",
      },
    ],
    requirements: [
      { k: "Food safety certification", v: "BRCGS Grade A or AA for food & drink, audited annually. GlobalG.A.P. for fresh produce; Soil Association (or equivalent) for organic lines." },
      { k: "Insurance", v: "Product liability cover of £10m minimum, plus public liability." },
      { k: "Financials", v: "Credit checks and up to three years of accounts — Tesco needs confidence you can fund production at their volumes." },
      { k: "EDI capability", v: "Electronic ordering, shipping notices and invoicing. All stocked suppliers trade with Tesco via EDI." },
      { k: "Product data", v: "GTIN/barcodes per SKU, full specifications, nutritional data and UK-compliant labelling." },
      { k: "Traceability", v: "Batch-level tracking, ingredient origin documentation, and recall procedures." },
      { k: "Ethical & sustainability", v: "Tesco's Supplier Code of Conduct, modern slavery due diligence (Sedex/SMETA audits are common), packaging recyclability, carbon-reduction commitments." },
      { k: "Non-food standards", v: "Category-specific: CPSR safety reports for cosmetics, chemical safety data for household products, UKCA marking where applicable." },
    ],
    note:
      "**Small-supplier note:** Tesco is bound by GSCOP (the Groceries Supply Code of Practice), which protects suppliers on payment terms and de-listing — and Tesco has committed to faster payment for its smallest suppliers. Being small is not the barrier most founders assume; being unprepared is.",
    steps: [
      { title: "Get discovered or get in touch", body: "RangeMe profile live, Red Door submission, or direct buyer outreach — ideally more than one.", time: "Weeks 0–8" },
      { title: "Product assessment", body: "The buying team evaluates differentiation, category fit, consumer demand evidence and pricing vs. the current range. Samples are requested if there's interest.", time: "1–3 months" },
      { title: "Supplier qualification", body: "Documentation review (certs, financials, insurance, specs) followed by a site audit covering production, quality control, safety and logistics.", time: "2–4 months" },
      { title: "Commercial negotiation", body: "Cost price, volumes and MOQs, promotional funding, payment terms, delivery schedule. Know your margin floor before this meeting.", time: "1–3 months" },
      { title: "Onboarding", body: "EDI integration, product data setup, artwork and labelling sign-off, first purchase orders.", time: "1–2 months" },
      { title: "Launch — and prove it", body: "Products hit shelves, and the clock starts on the metrics that decide your future: rate of sale, availability (95%+ on-time delivery expected), and complaint rates.", time: "Ongoing" },
    ],
    costs: [
      { item: "BRCGS certification & annual audit", range: "£3,000–£8,000 / year" },
      { item: "Product testing & shelf-life validation", range: "£1,000–£3,000 per product" },
      { item: "EDI setup", range: "£5,000–£15,000" },
      { item: "Insurance uplift (£10m cover)", range: "£2,000–£5,000 / year" },
      { item: "Packaging & artwork changes", range: "£10,000–£50,000" },
      { item: "Promotional contributions", range: "2–5% of sales" },
    ],
    costNote:
      "Budget realistically for 12–18 months before Tesco revenue turns profitable, once certification, tooling and promotional support are counted. This is why the \"prove it smaller first\" route isn't a consolation prize — it's how you fund the big listing.",
    tips: [
      { title: "Bring sell-through data, not samples alone.", body: "A buyer who sees your rate of sale in 20 independents or a wholesaler takes a smaller risk on you. Evidence beats enthusiasm." },
      { title: "Know the category better than the buyer expects.", body: "Which products underperform, where the range has gaps, and precisely where you fit. Pitch the category story, not just your product." },
      { title: "Get certification underway before you pitch.", body: "\"BRCGS audit booked for October\" keeps a conversation alive; \"we'll look into it\" ends one." },
      { title: "Price for promotion.", body: "Tesco will expect promotional participation. If your margin only works at full price, it doesn't work." },
      { title: "Consider private label in parallel.", body: "Around half of Tesco's food sales are own-label — contract manufacturing can fund your brand's growth while you build toward a branded listing." },
    ],
    faqs: [
      { q: "How long does it take to become a Tesco supplier?", a: "Typically 6–18 months from first contact to products on shelf. Assessment, audits and commercial negotiation each take several months — and buyers review ranges on category cycles, so timing matters too." },
      { q: "Do I need BRCGS certification to supply Tesco?", a: "For food and drink, yes — Grade A or AA with annual audits. Non-food has category-specific standards (CPSR for cosmetics, UKCA marking where applicable)." },
      { q: "How do I contact a Tesco buyer directly?", a: "Tesco buyers use RangeMe for discovery, and Red Door handles innovation submissions. Direct outreach to the category buying team works best with a sub-150-word pitch, spec sheet and proof of sales elsewhere." },
      { q: "Can small brands supply Tesco?", a: "Yes — Tesco sources locally and regionally, runs trials in limited regions, and GSCOP protects smaller suppliers on payment and de-listing. Most small brands do better proving sales in independents and wholesale first." },
      { q: "How much does it cost to become a Tesco supplier?", a: "Plan for five figures before first payment: certification (£3–8k/yr), EDI (£5–15k), testing, insurance, packaging and promotional funding." },
      { q: "What is Tesco's Red Door?", a: "Tesco's single point of access for innovators — new products, packaging and technology are submitted via tescoplc.com and evaluated by the group innovation team." },
    ],
    sources: [
      { label: "Tesco PLC — Innovation & Red Door", href: "https://www.tescoplc.com/innovation" },
      { label: "RangeMe × Tesco", href: "https://www.rangeme.com/tesco" },
    ],
  },
  {
    slug: "sainsburys",
    name: "Sainsbury's",
    country: "UK",
    category: "Grocery",
    cardBlurb: "The UK's second-largest grocer, with a dedicated route for emerging challenger brands.",
    topGun: true,
    metaTitle: "How to Become a Sainsbury's Supplier: Requirements, Process & Timeline | Spottail",
    metaDescription:
      "How to get stocked in Sainsbury's: the supplier registration route, Future Brands for challengers, EDI and certification requirements, timelines and costs.",
    kicker: "UK · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Sainsbury's",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become a Sainsbury's supplier, register your interest through **Sainsbury's supplier application form**, or — if you're an emerging challenger brand — target the **Future Brands** team, which exists to bring distinctive small brands into the range. You'll need food safety certification (BRCGS or equivalent for food), **EDI capability**, ethical trade compliance, and the capacity to supply at scale. Expect **6–12+ months** from first contact to shelf.",
    facts: [
      { n: "1,400+", l: "stores & convenience" },
      { n: "~15%", l: "UK grocery share" },
      { n: "6–12+", l: "months to shelf" },
      { n: "2nd", l: "largest UK grocer" },
    ],
    intro:
      "Sainsbury's is the UK's second-largest supermarket — slightly more premium-skewed than Tesco or Asda, and notable for actively backing challenger brands rather than only established names. That makes it one of the more realistic Big Four targets for a distinctive smaller brand, if you come prepared.",
    routesHeading: { pre: "The three routes", em: "into Sainsbury's" },
    routes: [
      {
        title: "Supplier registration — the formal front door",
        body: "Sainsbury's takes new supplier interest through its [becoming a supplier](https://help.sainsburys.co.uk/help/products/becoming_a_supplier) process — submit your company and product details and they're routed to the relevant buying team. Complete, specific submissions (specs, pricing, certifications, sales evidence) dramatically outperform vague ones.",
      },
      {
        title: "Future Brands — the challenger route",
        body: "Sainsbury's **Future Brands** team exists specifically to find and nurture distinctive, emerging brands — it has brought hundreds of challenger products into stores, often with more flexible commercial terms and merchandising support than a standard listing. If your brand has a strong story and a point of difference, this is the route to aim for.",
      },
      {
        title: "Direct category buyer outreach",
        body: "As with every multiple, the category buyer decides. A concise pitch with rate-of-sale data from independents, wholesale or online sales gives a buyer a reason to reply. Time your approach to category range reviews where possible.",
      },
    ],
    requirements: [
      { k: "Food safety certification", v: "BRCGS (or equivalent GFSI-recognised standard) for food suppliers, with supporting HACCP documentation." },
      { k: "EDI capability", v: "Sainsbury's requires suppliers to trade electronically — orders, delivery notices and invoices — and issues a Supplier ID and Global Location Number (GLN) during onboarding." },
      { k: "Ethical trade", v: "Compliance with Sainsbury's Code of Conduct for Ethical Trade; Sedex registration and SMETA audits are the common evidence." },
      { k: "Insurance & financials", v: "Product liability insurance and financial due diligence — be ready to show accounts and prove you can fund production at multiple-grocer volume." },
      { k: "Product data & labelling", v: "GTIN/barcodes, full specifications and UK-compliant labelling and nutritional data." },
      { k: "Capacity & resilience", v: "Demonstrable ability to maintain availability and scale with demand — availability failures are the fastest way to lose a listing." },
    ],
    note:
      "**Small-supplier note:** Sainsbury's is a GSCOP-designated retailer, so smaller suppliers have code protections on payment and de-listing. Future Brands exists precisely because Sainsbury's wants distinctive small brands — polish your story before your spreadsheet.",
    steps: [
      { title: "Register interest", body: "Submit through the supplier form with full specs, pricing and evidence — or get in front of the Future Brands team if you're an emerging brand.", time: "Weeks 0–8" },
      { title: "Buyer review", body: "The category team assesses fit, differentiation and commercials against the current range and review cycle.", time: "1–3 months" },
      { title: "Due diligence", body: "Certification checks, ethical trade compliance, financial checks and (for food) technical audits.", time: "1–3 months" },
      { title: "Commercial terms", body: "Cost price, promotional plan, payment terms, volumes and delivery arrangements.", time: "1–2 months" },
      { title: "Onboarding & EDI", body: "Supplier ID and GLN issued, EDI integration tested, product data loaded, first orders raised.", time: "1–2 months" },
      { title: "Launch & prove velocity", body: "Initial listing may be limited stores or trial ranges — rate of sale decides expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "BRCGS certification & audit", range: "£3,000–£8,000 / year" },
      { item: "EDI setup", range: "£5,000–£15,000" },
      { item: "Product liability insurance", range: "£2,000–£5,000 / year" },
      { item: "Product testing & specs", range: "£1,000–£3,000 per product" },
      { item: "Promotional funding", range: "2–5% of sales" },
    ],
    costNote:
      "Future Brands listings can carry lighter commercial demands than standard listings, but you should still budget for promotion — visibility inside a supermarket is never free.",
    tips: [
      { title: "Lead with your point of difference.", body: "Future Brands looks for distinctiveness — a genuinely new product, story or audience, not a cheaper version of what's already on shelf." },
      { title: "Bring proof of demand.", body: "Sell-through from independents, wholesale, or strong DTC repeat rates make a buyer's decision defensible." },
      { title: "Be range-review aware.", body: "Buyers list new products when categories are reviewed. Ask when the next review is, and work backwards." },
      { title: "Get EDI-ready early.", body: "Onboarding stalls most often on systems. Having an EDI provider selected shortens the runway." },
    ],
    faqs: [
      { q: "How do I apply to become a Sainsbury's supplier?", a: "Register through Sainsbury's supplier interest process on their help site, with complete product specs, pricing and certifications. Emerging brands should also target the Future Brands team." },
      { q: "What is Sainsbury's Future Brands?", a: "A dedicated Sainsbury's team that finds and nurtures emerging challenger brands, bringing distinctive products into stores — often with more flexible terms than standard listings." },
      { q: "Do I need EDI to supply Sainsbury's?", a: "Yes — all stocked suppliers trade electronically. You'll be issued a Supplier ID and GLN during onboarding." },
      { q: "How long does it take to get stocked in Sainsbury's?", a: "Typically 6–12+ months from first contact through review, due diligence, commercial negotiation and onboarding." },
      { q: "Can small producers supply Sainsbury's?", a: "Yes — Sainsbury's actively ranges challenger brands via Future Brands, and GSCOP protects smaller suppliers on payment terms and de-listing." },
    ],
    sources: [
      { label: "Sainsbury's — Becoming a supplier", href: "https://help.sainsburys.co.uk/help/products/becoming_a_supplier" },
      { label: "J Sainsbury plc — Our partners", href: "https://www.about.sainsburys.co.uk/suppliers" },
    ],
  },
  {
    slug: "asda",
    name: "Asda",
    country: "UK",
    category: "Grocery",
    cardBlurb: "Value-led Big Four grocer — buyers discover new products through RangeMe.",
    topGun: true,
    metaTitle: "How to Become an Asda Supplier: Requirements, Process & Timeline | Spottail",
    metaDescription:
      "How to get stocked in Asda: the RangeMe submission route, Standards for Suppliers, EDI requirements, realistic timelines and costs for new brands.",
    kicker: "UK · Grocery · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "Asda",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become an Asda supplier, create a product profile on **RangeMe** — Asda's buying teams use it to discover and review new products, matching your submission to the right category buyer. You'll need to meet Asda's **Standards for Suppliers**, hold appropriate food safety certification for food lines, and trade via **EDI**. Value is the filter: Asda is the most price-led of the Big Four, so your commercials need to work hard.",
    facts: [
      { n: "1,000+", l: "stores & convenience" },
      { n: "~13%", l: "UK grocery share" },
      { n: "6–12", l: "months to shelf" },
      { n: "#1", l: "on value positioning" },
    ],
    intro:
      "Asda is the most value-focused of the UK's Big Four — which shapes everything about how it buys. Its submission process is unusually structured (RangeMe profile → matched to category buyer → direct response), but the bar it applies is price-led: great products at sharp cost prices win. If your brand's strength is premium positioning, read the Waitrose and Selfridges guides too; if it's value at scale, Asda is a strong target.",
    routesHeading: { pre: "The three routes", em: "into Asda" },
    routes: [
      {
        title: "RangeMe — Asda's official discovery channel",
        body: "Asda's buyers use [RangeMe](https://www.rangeme.com/asda) to review new products. You create a product profile, the platform matches it to the right category buyer, and interested buyers respond directly. Completeness matters: specs, imagery, cost price and sales evidence all in place before you submit.",
      },
      {
        title: "Direct buyer engagement",
        body: "Asda's [corporate supplier pages](https://corporate.asda.com/becoming-a-supplier) set out how it works with suppliers. Category buyer outreach with strong value credentials — cost price, margin, rate of sale — works here more than anywhere, because value is the first filter Asda applies.",
      },
      {
        title: "Prove it in wholesale and independents first",
        body: "Asda buyers, like all multiple-grocer buyers, are risk-averse. Sales history through wholesalers like [Booker](/become-a-supplier/booker) or a few hundred independents turns your pitch from a bet into a forecast.",
      },
    ],
    requirements: [
      { k: "Standards for Suppliers", v: "Asda's published standards apply to anyone supplying products for resale — covering legal compliance, licences, and supply chain risk management." },
      { k: "Food safety certification", v: "GFSI-recognised certification (BRCGS or equivalent) for food and drink suppliers." },
      { k: "EDI capability", v: "All stocked suppliers — including small businesses — trade with Asda via EDI." },
      { k: "Ethical compliance", v: "Supply chain risk identification, modern slavery due diligence, and adherence to applicable laws and agreements." },
      { k: "Product data", v: "GTIN/barcodes, complete specifications, UK-compliant labelling." },
      { k: "Insurance & financials", v: "Product liability insurance and financial standing checks proportionate to supply volume." },
    ],
    note:
      "**Small-supplier note:** Asda is GSCOP-designated, so code protections on payment and de-listing apply. Its value positioning cuts both ways for small brands: harder margins, but genuine appetite for products that help Asda differentiate at a price point.",
    steps: [
      { title: "Build your RangeMe profile", body: "Complete product profile with specs, imagery, certifications, cost pricing and any sales evidence.", time: "Weeks 0–4" },
      { title: "Buyer matching & review", body: "RangeMe routes your submission to the right category buyer; you're notified when reviewed, and interested buyers respond directly.", time: "1–3 months" },
      { title: "Commercial discussion", body: "Cost price and margin structure, volumes, promotional participation and supply terms.", time: "1–3 months" },
      { title: "Compliance & onboarding", body: "Standards for Suppliers sign-up, certification checks, EDI integration and product data setup.", time: "1–3 months" },
      { title: "Launch & measure", body: "Availability and rate of sale determine whether the listing holds and expands.", time: "Ongoing" },
    ],
    costs: [
      { item: "BRCGS certification & audit (food)", range: "£3,000–£8,000 / year" },
      { item: "EDI setup", range: "£5,000–£15,000" },
      { item: "Product liability insurance", range: "£2,000–£5,000 / year" },
      { item: "Product testing & specs", range: "£1,000–£3,000 per product" },
      { item: "Promotional funding", range: "2–5% of sales" },
    ],
    costNote:
      "Asda's margin expectations are the sharpest of the Big Four. Model your cost price against promotional participation before you pitch — a listing that loses money per unit at promo price is not a win.",
    tips: [
      { title: "Lead with the value story.", body: "Asda buyers think price-first. Show the consumer value equation: more for the same, or the same for less." },
      { title: "Have your cost structure bulletproof.", body: "Know your floor, your promo economics, and your margin at three volume tiers before any commercial conversation." },
      { title: "Complete your RangeMe profile fully.", body: "Buyers filter on completeness. Missing specs or imagery quietly kills submissions." },
      { title: "Build proof at wholesale prices first.", body: "If your product sells through Booker at a healthy POR, that's exactly the evidence an Asda buyer needs." },
    ],
    faqs: [
      { q: "How do I submit a product to Asda?", a: "Through RangeMe — Asda's buyers use it for new product discovery. Create a complete product profile and it's matched to the right category buyer." },
      { q: "Do I need EDI to supply Asda?", a: "Yes — all stocked suppliers, including small businesses, trade with Asda electronically." },
      { q: "What certifications do food suppliers need for Asda?", a: "A GFSI-recognised food safety certification such as BRCGS, plus compliance with Asda's Standards for Suppliers." },
      { q: "How long does the Asda listing process take?", a: "Typically 6–12 months from submission to shelf, depending on category review cycles." },
      { q: "Is Asda a good target for premium brands?", a: "Asda is the most value-led of the Big Four. Premium products can list, but the volume lives at sharp price points — premium-first brands often fit better at Waitrose or M&S." },
    ],
    sources: [
      { label: "Asda — Becoming a Supplier", href: "https://corporate.asda.com/becoming-a-supplier" },
      { label: "RangeMe × Asda", href: "https://www.rangeme.com/asda" },
    ],
  },
  {
    slug: "boots",
    name: "Boots",
    country: "UK",
    category: "Health & Beauty",
    cardBlurb: "The UK's leading health & beauty retailer — submissions via RangeMe, CPSR required for cosmetics.",
    topGun: true,
    metaTitle: "How to Become a Boots Supplier: Sell Your Brand to Boots UK | Spottail",
    metaDescription:
      "How to get your brand stocked in Boots: the RangeMe submission route, CPSR and UK Responsible Person requirements, realistic 12–18 month timelines and costs.",
    kicker: "UK · Health & Beauty · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Boots",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become a Boots supplier, submit your brand through **RangeMe** — Boots manages new product submissions there and buyers use it to source new brands. For cosmetics and personal care you'll need a **Cosmetic Product Safety Report (CPSR)** per product and a legally designated **UK Responsible Person**, plus store-ready packaging and a commercial plan. Expect a **12–18 month** lead time from pitch to shelf.",
    facts: [
      { n: "1,800+", l: "UK stores" },
      { n: "#1", l: "UK health & beauty" },
      { n: "12–18", l: "months to shelf" },
      { n: "170+", l: "years on the high street" },
    ],
    intro:
      "Boots is the UK's dominant pharmacy-led health and beauty retailer, and one of the most valuable listings a beauty, wellness or personal care brand can win. It actively looks for emerging brands — buyers have described hunting for \"nuggets\" among independent suppliers — but the compliance bar for cosmetics is real, and the lead times are long. Prepare accordingly.",
    routesHeading: { pre: "The three routes", em: "into Boots" },
    routes: [
      {
        title: "RangeMe — Boots' submission channel",
        body: "Boots manages new product submissions through [RangeMe](https://www.rangeme.com/boots). Build a complete profile: products, imagery, pricing, certifications and your brand story. Buyers source from it when reviewing categories — beauty, wellness, and healthcare especially.",
      },
      {
        title: "Buying team engagement",
        body: "Boots' [supplier pages](https://www.boots-uk.com/suppliers/) set out how it works with goods-for-resale suppliers. A tailored sell-in deck — why your brand, why now, why Boots' customer — matters more here than in grocery, because beauty buying is brand-story-led as much as numbers-led.",
      },
      {
        title: "Prove demand in adjacent retail first",
        body: "Beauty buyers watch what sells at [Superdrug](/become-a-supplier/superdrug), [Holland & Barrett](/become-a-supplier/holland-and-barrett), indie beauty retailers and DTC. Strong rate of sale and repeat-purchase data elsewhere is the strongest card an emerging brand can hold in a Boots pitch.",
      },
    ],
    requirements: [
      { k: "CPSR (cosmetics)", v: "A Cosmetic Product Safety Report for every cosmetic product, prepared by a qualified assessor, before it can legally be sold in the UK." },
      { k: "UK Responsible Person", v: "A legally designated Responsible Person in the UK for cosmetics compliance, with products notified via SCPN." },
      { k: "Labelling & ingredients", v: "Full INCI labelling, ingredient transparency, and claims that are substantiated and compliant." },
      { k: "Store-ready product", v: "Retail-ready packaging that works on a Boots shelf — format, price point and presentation." },
      { k: "Commercials", v: "A wholesale price that supports Boots' margin plus promotional participation (Boots is heavily promotion-driven), with a manageable MOQ." },
      { k: "Logistics & duty", v: "Clear duty/VAT strategy and INCOTERMS if manufacturing abroad; reliable fulfilment at chain volume." },
      { k: "Insurance & EDI", v: "Product liability insurance, and EDI trading capability for stocked suppliers." },
    ],
    note:
      "**Compliance first:** for cosmetics, CPSR + Responsible Person + SCPN notification are legal requirements, not Boots preferences. Budget for them per product before you pitch — a buyer can't progress a non-compliant product no matter how much they like it.",
    steps: [
      { title: "Get compliant", body: "CPSRs completed, Responsible Person designated, products notified, labelling checked.", time: "1–3 months" },
      { title: "Submit on RangeMe", body: "Complete brand and product profile, with a tailored Boots sell-in deck ready for follow-up.", time: "Weeks 0–4" },
      { title: "Buyer review & pitch", body: "Category buyer assesses brand fit, differentiation and commercials; successful submissions progress to a pitch and range discussion.", time: "2–6 months" },
      { title: "Commercial negotiation", body: "Margin, promotional plan (Boots runs deep promotional cycles), launch stores and volumes.", time: "1–3 months" },
      { title: "Onboarding & launch", body: "EDI setup, product data, planogram placement — often a limited-store or online-first launch.", time: "2–4 months" },
      { title: "Prove velocity", body: "Sell-through in the launch estate decides expansion to the full chain.", time: "Ongoing" },
    ],
    costs: [
      { item: "CPSR per product", range: "£300–£1,500" },
      { item: "Responsible Person service", range: "£500–£2,000 / year" },
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "EDI setup", range: "£5,000–£15,000" },
      { item: "Retail-ready packaging", range: "£5,000–£30,000" },
      { item: "Promotional funding", range: "3–8% of sales" },
    ],
    costNote:
      "Boots trades on promotion heavily — model your economics at promotional price points, not RRP. Brands that only work at full price struggle to survive Boots' promotional calendar.",
    tips: [
      { title: "Nail the brand story.", body: "Beauty buying is story-led. Who is this for, what does it do differently, and why will Boots' customer pick it up?" },
      { title: "Show repeat purchase, not just trial.", body: "DTC repeat rates and subscriptions are powerful evidence — beauty margins are made on the second purchase." },
      { title: "Be promo-ready.", body: "Have a 12-month promotional plan costed before negotiation. Boots will ask." },
      { title: "Start online or limited-store.", body: "Boots.com or a small-store trial is a common first step — treat it as your proving ground, not a consolation." },
    ],
    faqs: [
      { q: "How do I submit my brand to Boots?", a: "Through RangeMe — Boots manages new product submissions there and buyers use it to source new brands across beauty, wellness and healthcare." },
      { q: "What is a CPSR and do I need one?", a: "A Cosmetic Product Safety Report — a legal requirement for every cosmetic product sold in the UK, prepared by a qualified safety assessor. Boots cannot stock cosmetics without it." },
      { q: "How long does it take to get into Boots?", a: "Plan for 12–18 months from initial pitch to shelf, including compliance, buyer review, commercial negotiation and onboarding." },
      { q: "Does Boots take emerging brands?", a: "Yes — Boots actively looks for distinctive independent brands, particularly in beauty and wellness. Strong sell-through evidence from other channels dramatically improves your odds." },
      { q: "What margins does Boots expect?", a: "Health and beauty retail margins are substantial and Boots is promotion-heavy — model your wholesale price to survive both retailer margin and regular promotional participation." },
    ],
    sources: [
      { label: "Boots UK — Suppliers", href: "https://www.boots-uk.com/suppliers/" },
      { label: "RangeMe × Boots", href: "https://www.rangeme.com/boots" },
    ],
  },
  {
    slug: "m-and-s",
    name: "M&S",
    country: "UK",
    category: "Grocery & GM",
    cardBlurb: "Premium own-brand-led retailer — most supply routes run through own-label manufacturing.",
    topGun: true,
    metaTitle: "How to Become an M&S Supplier (Marks & Spencer): Requirements & Process | Spottail",
    metaDescription:
      "How to supply Marks & Spencer: the supplier registration route, why own-brand manufacturing is the main door, M&S's standards, timelines and costs.",
    kicker: "UK · Grocery & General Merchandise · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "M&S",
    h1Post: "supplier",
    readTime: "10 min read",
    quickAnswer:
      "To become an M&S supplier, register through **M&S's supplier interest process** — but understand the structural difference first: M&S Food is overwhelmingly **own-brand**, so most food suppliers are manufacturers producing to M&S specifications rather than branded listings. You'll need exceptional technical standards (M&S runs some of the most stringent supplier requirements in UK retail), **EDI** (TRADACOMS standard), and robust quality verification systems. Branded opportunities exist but are selective.",
    facts: [
      { n: "1,000+", l: "UK stores" },
      { n: "~97%", l: "of food is own-brand" },
      { n: "30m+", l: "customers" },
      { n: "6–18", l: "months to supply" },
    ],
    intro:
      "M&S is unlike every other retailer in this list: its food business is almost entirely own-brand, and its clothing and home ranges are own-label too. That changes what \"becoming a supplier\" means — for most brands the route is manufacturing to M&S's specification, not getting your brand on shelf. It's a different business model with different economics: guaranteed volumes and no brand-building cost, in exchange for margin and anonymity. A selective number of branded products do get ranged, especially in food halls and beauty.",
    routesHeading: { pre: "The three routes", em: "into M&S" },
    routes: [
      {
        title: "Own-brand manufacturing — the main door",
        body: "M&S develops products with trusted manufacturing partners to its own exacting specifications. If you have genuine manufacturing capability and technical depth, register interest through M&S's supplier process — the commercial team routes submissions to the relevant buying department. Expect the most demanding technical standards in UK retail.",
      },
      {
        title: "Branded listings — selective",
        body: "M&S ranges a limited set of third-party brands — most visibly in beauty, wine and food hall guest brands. The bar is distinctiveness: something M&S's own development team can't easily replicate, with a premium story that fits the M&S customer.",
      },
      {
        title: "Supplier registration & innovation",
        body: "M&S's [supplier innovation](https://corporate.marksandspencer.com/innovating-suppliers) programme works with suppliers on new products, packaging and processes. The supplier onboarding contact (centralisedops.supplieronboarding@marks-and-spencer.com) is the formal entry point once a buying team is engaged.",
      },
    ],
    requirements: [
      { k: "Technical standards", v: "M&S's supplier standards are among the most stringent in UK retail — regular audits, robust line verification systems for food, and comprehensive quality management." },
      { k: "Food safety", v: "GFSI-recognised certification (BRCGS or equivalent) plus M&S's own technical requirements and continual verification." },
      { k: "EDI (TRADACOMS)", v: "M&S trades via EDI using the TRADACOMS standard over a VAN — suppliers must connect regardless of size." },
      { k: "Ethical & sustainability", v: "Compliance with M&S's Supply Chain and Responsible Sourcing policy, human rights due diligence, and Plan A sustainability commitments." },
      { k: "Capacity & consistency", v: "Own-brand manufacturing means M&S's reputation rides on your output — consistency and capacity are non-negotiable." },
      { k: "Insurance & financials", v: "Product liability insurance and financial due diligence appropriate to contract volume." },
    ],
    note:
      "**Strategic note:** own-brand manufacturing for M&S is a different business than building your brand. Volumes are large and committed, but the margin is a manufacturer's margin and the brand equity accrues to M&S. Many founders run both models — own-label to fund the factory, branded elsewhere to build the name.",
    steps: [
      { title: "Register interest", body: "Express interest via M&S's supplier form; the commercial team routes it to the relevant buying department.", time: "Weeks 0–8" },
      { title: "Buying team engagement", body: "Product and capability assessment — for own-brand, this is about your manufacturing depth as much as the product.", time: "1–3 months" },
      { title: "Technical audit", body: "Site audits against M&S's technical standards — the most demanding step, and where preparation pays.", time: "2–4 months" },
      { title: "Development & specification", body: "For own-brand: joint product development to M&S spec, packaging and labelling sign-off.", time: "2–6 months" },
      { title: "EDI & onboarding", body: "TRADACOMS EDI connection, product data, and supply chain integration.", time: "1–2 months" },
      { title: "Launch & continual verification", body: "M&S monitors quality continuously — line verification and audit performance decide the relationship's future.", time: "Ongoing" },
    ],
    costs: [
      { item: "BRCGS certification & audit", range: "£3,000–£8,000 / year" },
      { item: "Technical systems & verification", range: "£5,000–£25,000" },
      { item: "EDI (TRADACOMS) setup", range: "£5,000–£15,000" },
      { item: "Product liability insurance", range: "£2,000–£5,000 / year" },
      { item: "Development & sampling", range: "£2,000–£10,000 per product" },
    ],
    costNote:
      "Own-brand contracts remove brand-building costs but demand investment in technical infrastructure. Price your manufacturing margin to fund the compliance overhead M&S requires.",
    tips: [
      { title: "Decide which business you're pitching.", body: "Own-brand manufacturer or branded guest product — the pitch, economics and buyer are completely different. Don't blur them." },
      { title: "Lead with technical credibility.", body: "For own-brand, your audit history, certifications and quality systems are the pitch. Product samples come second." },
      { title: "For branded: be unreplicable.", body: "M&S's development team is excellent. If they can make your product as own-brand, they will — pitch what they can't copy: provenance, IP, brand heat." },
      { title: "Use the guest-brand door.", body: "Food hall guest brands and beauty are where M&S visibly ranges third-party products — study what's there and why." },
    ],
    faqs: [
      { q: "Can I get my brand stocked in M&S?", a: "Selectively — M&S is overwhelmingly own-brand (around 97% of food), but ranges guest brands in food halls, beauty and wine. The main supply route is manufacturing to M&S's own specification." },
      { q: "How do I register as an M&S supplier?", a: "Express interest through M&S's supplier form; their commercial team routes submissions to the relevant buying department. Supplier onboarding runs through M&S's centralised operations team." },
      { q: "What standards does M&S require?", a: "Among the most stringent in UK retail: GFSI food certification plus M&S's own technical standards, robust line verification, regular audits, and TRADACOMS EDI." },
      { q: "Is own-brand manufacturing for M&S worth it?", a: "It's a manufacturer's business: committed volumes and no marketing cost, at manufacturer margins with M&S owning the brand. Many companies run own-label for M&S alongside building their own brand elsewhere." },
      { q: "How long does it take to supply M&S?", a: "6–18 months depending on route — own-brand development with technical audits sits at the longer end." },
    ],
    sources: [
      { label: "M&S — Innovating with suppliers", href: "https://corporate.marksandspencer.com/innovating-suppliers" },
      { label: "M&S — Responsible Sourcing", href: "https://corporate.marksandspencer.com/sites/marksandspencer/files/marks-spencer/corperate-governance/Supply%20Chain%20and%20Responsible%20Sourcing.pdf" },
    ],
  },
  {
    slug: "waitrose",
    name: "Waitrose",
    country: "UK",
    category: "Grocery",
    cardBlurb: "Premium grocer with a Small Producers' Charter and genuine local sourcing routes.",
    topGun: false,
    metaTitle: "How to Become a Waitrose Supplier: Small Producer Requirements & Process | Spottail",
    metaDescription:
      "How to supply Waitrose: the Small Producers' Charter, local and regional supplier routes (within 30 miles), HACCP requirements, timelines and costs.",
    kicker: "UK · Grocery · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Waitrose",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Waitrose supplier, apply through **Waitrose's regional supplier programme** — small producers are assessed against the **Small Producers' Charter**, with \"local\" defined as within **30 miles of a store**. You'll need a documented **HACCP** food safety system, quality ingredients with provenance, and appropriate packaging. Waitrose is one of the most genuinely small-producer-friendly multiples, with certification requirements set proportionately by category.",
    facts: [
      { n: "330+", l: "shops" },
      { n: "30mi", l: "local supplier radius" },
      { n: "10–250", l: "employee range welcomed" },
      { n: "#1", l: "premium grocery positioning" },
    ],
    intro:
      "Waitrose occupies the premium end of UK grocery and has built a genuine reputation for championing small and regional producers — its Small Producers' Charter and local sourcing programme are real routes, not PR. If your product is quality-led with provenance, Waitrose is likely the most receptive of the major supermarkets. The trade-off: their quality expectations start high and stay there.",
    routesHeading: { pre: "The three routes", em: "into Waitrose" },
    routes: [
      {
        title: "Local & regional supplier programme",
        body: "Waitrose actively recruits [small and regional suppliers](https://www.waitrose.com/ecom/content/about-us/regional-suppliers) — local means within 30 miles of a store, regional covers a wider area. Requirements are proportionate: bespoke to each category, with minimum third-party certification varying by risk. Start here if you're a genuine local producer.",
      },
      {
        title: "National listings via buying teams",
        body: "For brands beyond local scale, the standard route applies: category buyer engagement with a premium-fit story. Waitrose buyers look for quality ingredients, high preparation standards and innovation that complements the existing range — visual appeal and packaging matter more here than anywhere in grocery.",
      },
      {
        title: "RangeMe",
        body: "Waitrose also discovers products via [RangeMe](https://www.rangeme.com/waitrose) — a complete profile there covers the passive discovery route while you work the direct ones.",
      },
    ],
    requirements: [
      { k: "HACCP", v: "A comprehensive, documented HACCP food safety system, implemented and continually reviewed — the foundation requirement for all food suppliers." },
      { k: "Certification (proportionate)", v: "Minimum third-party certification differs by category and risk level — Waitrose sets requirements bespoke to each category rather than one-size-fits-all." },
      { k: "Provenance & quality", v: "Simple, recognisable ingredients, sourced locally where possible, with high preparation standards — the Waitrose customer buys the story and the quality." },
      { k: "Packaging", v: "Visual appeal and appropriate packaging — premium shelf presence is part of the assessment." },
      { k: "Local eligibility", v: "For the local route: based within 30 miles of a Waitrose shop, typically 10–250 employees." },
      { k: "EDI capability", v: "Stocked suppliers trade electronically — Waitrose increasingly expects all transactions via EDI." },
    ],
    note:
      "**Small-producer note:** Waitrose's Small Producers' Charter formalises fair treatment for small suppliers, and the local/regional programme places products in nearby shops rather than demanding national capacity on day one. It's the gentlest on-ramp among the multiples.",
    steps: [
      { title: "Choose your route", body: "Local (within 30 miles), regional, or national — the requirements and buying contacts differ.", time: "Week 0" },
      { title: "Apply with full documentation", body: "Product details, HACCP documentation, certifications, provenance story and packaging samples.", time: "Weeks 0–8" },
      { title: "Buyer & technical review", body: "Category-bespoke assessment of quality, safety, fit and commercials.", time: "1–3 months" },
      { title: "Commercial agreement", body: "Pricing, volumes (local listings start with nearby shops), and supply arrangements.", time: "1–2 months" },
      { title: "Onboarding & launch", body: "EDI setup, product data, and launch — local products typically start in their home shops.", time: "1–2 months" },
      { title: "Grow the estate", body: "Strong sell-through in local shops is the case for regional and national expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "HACCP development & certification", range: "£1,000–£5,000" },
      { item: "Third-party certification (category-dependent)", range: "£2,000–£8,000 / year" },
      { item: "Product liability insurance", range: "£1,500–£4,000 / year" },
      { item: "EDI setup", range: "£3,000–£10,000" },
      { item: "Premium packaging", range: "£5,000–£25,000" },
    ],
    costNote:
      "Waitrose's proportionate certification approach keeps entry costs lower for small producers than the Big Four — but premium packaging is not optional here. Budget for shelf presence.",
    tips: [
      { title: "Lead with provenance.", body: "Where it's made, who makes it, and why that matters — the Waitrose customer pays for the story behind the product." },
      { title: "Start local, genuinely.", body: "The 30-mile local route is the easiest listing in UK multiple grocery. Nail your home shops before pitching wider." },
      { title: "Invest in packaging before pitching.", body: "Waitrose explicitly assesses visual appeal. A great product in weak packaging fails here." },
      { title: "Match the range gaps.", body: "Innovative products that complement — not duplicate — the existing offer are what buyers ask for." },
    ],
    faqs: [
      { q: "How do I become a local Waitrose supplier?", a: "Apply through Waitrose's regional supplier programme — local suppliers are within 30 miles of a store, assessed against the Small Producers' Charter with category-proportionate certification requirements." },
      { q: "What food safety standards does Waitrose require?", a: "A documented, implemented HACCP system as the foundation, plus third-party certification set proportionately by category and risk." },
      { q: "Is Waitrose good for small producers?", a: "Yes — arguably the most receptive UK multiple. The Small Producers' Charter, 30-mile local route and proportionate requirements are designed for businesses from 10 employees up." },
      { q: "How long does a Waitrose listing take?", a: "Local listings can move in 3–6 months; national listings run 6–12+ months like other multiples." },
      { q: "Does Waitrose use RangeMe?", a: "Yes — Waitrose discovers products on RangeMe alongside its direct application routes." },
    ],
    sources: [
      { label: "Waitrose — Small & Regional Suppliers", href: "https://www.waitrose.com/ecom/content/about-us/regional-suppliers" },
      { label: "RangeMe × Waitrose", href: "https://www.rangeme.com/waitrose" },
    ],
  },
  {
    slug: "co-op",
    name: "Co-op",
    country: "UK",
    category: "Convenience",
    cardBlurb: "Community convenience chain whose Apiary programme incubates small, purpose-driven brands.",
    topGun: false,
    metaTitle: "How to Become a Co-op Supplier: The Apiary Programme & Local Routes | Spottail",
    metaDescription:
      "How to get stocked in Co-op: the Apiary incubator and accelerator for small suppliers, local sourcing routes, values requirements, timelines and costs.",
    kicker: "UK · Convenience · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Co-op",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Co-op supplier, apply to **The Apiary** — Co-op's incubator and accelerator programme that takes small, purpose-driven brands from \"promising\" to \"retail ready\", with successful products stocked in **100+ Co-op stores**. Co-op looks for a **unique point of difference and shared co-operative values**: social purpose counts here in a way it doesn't elsewhere. Standard supplier routes and local sourcing also apply for established brands.",
    facts: [
      { n: "2,400", l: "food stores" },
      { n: "100+", l: "stores for Apiary launches" },
      { n: "4+", l: "Apiary waves so far" },
      { n: "#1", l: "UK convenience co-operative" },
    ],
    intro:
      "Co-op is the UK's biggest co-operative retailer, built around community stores and community values — and unusually, that identity shapes its buying. The Apiary programme exists specifically to find small, early-stage, purpose-driven suppliers and make them retail-ready with mentoring, masterclasses and a peer network, then put them on shelves. If your brand has genuine social purpose and a point of difference, Co-op may be your most natural first multiple.",
    routesHeading: { pre: "The three routes", em: "into Co-op" },
    routes: [
      {
        title: "The Apiary — incubator & accelerator",
        body: "Co-op's Apiary programme runs in waves, selecting small suppliers with **a unique point of difference and co-operative values** — purpose-driven brands creating social value. Selected suppliers get tailored mentoring, expert masterclasses and a supplier peer network, with products featured in 100+ Co-op stores. Watch for wave application windows announced through Co-op and trade press.",
      },
      {
        title: "Standard supplier routes",
        body: "Established brands pitch Co-op's category buying teams directly, as with any multiple. Co-op's convenience format matters: smaller stores, tighter ranges, faster decisions — products need to earn their space at convenience price points and pack sizes.",
      },
      {
        title: "Local sourcing",
        body: "Co-op's community-store model gives local products genuine traction — stores stock locally relevant products, and community identity is part of the offer. If you're a local producer, lead with the community story.",
      },
    ],
    requirements: [
      { k: "Point of difference", v: "Apiary explicitly selects for uniqueness — a product, story or audience the current range doesn't cover." },
      { k: "Values alignment", v: "Purpose-driven business creating social value, aligned with co-operative values — this is assessed, not assumed." },
      { k: "Food safety", v: "Appropriate certification for your category (HACCP as foundation; GFSI-recognised certification for scaled supply)." },
      { k: "Convenience-format fit", v: "Pack sizes, price points and shelf presence that work in a convenience store, not just a supermarket." },
      { k: "Capacity to scale", v: "Ability to supply 100+ stores reliably if selected — Apiary makes you retail-ready, but production is yours." },
      { k: "EDI & data", v: "Electronic trading and complete product data for stocked suppliers." },
    ],
    note:
      "**Values are the filter:** Co-op turns down technically strong brands that don't demonstrate social purpose. If your brand has genuine community impact, B-Corp status, or a mission woven into the business — lead with it. If it doesn't, pitch elsewhere first.",
    steps: [
      { title: "Watch for an Apiary wave", body: "Applications open in waves — follow Co-op's channels and trade press for the next window.", time: "Varies" },
      { title: "Apply with story + product", body: "Point of difference, social value, co-operative alignment, and product fundamentals.", time: "Weeks 0–4" },
      { title: "Selection & programme", body: "Selected suppliers get mentoring, masterclasses and retail-readiness support from Co-op's teams.", time: "3–6 months" },
      { title: "Range & commercial setup", body: "Product, pricing and supply agreed for the launch estate.", time: "1–2 months" },
      { title: "Launch in 100+ stores", body: "Apiary products land in community stores — with the programme's support behind them.", time: "Launch" },
      { title: "Prove & expand", body: "Sell-through builds the case for wider Co-op ranging and other retailers.", time: "Ongoing" },
    ],
    costs: [
      { item: "Food safety certification", range: "£1,000–£6,000 / year" },
      { item: "Product liability insurance", range: "£1,500–£4,000 / year" },
      { item: "EDI setup", range: "£3,000–£10,000" },
      { item: "Convenience-format packaging", range: "£3,000–£15,000" },
      { item: "Apiary programme", range: "Support provided — production costs yours" },
    ],
    costNote:
      "The Apiary provides mentoring and support rather than charging — your investment is production capacity and time. Convenience retail moves fast; be ready to supply before you apply.",
    tips: [
      { title: "Make the social value concrete.", body: "\"Purpose-driven\" means measurable: jobs created, causes funded, communities served. Numbers beat sentiment." },
      { title: "Design for convenience.", body: "Grab-and-go formats, convenience price points, small-shelf presence. A supermarket SKU often doesn't translate." },
      { title: "Use the peer network.", body: "Past Apiary suppliers are accessible and generous — learn the programme from people who've done it." },
      { title: "Have capacity ready.", body: "100+ stores from launch is real volume for a small producer. Line up production before selection, not after." },
    ],
    faqs: [
      { q: "What is Co-op's Apiary programme?", a: "Co-op's incubator and accelerator for small, purpose-driven suppliers — providing mentoring, masterclasses and a peer network, with successful products stocked in 100+ Co-op stores. It runs in application waves." },
      { q: "Who qualifies for the Apiary?", a: "Smaller or early-stage businesses with a unique point of difference that share co-operative values — unique, purpose-driven brands that create social value." },
      { q: "Can established brands supply Co-op?", a: "Yes — standard category buyer routes apply. Convenience-format fit (pack size, price point) is the key commercial filter." },
      { q: "How many stores would my product launch in?", a: "Apiary products are featured in over 100 Co-op locations; standard listings vary by category and region." },
      { q: "Does local sourcing exist at Co-op?", a: "Yes — Co-op's community-store model gives locally relevant products genuine traction in their home areas." },
    ],
    sources: [
      { label: "The Grocer — Co-op Apiary programme", href: "https://www.thegrocer.co.uk/news/co-op-launches-search-for-suppliers-to-join-apiary-scheme-and-secure-listing/714898.article" },
      { label: "Retail Insight — Apiary suppliers", href: "https://www.retail-insight-network.com/news/new-suppliers-join-co-ops-apiary-programme/" },
    ],
  },
  {
    slug: "john-lewis",
    name: "John Lewis",
    country: "UK",
    category: "Department",
    cardBlurb: "Premium department store — Partnership Supplier Portal plus a curated marketplace route.",
    topGun: false,
    metaTitle: "How to Become a John Lewis Supplier: Portal, Marketplace & Requirements | Spottail",
    metaDescription:
      "How to sell to John Lewis: the Partnership Supplier Portal, the curated marketplace route, values and sustainability requirements, timelines and costs.",
    kicker: "UK · Department Store · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "John Lewis",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a John Lewis supplier, register through the **John Lewis Partnership Supplier Portal** (jlpsuppliers.com) — submit your business details, products and documentation, and the relevant buying team reviews fit. A second route exists: John Lewis's **curated marketplace**, which lets premium brands sell on johnlewis.com under a lighter model. Expect requirements on **quality, sustainability, values fit and EDI**, and production capacity for department-store volume.",
    facts: [
      { n: "34", l: "shops + johnlewis.com" },
      { n: "2", l: "routes: wholesale & marketplace" },
      { n: "100%", l: "employee-owned partnership" },
      { n: "Premium", l: "positioning throughout" },
    ],
    intro:
      "John Lewis is the UK's benchmark premium department store — home, fashion, tech and lifestyle — and an employee-owned partnership whose values genuinely shape its buying. There are two distinct doors: traditional wholesale supply into shops and johnlewis.com, and the curated online marketplace that lets premium brands list with lighter logistics. Choose deliberately; the economics differ.",
    routesHeading: { pre: "The three routes", em: "into John Lewis" },
    routes: [
      {
        title: "Partnership Supplier Portal — the formal door",
        body: "The [JLP Supplier Portal](https://www.jlpsuppliers.com/) is the registration route for wholesale supply: business details, product submissions and documentation, reviewed by the relevant buying office. Wholesale means John Lewis buys your stock — bigger commitment, bigger volumes.",
      },
      {
        title: "The curated marketplace",
        body: "John Lewis runs a **curated marketplace** on johnlewis.com — premium brands sell under John Lewis's banner while handling their own fulfilment. Lighter entry, faster launch, and a proving ground: marketplace performance data is exactly what a buyer needs to justify a wholesale range later.",
      },
      {
        title: "Buyer pitching",
        body: "Buying office outreach still matters, especially for distinctive premium products. John Lewis buyers look for exciting, well-made, responsibly sourced products from stable businesses sharing Partnership values — pitch all four, with evidence.",
      },
    ],
    requirements: [
      { k: "Product quality & values", v: "Well-made, inspiring products, sustainably and responsibly sourced, from businesses whose values align with the Partnership's." },
      { k: "Sustainability", v: "Strict criteria on sourcing, materials and packaging — sustainability commitments are assessed, not assumed." },
      { k: "Production capacity", v: "Ability to handle department-store volumes and scale without quality slipping — supply reliability is heavily weighted." },
      { k: "EDI capability", v: "JLP requires electronic trading for wholesale suppliers." },
      { k: "Marketplace operations", v: "For the marketplace route: your own fulfilment meeting John Lewis service standards, returns handling, and product data quality." },
      { k: "Insurance & financials", v: "Product liability insurance and financial stability checks." },
    ],
    note:
      "**Route note:** the marketplace is the smart first door for most emerging premium brands — you keep inventory control, prove demand with John Lewis's customer, and build the sales case for a wholesale listing. Wholesale is the prize; marketplace is the audition.",
    steps: [
      { title: "Pick your route", body: "Wholesale (JLP buys stock) or marketplace (you fulfil) — economics and requirements differ.", time: "Week 0" },
      { title: "Register on the portal", body: "Business details, product range, documentation and certifications through jlpsuppliers.com or the marketplace application.", time: "Weeks 0–4" },
      { title: "Buying review", body: "Category team assesses quality, values fit, sustainability and commercial potential.", time: "1–3 months" },
      { title: "Terms & compliance", body: "Commercial terms, sustainability verification, EDI or marketplace operational setup.", time: "1–2 months" },
      { title: "Launch", body: "Marketplace listings go live faster; wholesale ranges land with seasonal buying cycles.", time: "1–3 months" },
      { title: "Prove & convert", body: "Marketplace sell-through builds the case for wholesale; wholesale performance drives range growth.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "EDI setup (wholesale)", range: "£5,000–£15,000" },
      { item: "Marketplace commission", range: "Category-dependent % of sales" },
      { item: "Premium packaging & content", range: "£5,000–£25,000" },
      { item: "Sustainability documentation", range: "£1,000–£5,000" },
    ],
    costNote:
      "Marketplace economics are commission-based with fulfilment costs yours; wholesale carries EDI and volume commitments but John Lewis owns the inventory risk. Model both before choosing.",
    tips: [
      { title: "Audition on the marketplace.", body: "Marketplace sales data with John Lewis's own customer is the strongest wholesale pitch that exists." },
      { title: "Make sustainability substantive.", body: "Materials, certifications, packaging — John Lewis assesses this seriously. Vague claims read as red flags." },
      { title: "Pitch the values fit.", body: "An employee-owned partnership cares who it trades with. Stable, honest, capable — show all three." },
      { title: "Plan for seasonal cycles.", body: "Department store buying runs seasonally. Miss a window and you wait six months — ask buyers about timing early." },
    ],
    faqs: [
      { q: "How do I register as a John Lewis supplier?", a: "Through the John Lewis Partnership Supplier Portal (jlpsuppliers.com) — register your business, submit product details and documentation for buying team review." },
      { q: "What is the John Lewis marketplace?", a: "A curated section of johnlewis.com where approved premium brands sell with their own fulfilment — a lighter entry route than wholesale, and a proving ground for it." },
      { q: "What does John Lewis look for in suppliers?", a: "Exciting, well-made, sustainably sourced products; stable, honest businesses sharing Partnership values; and production capacity to supply reliably at volume." },
      { q: "Marketplace or wholesale — which should I choose?", a: "Most emerging brands should start on the marketplace: faster entry, inventory control, and performance data that makes the wholesale case for you." },
      { q: "Does John Lewis require EDI?", a: "Yes for wholesale suppliers; marketplace sellers integrate through the marketplace platform instead." },
    ],
    sources: [
      { label: "JLP Supplier Portal", href: "https://www.jlpsuppliers.com/" },
      { label: "John Lewis × Mirakl — curated marketplace", href: "https://www.mirakl.com/news/john-lewis-accelerates-ambition-to-be-the-home-of-premium-brands-with-launch-of-curated-supplier-model" },
    ],
  },
  {
    slug: "superdrug",
    name: "Superdrug",
    country: "UK",
    category: "Beauty",
    cardBlurb: "Accessible beauty chain — Marketplace entry route plus the Beauty Playground launchpad.",
    topGun: false,
    metaTitle: "How to Become a Superdrug Supplier: Marketplace & Beauty Playground | Spottail",
    metaDescription:
      "How to get your beauty brand into Superdrug: the Marketplace seller route, the Beauty Playground test-and-learn launchpad, CPSR compliance, timelines and costs.",
    kicker: "UK · Beauty · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Superdrug",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Superdrug supplier, start with **Superdrug Marketplace** — contact marketplace@uk.aswatson.com with your brand details to apply as a verified seller — or aim for **Beauty Playground**, Superdrug's test-and-learn launchpad that gives emerging beauty brands store presence and support to scale. Cosmetics require a **CPSR per product and a UK Responsible Person**. Superdrug's positioning is accessible beauty: sharp price points, trend-led, cruelty-free credentials valued.",
    facts: [
      { n: "780+", l: "UK & Ireland stores" },
      { n: "2", l: "routes: Marketplace & core range" },
      { n: "#2", l: "UK health & beauty" },
      { n: "Trend-led", l: "accessible price points" },
    ],
    intro:
      "Superdrug is the UK's accessible-beauty counterweight to Boots: younger customer, sharper price points, faster trend cycles — and unusually open doors for emerging brands. Its Marketplace gives brands an online entry route, while Beauty Playground has become a genuine launchpad, working with new brands on a test-and-learn basis to build awareness and scale the ones that perform.",
    routesHeading: { pre: "The three routes", em: "into Superdrug" },
    routes: [
      {
        title: "Superdrug Marketplace — the open door",
        body: "Superdrug [Marketplace](https://www.superdrug.com/marketplace/sellers) expands superdrug.com with verified third-party sellers — the team actively recruits new sellers at marketplace@uk.aswatson.com. You fulfil orders yourself under Superdrug's service standards. It's the fastest way to get your brand in front of Superdrug's customer and generate the data that earns a core-range conversation.",
      },
      {
        title: "Beauty Playground — the launchpad",
        body: "Superdrug's **Beauty Playground** showcases emerging brands in stores on a test-and-learn model — Superdrug works closely with suppliers to build awareness, respond to customer demand, and scale the brands that perform. Selection is buyer-led: trend fit, differentiation and social heat all count.",
      },
      {
        title: "Core range listings",
        body: "Established brands pitch category buyers for permanent range space. Superdrug's filters: accessible price points, trend relevance, cruelty-free credentials, and the promotional economics to survive a heavily promotion-driven retailer.",
      },
    ],
    requirements: [
      { k: "CPSR (cosmetics)", v: "A Cosmetic Product Safety Report per product and SCPN notification — legal requirements for UK cosmetics." },
      { k: "UK Responsible Person", v: "Legally designated UK Responsible Person for cosmetics compliance." },
      { k: "Cruelty-free positioning", v: "Superdrug is strongly associated with cruelty-free beauty — credentials here are valued and often expected." },
      { k: "Accessible pricing", v: "Price points that fit Superdrug's younger, value-conscious customer, with room for regular promotion." },
      { k: "Marketplace operations", v: "For Marketplace: your own fulfilment at Superdrug's trusted service levels, returns handling and complete product data." },
      { k: "Insurance", v: "Product liability insurance appropriate to chain retail." },
    ],
    note:
      "**Sequencing note:** Marketplace → Beauty Playground → core range is a genuine ladder. Marketplace sales data gets buyer attention; Playground performance justifies permanent range space. Each rung de-risks the next.",
    steps: [
      { title: "Get compliant", body: "CPSRs, Responsible Person, SCPN notifications and labelling for every product.", time: "1–3 months" },
      { title: "Apply to Marketplace", body: "Contact the marketplace team with brand intro, or pitch buyers for Playground/core consideration.", time: "Weeks 0–4" },
      { title: "Onboard & launch online", body: "Marketplace setup: product data, fulfilment standards, go-live.", time: "1–2 months" },
      { title: "Build performance data", body: "Sales velocity, reviews and repeat purchase on Marketplace — your evidence base.", time: "3–6 months" },
      { title: "Pitch for store presence", body: "Beauty Playground or core range, armed with your Superdrug-customer data.", time: "2–6 months" },
      { title: "Scale what works", body: "Test-and-learn means performance decides expansion — watch your numbers weekly.", time: "Ongoing" },
    ],
    costs: [
      { item: "CPSR per product", range: "£300–£1,500" },
      { item: "Responsible Person service", range: "£500–£2,000 / year" },
      { item: "Product liability insurance", range: "£1,500–£4,000 / year" },
      { item: "Marketplace commission & fulfilment", range: "% of sales + your logistics" },
      { item: "Promotional funding (core range)", range: "3–8% of sales" },
    ],
    costNote:
      "Superdrug trades hard on promotion — like Boots, model your unit economics at promotional prices. Marketplace first keeps your entry cost low while you learn what the Superdrug customer actually buys.",
    tips: [
      { title: "Ride the trend cycle.", body: "Superdrug's customer is trend-led and social-first. TikTok heat and UGC momentum are pitch assets here — bring the numbers." },
      { title: "Get cruelty-free certified.", body: "It's core to Superdrug's beauty identity. Leaping Bunny or equivalent certification strengthens every conversation." },
      { title: "Use Marketplace as your lab.", body: "Test SKUs, price points and bundles online before committing packaging runs to store formats." },
      { title: "Design for the promo calendar.", body: "Star Buys and constant promotion are the trading rhythm — economics that only work at RRP won't survive." },
    ],
    faqs: [
      { q: "How do I sell on Superdrug Marketplace?", a: "Contact marketplace@uk.aswatson.com with your contact name, company, brand and a brief introduction. Verified sellers list on superdrug.com and fulfil orders to Superdrug's service standards." },
      { q: "What is Beauty Playground?", a: "Superdrug's launchpad for emerging beauty brands — a test-and-learn programme giving new brands store presence, with Superdrug supporting the ones that perform to scale." },
      { q: "What compliance do cosmetics need?", a: "A CPSR per product, a UK Responsible Person, SCPN notification and compliant INCI labelling — legal requirements before any UK retailer can stock you." },
      { q: "Is Superdrug easier to get into than Boots?", a: "The Marketplace route makes initial entry meaningfully easier, and Beauty Playground gives emerging brands a store route Boots doesn't directly replicate. Core-range competition is still real." },
      { q: "What price points work at Superdrug?", a: "Accessible beauty — typically below prestige pricing, with room for regular promotional discounting." },
    ],
    sources: [
      { label: "Superdrug Marketplace — Become a seller", href: "https://www.superdrug.com/marketplace/sellers" },
      { label: "TheIndustry.beauty — Superdrug", href: "https://theindustry.beauty/the_directory/superdrug/" },
    ],
  },
  {
    slug: "holland-and-barrett",
    name: "Holland & Barrett",
    country: "UK",
    category: "Health & Wellness",
    cardBlurb: "Health & wellness leader — submissions via Product Guru, plus a marketplace route for new brands.",
    topGun: false,
    metaTitle: "How to Become a Holland & Barrett Supplier: Product Guru & Marketplace | Spottail",
    metaDescription:
      "How to get stocked in Holland & Barrett: Product Guru submissions, Approved Supplier vs Marketplace Trusted Seller routes, compliance requirements, timelines and costs.",
    kicker: "UK · Health & Wellness · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Holland & Barrett",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Holland & Barrett supplier, submit your products through **Product Guru** — H&B's partner platform for new product submissions, free to join — or apply to the **H&B Marketplace** as a Trusted Seller (contact Marketplace@hollandandbarrett.com). Two routes exist: traditional **Approved Supplier** status in the H&B supplier network, and the lighter **Marketplace** model. Wellness compliance is the bar: substantiated claims, compliant novel foods and supplements documentation.",
    facts: [
      { n: "800+", l: "stores" },
      { n: "2", l: "routes: Approved & Marketplace" },
      { n: "#1", l: "UK health & wellness retail" },
      { n: "Free", l: "Product Guru submission" },
    ],
    intro:
      "Holland & Barrett is the UK's dominant health and wellness retailer — vitamins, supplements, natural beauty, free-from and functional food — and it has systematically opened its doors to emerging brands: structured submissions through Product Guru, and a Marketplace launched to widen the range beyond the core estate. For wellness brands it's often the single most valuable UK listing, and among the most reachable.",
    routesHeading: { pre: "The three routes", em: "into Holland & Barrett" },
    routes: [
      {
        title: "Product Guru — the submission platform",
        body: "H&B reviews new products through [Product Guru](https://app.productguru.co/hollandandbarrett) — sign up free, upload brand and product details on their templates, and the relevant H&B buyer is notified to review. It's the structured, official route for core-range consideration.",
      },
      {
        title: "H&B Marketplace — Trusted Seller",
        body: "The **H&B Marketplace** lets brands sell through hollandandbarrett.com as Trusted Sellers under a lighter model — contact Marketplace@hollandandbarrett.com with your brand intro. Note: H&B has taken exclusive access to marketplace products for their first 30 days on platform." ,
      },
      {
        title: "Buyer engagement & trade presence",
        body: "Wellness buyers scout trade shows and category media actively. A distinctive functional product with substantiated claims and early traction (DTC, independents, [Planet Organic](https://www.planetorganic.com)-style specialists) earns direct conversations.",
      },
    ],
    requirements: [
      { k: "Claims substantiation", v: "Health claims must comply with UK regulations — authorised claims only, with substantiation on file. This is the wellness category's biggest compliance trap." },
      { k: "Supplements compliance", v: "Food supplement notification requirements, permitted ingredients and dosages, and compliant labelling." },
      { k: "Novel foods", v: "If your ingredient is novel (many functional ingredients are), authorisation status must be resolved before listing." },
      { k: "Quality documentation", v: "Specifications, certificates of analysis, allergen data and stability evidence appropriate to the product." },
      { k: "Marketplace operations", v: "For Trusted Sellers: your own fulfilment to H&B service standards and complete product data." },
      { k: "Insurance", v: "Product liability insurance appropriate to ingestible/topical products." },
    ],
    note:
      "**Compliance note:** wellness is the most claims-regulated category in retail. An unauthorised health claim on your pack or website can kill a listing at legal review — audit your claims before you submit, not after.",
    steps: [
      { title: "Audit compliance", body: "Claims, notifications, novel food status, labelling — resolved before submission.", time: "1–2 months" },
      { title: "Submit via Product Guru", body: "Complete brand and product upload on H&B's templates; buyer notified automatically.", time: "Weeks 0–4" },
      { title: "Buyer review", body: "Category buyer assesses fit, differentiation, compliance and commercials.", time: "1–3 months" },
      { title: "Route decision", body: "Approved Supplier (core range) or Marketplace Trusted Seller — terms differ.", time: "1–2 months" },
      { title: "Onboard & launch", body: "Product data, quality documentation, operational setup and go-live.", time: "1–3 months" },
      { title: "Prove velocity", body: "Marketplace and initial-range performance drives core estate expansion.", time: "Ongoing" },
    ],
    costs: [
      { item: "Compliance & claims review", range: "£1,000–£5,000" },
      { item: "Product testing & stability", range: "£1,000–£4,000 per product" },
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "Marketplace commission", range: "% of sales" },
      { item: "Promotional funding", range: "2–6% of sales" },
    ],
    costNote:
      "H&B runs strong promotional mechanics (penny sale heritage, multibuys) — model your economics accordingly. Compliance spend up front is cheaper than a delisting later.",
    tips: [
      { title: "Lead with the function, prove the claim.", body: "H&B's customer buys outcomes — energy, sleep, gut health. Pitch the need state with authorised claims only." },
      { title: "Use the 30-day exclusivity strategically.", body: "If you launch on H&B Marketplace, plan your wider channel timing around their exclusive window." },
      { title: "Bring wellness-specific traction.", body: "Sell-through at specialists and strong DTC subscription rates speak this buyer's language." },
      { title: "Watch the submission calendar.", body: "Categories review in cycles — ask Product Guru or the buyer when your category next opens." },
    ],
    faqs: [
      { q: "How do I submit a product to Holland & Barrett?", a: "Through Product Guru — H&B's partner platform for new product submissions. Sign up free, upload your brand and products on their templates, and the relevant buyer is notified." },
      { q: "What is the H&B Marketplace?", a: "A route to sell through hollandandbarrett.com as a Trusted Seller with your own fulfilment — contact Marketplace@hollandandbarrett.com. H&B has taken 30-day exclusive access to new marketplace products." },
      { q: "What compliance do supplements need?", a: "UK food supplement regulations: permitted ingredients and dosages, compliant labelling, authorised health claims only, and novel food authorisation where applicable." },
      { q: "Is H&B good for emerging wellness brands?", a: "Yes — arguably the most reachable major UK listing for wellness: structured submissions, an open marketplace route, and buyers actively hunting innovation." },
      { q: "How long does an H&B listing take?", a: "Marketplace routes can move in 2–4 months; core-range Approved Supplier listings typically run 4–9 months with category cycles." },
    ],
    sources: [
      { label: "H&B — Supplying Holland & Barrett", href: "https://www.hollandandbarrett.com/info/supplying-holland-and-barrett/" },
      { label: "Product Guru × Holland & Barrett", href: "https://app.productguru.co/hollandandbarrett" },
    ],
  },
  {
    slug: "selfridges",
    name: "Selfridges",
    country: "UK",
    category: "Premium Department",
    cardBlurb: "Iconic premium placement — supplier agreement via suppliers@selfridges.com, buyer-led curation.",
    topGun: false,
    metaTitle: "How to Sell to Selfridges: Become a Brand Supplier | Spottail",
    metaDescription:
      "How to get your brand into Selfridges: the supplier agreement route, buyer pitching, compliance standards, concession models, timelines and costs.",
    kicker: "UK · Premium Department Store · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Selfridges",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Selfridges supplier, start the formal process by emailing your completed **initiating supplier agreement to suppliers@selfridges.com** (or via the supplier portal) — but the real gate is the buyer: Selfridges is curation-led, and buyers choose brands that fit its premium, discovery-driven identity. Be ready for **wholesale pricing that supports department-store margins**, extended payment terms, and the operational demands of a flagship retailer. Concession and consignment models exist alongside wholesale.",
    facts: [
      { n: "4", l: "stores + selfridges.com" },
      { n: "#1", l: "London retail landmark" },
      { n: "3", l: "models: wholesale, concession, consignment" },
      { n: "Curation", l: "led buying" },
    ],
    intro:
      "Selfridges is small in store count and enormous in influence — a listing is as much brand positioning as distribution. Its buyers curate for discovery: emerging designers, cult beauty, premium food hall products. The commercial reality is demanding (department-store margins, slower payment, high presentation standards), but the halo effect on a premium brand is unmatched in UK retail.",
    routesHeading: { pre: "The three routes", em: "into Selfridges" },
    routes: [
      {
        title: "The formal supplier process",
        body: "Selfridges' process starts with an **initiating supplier agreement** — submitted to suppliers@selfridges.com or uploaded via the supplier portal — plus compliance documentation. In practice this formalises what a buyer has already decided; work the buyer first, paperwork second.",
      },
      {
        title: "Buyer pitching — the real gate",
        body: "Selfridges buying is curation-led by category (beauty, accessories, food hall, home). A tight pitch — brand story, press and social proof, wholesale pricing, and why you fit Selfridges' discovery identity — matters more here than anywhere. Brands have won listings through persistent, well-timed direct approaches; brochures followed by in-person contact have a real track record.",
      },
      {
        title: "Concessions & consignment",
        body: "Beyond wholesale, Selfridges operates **concession** (you staff and run a space) and **consignment** (they sell, you own stock until sale) models — lower risk for the retailer, faster entry for distinctive brands, and common for emerging designers and premium food.",
      },
    ],
    requirements: [
      { k: "Brand fit", v: "Premium positioning, distinctive story, presentation standards that survive a flagship shop floor — buyers curate for discovery." },
      { k: "Supplier agreement & compliance", v: "Initiating supplier agreement plus compliance check documentation covering required standards." },
      { k: "Wholesale economics", v: "Pricing that supports department-store margins while keeping your profitability — with cash flow to survive extended payment terms." },
      { k: "Operational capability", v: "Scaling production, tight deadlines and consistent availability — flagship retail is unforgiving on stock gaps." },
      { k: "Category compliance", v: "CPSR for beauty, food safety documentation for food hall products, UKCA/CE where applicable." },
      { k: "Insurance", v: "Product liability insurance appropriate to premium retail." },
    ],
    note:
      "**Positioning note:** a Selfridges listing rarely makes money in year one — margins and volumes don't work that way. Its value is the halo: press, credibility with other premium buyers (domestic and international), and proof your brand belongs at the top of the market. Price that into your expectations.",
    steps: [
      { title: "Build the brand case", body: "Press, social proof, distinctive story, premium presentation — the assets a curation-led buyer responds to.", time: "Ongoing" },
      { title: "Pitch the buyer", body: "Category-targeted, concise, visual — with wholesale pricing ready. Follow up with persistence and grace.", time: "1–6 months" },
      { title: "Agree the model", body: "Wholesale, concession or consignment — economics and operational load differ substantially.", time: "1–2 months" },
      { title: "Formalise", body: "Initiating supplier agreement to suppliers@selfridges.com, compliance checks, commercial terms.", time: "1–2 months" },
      { title: "Launch", body: "Presentation, training (concessions), and launch timing aligned to Selfridges' retail calendar.", time: "1–3 months" },
      { title: "Leverage the halo", body: "Use the listing in every other pitch — it's the point.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "Premium packaging & presentation", range: "£10,000–£50,000" },
      { item: "Concession staffing (if applicable)", range: "Your payroll" },
      { item: "Compliance documentation", range: "£1,000–£5,000" },
      { item: "Cash flow buffer (payment terms)", range: "Plan 60–90 days" },
    ],
    costNote:
      "The costs that hurt at Selfridges are working capital costs: stock investment, presentation, and waiting for payment. Model cash flow before margin.",
    tips: [
      { title: "Time your approach to buying seasons.", body: "Department store buying runs seasonally by category — ask when ranges are reviewed and pitch into the window." },
      { title: "Make the first impression physical.", body: "Premium buying is tactile. Beautiful samples and brochures, then get in front of the buyer in person." },
      { title: "Consider consignment to start.", body: "It lowers the buyer's risk to near zero — easier yes, and your performance data does the rest." },
      { title: "Have your press kit ready.", body: "Selfridges buys brands the culture is talking about. Earned media and social proof are currency." },
    ],
    faqs: [
      { q: "How do I become a Selfridges supplier?", a: "Win a buyer first — Selfridges is curation-led — then formalise via the initiating supplier agreement submitted to suppliers@selfridges.com or the supplier portal, with compliance documentation." },
      { q: "Does Selfridges take emerging brands?", a: "Yes — discovery is core to its identity, especially in beauty, accessories and the food hall. Concession and consignment models make emerging-brand entries feasible." },
      { q: "What are Selfridges' payment terms like?", a: "Extended — plan working capital for 60–90 day cycles, and price wholesale to survive department-store margins." },
      { q: "What's the difference between wholesale, concession and consignment?", a: "Wholesale: they buy your stock. Concession: you run a staffed space and pay a share. Consignment: they display, you own stock until it sells. Risk and control shift accordingly." },
      { q: "Is a Selfridges listing profitable?", a: "Often not directly at first — its value is positioning: press, premium credibility and the doors it opens with other buyers." },
    ],
    sources: [
      { label: "Enterprise Nation — pitching Selfridges buyers", href: "https://www.enterprisenation.com/learn-something/how-to-pitch-selfridges-buyers/" },
      { label: "Selfridges — supplier guidelines", href: "https://www.printfriendly.com/document/selfridges-supplier-guidelines-standards" },
    ],
  },
  {
    slug: "b-and-m",
    name: "B&M",
    country: "UK",
    category: "Discount & Variety",
    cardBlurb: "700+ store discount chain — brand-led FMCG buying, face-to-face supplier onboarding.",
    topGun: false,
    metaTitle: "How to Become a B&M Supplier: Vendor Process & Requirements | Spottail",
    metaDescription:
      "How to supply B&M: what its buyers look for, the face-to-face account process, value price points, single-delivery-point logistics, timelines and costs.",
    kicker: "UK · Discount & Variety · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "B&M",
    h1Post: "supplier",
    readTime: "8 min read",
    quickAnswer:
      "To become a B&M supplier, approach the buying team through **B&M's supplier channels** (bmstores.co.uk/suppliers) — and note the distinctive gate: **B&M never opens supplier accounts without a face-to-face meeting**. Its FMCG buying focuses on **leading brands at value prices** rather than unbranded products; general merchandise buying is opportunistic and deal-led. Logistics are simple by design: a **single delivery point** into B&M's bulk warehousing.",
    facts: [
      { n: "700+", l: "UK stores" },
      { n: "2.9m", l: "sq ft of warehousing" },
      { n: "1", l: "delivery point for suppliers" },
      { n: "Value", l: "price-led buying" },
    ],
    intro:
      "B&M is one of the UK's fastest-grown discount retailers — a variety chain selling FMCG brands, home, garden and seasonal goods at sharp prices. Its buying model is distinctive: in FMCG it wants recognisable brands (not tertiary or unbranded lines), bought well and sold cheap; in general merchandise it buys opportunistically. For established brands with volume flexibility, it's a fast, high-volume channel. For unbranded startups, it's usually the wrong door.",
    routesHeading: { pre: "The three routes", em: "into B&M" },
    routes: [
      {
        title: "Direct buying team approach",
        body: "B&M's [supplier information](https://www.bmstores.co.uk/suppliers) sets out how it works with vendors. Approach the relevant buyer with a value-led proposition: recognisable product, sharp cost price, volume availability. Note the security-driven rule — **accounts are only opened after a face-to-face meeting**, which protects both sides from fraud.",
      },
      {
        title: "Clearance, surplus & special buys",
        body: "B&M's general merchandise engine runs on opportunistic buying — overstocks, clearance lines, special production runs at price points. If you have surplus inventory or can hit a price for a volume run, this is a genuine and fast route to big orders.",
      },
      {
        title: "Brand-led FMCG listings",
        body: "In grocery and FMCG, B&M focuses on leading brands. If your brand has built recognition through the multiples or wholesale — see [Booker](/become-a-supplier/booker) — B&M becomes a volume channel that monetises that awareness at value price points.",
      },
    ],
    requirements: [
      { k: "Brand recognition (FMCG)", v: "B&M focuses on leading brands in most FMCG areas rather than unbranded or tertiary lines — your brand needs existing consumer recognition." },
      { k: "Value economics", v: "Good quality at great value is the buying filter — cost prices that let B&M undercut the high street." },
      { k: "Face-to-face verification", v: "Supplier accounts are opened only after in-person meetings — a fraud-prevention policy, so treat unexpected 'B&M orders' by email with suspicion." },
      { k: "Volume & logistics", v: "Bulk supply into a single delivery point — B&M's 2.9m sq ft warehousing consolidates distribution to stores." },
      { k: "Compliance", v: "Category-appropriate certifications, GSCOP applies to grocery supply, and standard product safety requirements." },
      { k: "Financial standing", v: "Standard due diligence — B&M highlights its own strong payment record; yours will be checked too." },
    ],
    note:
      "**Fraud warning worth repeating:** criminals impersonate B&M with fake purchase orders to steal stock. B&M states it never opens accounts without meeting face-to-face — verify any approach through official channels before shipping anything.",
    steps: [
      { title: "Match your proposition", body: "Branded FMCG at value, or opportunistic GM volume — know which pitch you're making.", time: "Week 0" },
      { title: "Approach the buyer", body: "Via official supplier channels with cost price, volumes and availability up front.", time: "Weeks 0–8" },
      { title: "Meet face-to-face", body: "The mandatory in-person step — commercial discussion and account verification.", time: "1–2 months" },
      { title: "Agree terms & logistics", body: "Pricing, volumes, and delivery into B&M's central warehousing.", time: "2–6 weeks" },
      { title: "Deliver & repeat", body: "Discount retail rewards reliability — hit volumes and dates, and reorders follow fast.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "Bulk logistics to single delivery point", range: "Lower than multi-DC supply" },
      { item: "Volume production runs", range: "Working capital — scale-dependent" },
      { item: "Margin trade-off", range: "Sharp cost prices vs. high volumes" },
    ],
    costNote:
      "B&M's economics are volume-for-margin: sharper cost prices than the multiples, but big orders, simple logistics and a strong payment record. It works when your production scales cheaply.",
    tips: [
      { title: "Come with a price that works.", body: "B&M buyers think in retail price points (£1, £2.99, £4.99). Reverse-engineer your cost price from the shelf." },
      { title: "Use it as a volume channel, not a launchpad.", body: "B&M monetises brand recognition built elsewhere. Build the brand first; sell the volume here." },
      { title: "Offer seasonal and surplus lines.", body: "Opportunistic buying means yesterday's overstock is today's deal — a useful relief valve for inventory." },
      { title: "Verify everything.", body: "Given the impersonation fraud, confirm every order through verified B&M contacts before dispatch." },
    ],
    faqs: [
      { q: "How do I become a B&M supplier?", a: "Approach the buying team through B&M's official supplier channels with a value-led proposition. Accounts are only opened after a face-to-face meeting — a deliberate fraud-prevention policy." },
      { q: "Does B&M stock small or unbranded products?", a: "In most FMCG areas B&M focuses on leading brands rather than unbranded or tertiary lines. General merchandise is more opportunistic and deal-led." },
      { q: "What does B&M look for?", a: "Good quality at great value: recognisable products at cost prices that let B&M undercut the high street, supplied in volume to a single delivery point." },
      { q: "Is B&M covered by GSCOP?", a: "Yes — B&M is a designated retailer under the Groceries Supply Code of Practice for its grocery supply." },
      { q: "How fast can a B&M listing move?", a: "Faster than the multiples — opportunistic buys can go from meeting to purchase order in weeks when price and volume line up." },
    ],
    sources: [
      { label: "B&M — Suppliers", href: "https://www.bmstores.co.uk/suppliers" },
      { label: "B&M — GSCOP", href: "https://www.bandmretail.com/corporate-responsibility/groceries-supply-code-of-practice" },
    ],
  },
  {
    slug: "the-range",
    name: "The Range",
    country: "UK",
    category: "Home & Garden",
    cardBlurb: "Home, garden & leisure chain — direct buyer approach, value-led general merchandise.",
    topGun: false,
    metaTitle: "How to Become a Supplier to The Range: Vendor Process & Requirements | Spottail",
    metaDescription:
      "How to supply The Range: approaching the buying team, value-led home and garden merchandise, requirements, timelines and costs for new vendors.",
    kicker: "UK · Home & Garden · Supplier Guide",
    h1Pre: "How to supply",
    h1Em: "The Range",
    h1Post: "",
    readTime: "8 min read",
    quickAnswer:
      "To become a supplier to The Range, approach its **buying team directly** — The Range doesn't run an open submission platform like RangeMe, so supply relationships start with a targeted pitch to the relevant category buyer through its head-office channels. The proposition that works: **value-led home, garden and leisure products** with sharp cost prices and dependable volume. Standard vendor requirements apply: product safety compliance, insurance, and reliable bulk logistics.",
    facts: [
      { n: "210+", l: "UK & Ireland stores" },
      { n: "16", l: "product departments" },
      { n: "Value", l: "led general merchandise" },
      { n: "Direct", l: "buyer-approach route" },
    ],
    intro:
      "The Range is one of the UK's largest home, garden and leisure retailers — a broad-range value chain spanning furniture, homewares, DIY, arts and crafts, and seasonal goods, now also owner of Homebase's brand and stores. There's no public submission portal, which filters out casual approaches: supply starts with a direct, well-prepared pitch to the right category buyer. For value-priced general merchandise with volume behind it, it's a substantial and growing channel.",
    routesHeading: { pre: "The three routes", em: "into The Range" },
    routes: [
      {
        title: "Direct buyer approach",
        body: "Identify the buyer for your department (homewares, garden, DIY, crafts, seasonal) and pitch directly through The Range's head-office contacts — concise deck, cost pricing, volumes, imagery and compliance status. No portal means preparation and persistence do the filtering.",
      },
      {
        title: "Trade shows",
        body: "Home and garden buying still happens heavily at trade fairs — Spring Fair, Autumn Fair, Glee and equivalents. The Range's buyers walk them; a stand or well-arranged meetings there put your product physically in front of the decision-maker.",
      },
      {
        title: "Prove velocity in adjacent channels",
        body: "Sell-through with [B&M](/become-a-supplier/b-and-m), garden centres, or online marketplaces gives a value-retail buyer the evidence that de-risks a listing. Value GM buying is rate-of-sale-led — bring the numbers.",
      },
    ],
    requirements: [
      { k: "Value economics", v: "Cost prices that support The Range's value positioning across home and garden price points." },
      { k: "Product safety compliance", v: "UKCA/CE marking where applicable, furniture fire-safety regulations, toy safety standards, REACH — category-dependent and non-negotiable." },
      { k: "Volume & reliability", v: "Capacity to supply 200+ stores plus online, with dependable lead times." },
      { k: "Insurance", v: "Product liability insurance at general-merchandise retail levels." },
      { k: "Product data & barcodes", v: "GTIN/barcodes and complete product data for range setup." },
      { k: "Packaging", v: "Retail-ready, shelf-efficient packaging that survives big-box handling." },
    ],
    note:
      "**Category note:** home and garden compliance is underestimated — fire regs on upholstered furniture, UKCA on electricals, toy standards on anything play-adjacent. Have certificates ready at pitch; buyers ask early because failures are expensive late.",
    steps: [
      { title: "Target the right department", body: "Sixteen departments, each with its own buyer — pitch the specific one, not 'The Range'.", time: "Week 0" },
      { title: "Pitch with full commercials", body: "Cost price, MOQs, lead times, compliance certificates and imagery — complete first time.", time: "Weeks 0–8" },
      { title: "Samples & review", body: "Buyer evaluates product, price and fit against the current range and seasonal plans.", time: "1–3 months" },
      { title: "Terms & setup", body: "Commercial terms, product data, logistics arrangements.", time: "1–2 months" },
      { title: "Launch & reorder", body: "Value GM is measured on rate of sale — strong sellers reorder fast and expand across departments.", time: "Ongoing" },
    ],
    costs: [
      { item: "Product safety certification", range: "£500–£5,000 per product line" },
      { item: "Product liability insurance", range: "£1,500–£5,000 / year" },
      { item: "Retail-ready packaging", range: "£3,000–£20,000" },
      { item: "Trade show presence (optional)", range: "£3,000–£15,000 per show" },
      { item: "Volume production runs", range: "Working capital — scale-dependent" },
    ],
    costNote:
      "With no portal fees or heavy certification schemes, the entry cost here is mostly compliance and working capital. The constraint is buyer attention — invest in the pitch.",
    tips: [
      { title: "Think in price points.", body: "Value GM buyers work backwards from shelf prices. Present your product at the retail price point it hits, with their margin built in." },
      { title: "Lead seasonal, land core.", body: "Seasonal buys (garden, Christmas, back-to-school) are the easiest first orders — perform there and pitch the core range after." },
      { title: "Meet them at the fairs.", body: "Spring Fair and Glee are where home and garden listings actually start. Book buyer meetings ahead, don't just stand at a stand." },
      { title: "Have compliance paperwork in the deck.", body: "Certificates in the pitch signals professionalism and removes the buyer's easiest reason to pass." },
    ],
    faqs: [
      { q: "How do I become a supplier to The Range?", a: "Approach the relevant category buyer directly through The Range's head-office channels — there's no open submission portal. A complete pitch with cost pricing, compliance certificates and volume capacity is the entry ticket." },
      { q: "What products does The Range buy?", a: "Home, garden, DIY, arts and crafts, furniture, pet, leisure and seasonal goods across 16 departments — value-led throughout." },
      { q: "What compliance do home and garden products need?", a: "Category-dependent: UKCA/CE marking, furniture fire-safety regulations, toy safety standards, REACH for chemicals — certificates should be ready at pitch stage." },
      { q: "Does The Range attend trade shows?", a: "Its buyers walk the major home and garden fairs (Spring Fair, Autumn Fair, Glee) — trade shows remain a primary route to buyer meetings in this category." },
      { q: "How long does a listing take?", a: "Faster than grocery multiples — 3–6 months from pitch to purchase order is realistic when price and compliance line up." },
    ],
    sources: [
      { label: "The Range — official site", href: "https://www.therange.co.uk" },
    ],
  },
  {
    slug: "ocado",
    name: "Ocado",
    country: "UK",
    category: "Online Grocery",
    cardBlurb: "Online-only grocer — application via Supply Ocado, no shelf-space constraint, small-brand friendly.",
    topGun: false,
    metaTitle: "How to Become an Ocado Supplier: Application, Requirements & Timeline | Spottail",
    metaDescription:
      "How to get listed on Ocado: the Supply Ocado application, 8-week review, wholesaler/consolidator requirements, promotional budgets, timelines and costs.",
    kicker: "UK · Online Grocery · Supplier Guide",
    h1Pre: "How to become an",
    h1Em: "Ocado",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become an Ocado supplier, complete the application on **Supply Ocado** (supplyocado.com) — a four-section form covering your brand, range, products and food-safety evidence. A buyer reviews within **up to 8 weeks**, then invites samples and a pitch if suitable. Ocado's online-only model means **no shelf-space fight**, making it one of the friendliest major listings for small brands — but expect requirements on **wholesaler/consolidator logistics, EDI, and a real promotional budget**.",
    facts: [
      { n: "100%", l: "online — no shelf constraint" },
      { n: "8wk", l: "typical application review" },
      { n: "4", l: "application sections" },
      { n: "1,000s", l: "of small brands ranged" },
    ],
    intro:
      "Ocado is the UK's leading dedicated online grocer — and structurally the friendliest major listing for a small brand, because virtual aisles don't ration shelf space the way physical stores do. It has deliberately positioned itself as the place to discover new brands. The application is unusually transparent (a public form with a published process), but don't mistake accessible for easy: consolidator logistics and promotional participation are where unprepared brands stall.",
    routesHeading: { pre: "The three routes", em: "into Ocado" },
    routes: [
      {
        title: "Supply Ocado — the front door",
        body: "The [Supply Ocado](https://supplyocado.com/) application has four sections: your brand, your range, individual products, and safety/legal evidence. A buyer reviews within about 8 weeks and either declines or sets up a meeting — successful applicants send samples and pitch. Complete, honest applications with strong imagery and clear differentiation progress; thin ones don't.",
      },
      {
        title: "Sort your route to their dock first",
        body: "Ocado wants suppliers working with a **reliable wholesaler or consolidator** who can guarantee on-time delivery into its fulfilment centres — small brands rarely deliver direct. Have those conversations *before* your Ocado meeting; naming your consolidator in the pitch answers the question every Ocado buyer asks.",
      },
      {
        title: "Buyer engagement & ranges",
        body: "Ocado runs discovery-friendly merchandising (small supplier showcases, new brand features). A distinctive product with early traction and a promotional plan gets buyer attention — the marketing budget question is a known deal-breaker, so bring a real answer.",
      },
    ],
    requirements: [
      { k: "Safe & legal evidence", v: "Food safety documentation proving products are safe and legal — HACCP foundation, with certification proportionate to category and risk." },
      { k: "Logistics via consolidator", v: "A reliable wholesaler/consolidator guaranteeing on-time delivery into Ocado's network — effectively required for smaller suppliers." },
      { k: "EDI capability", v: "Stocked suppliers trade electronically with Ocado." },
      { k: "Promotional budget", v: "A funded promotional and marketing plan — Ocado treats this as core, and its absence is a stated deal-breaker." },
      { k: "Product data & imagery", v: "Online-first retail: complete data, nutrition, and high-quality imagery are your shelf presence." },
      { k: "Insurance", v: "Product liability insurance appropriate to grocery retail." },
    ],
    note:
      "**Online advantage:** with no physical shelf to fight for, Ocado can range long-tail products that supermarkets can't justify — which is exactly why it's a proving ground. Strong Ocado velocity data is increasingly cited in pitches to physical multiples.",
    steps: [
      { title: "Prepare the four sections", body: "Brand story, range logic, product specs, safety/legal evidence — plus imagery that sells online.", time: "Weeks 0–4" },
      { title: "Apply on Supply Ocado", body: "Submit and wait for buyer review — typically up to 8 weeks.", time: "Up to 8 weeks" },
      { title: "Samples & pitch", body: "Successful applications progress to samples and a buyer meeting — bring your consolidator plan and promo budget.", time: "1–2 months" },
      { title: "Commercial & logistics setup", body: "Terms, EDI, consolidator arrangements and product data onboarding.", time: "1–3 months" },
      { title: "Launch online", body: "Go live in the virtual aisles — imagery and reviews start doing the selling.", time: "Launch" },
      { title: "Drive velocity", body: "Promotions, features and rate of sale determine ranging — and generate the data other retailers respect.", time: "Ongoing" },
    ],
    costs: [
      { item: "Food safety certification", range: "£1,000–£6,000 / year" },
      { item: "Consolidator/wholesaler margin", range: "% of wholesale — provider-dependent" },
      { item: "EDI setup", range: "£3,000–£10,000" },
      { item: "Promotional & marketing budget", range: "3–8% of sales — effectively required" },
      { item: "Product photography & content", range: "£1,000–£5,000" },
    ],
    costNote:
      "The promotional budget isn't optional garnish at Ocado — it's a stated expectation. Underfunding marketing is the most common reason small-brand Ocado listings underperform.",
    tips: [
      { title: "Name your consolidator in the application.", body: "It answers the logistics question up front and signals you understand how supplying Ocado actually works." },
      { title: "Invest in imagery like it's packaging.", body: "Online, the photo is the shelf. Professional product photography pays for itself in conversion." },
      { title: "Plan promotions before launch.", body: "New-listing momentum matters in algorithmic merchandising — launch with a funded promotional calendar, not after one." },
      { title: "Use Ocado data everywhere.", body: "Rate of sale, repeat purchase, reviews — Ocado gives you the exact evidence physical-retail buyers ask for. Harvest it." },
    ],
    faqs: [
      { q: "How do I apply to supply Ocado?", a: "Through the application form on supplyocado.com — four sections covering brand, range, products and safety/legal evidence. A buyer reviews within about 8 weeks." },
      { q: "Do I need a wholesaler or consolidator?", a: "Effectively yes for smaller suppliers — Ocado expects reliable consolidated delivery into its fulfilment centres, and wants those arrangements in place before listing." },
      { q: "Is Ocado good for small brands?", a: "One of the best major listings available: no shelf-space constraint, discovery-friendly merchandising, and a transparent application. The promotional budget expectation is the main hurdle." },
      { q: "How long does the Ocado process take?", a: "Up to 8 weeks for application review, then typically 2–5 further months through samples, pitch, commercial setup and onboarding." },
      { q: "Does Ocado require a marketing budget?", a: "Yes — a funded promotional and marketing plan is treated as core and its absence can be a deal-breaker." },
    ],
    sources: [
      { label: "Supply Ocado — official supplier site", href: "https://supplyocado.com/" },
      { label: "Ocado Supplier Manual", href: "https://supplyocado.com/wp-content/uploads/2024/09/Supplier-Manual-September-2024.pdf" },
    ],
  },
  {
    slug: "booker",
    name: "Booker",
    country: "UK",
    category: "Wholesale",
    cardBlurb: "The UK's biggest wholesaler (Tesco-owned) — one listing reaches ~120,000 independent retailers.",
    topGun: false,
    metaTitle: "How to Become a Booker Supplier: Sell to the UK's Biggest Wholesaler | Spottail",
    metaDescription:
      "How to supply Booker wholesale: routes to the trading team, what one listing reaches (120k retailers, 450k caterers), requirements, timelines and costs.",
    kicker: "UK · Wholesale · Supplier Guide",
    h1Pre: "How to become a",
    h1Em: "Booker",
    h1Post: "supplier",
    readTime: "9 min read",
    quickAnswer:
      "To become a Booker supplier, approach **Booker's trading team directly** — there's no public submission portal, so supply starts with a targeted pitch to the buyer for your category, through Booker's head office or via meetings at trade events. The prize is scale: one Booker listing reaches **~120,000 independent retailers and 450,000 catering businesses** through 170+ branches and the Premier, Londis, Budgens and Family Shopper symbol groups. As a Tesco-owned business, professional standards (certification, GSCOP, EDI) mirror multiple-grocer expectations.",
    facts: [
      { n: "170+", l: "branches nationwide" },
      { n: "~120k", l: "independent retailers served" },
      { n: "450k", l: "catering customers" },
      { n: "4", l: "symbol groups (Premier, Londis…)" },
    ],
    intro:
      "Booker is the UK's biggest food wholesaler — the supply engine behind a huge share of the country's convenience stores, corner shops and caterers, and owner of the Premier, Londis, Budgens and Family Shopper symbol groups. For a growing brand, it's arguably the highest-leverage UK listing there is: one trading relationship puts you in reach of a hundred thousand independent shelves, and the sell-through data it generates is exactly what multiple-grocer buyers ask for. Since 2018 it's been part of Tesco Group, and its supplier standards reflect that.",
    routesHeading: { pre: "The three routes", em: "into Booker" },
    routes: [
      {
        title: "Direct trading team approach",
        body: "Booker's buying is organised by category under its trading function. With no public portal, the route is a direct, well-prepared approach: category buyer identified, concise pitch with wholesale pricing (think in **POR — profit on return — for the retailer**), case configurations, and evidence of consumer demand. Persistence through official channels is normal; this is how wholesale relationships start.",
      },
      {
        title: "Trade events & branch visibility",
        body: "Booker and the wider wholesale channel run trade shows and supplier events where trading teams actively scout. Presence at wholesale-channel events — and visibility in trade press like The Grocer and Wholesale News — puts you in the flow where Booker buyers look.",
      },
      {
        title: "Start with symbol-group and regional relevance",
        body: "Booker's symbol groups (Premier, Londis, Budgens) range products their independent retailers ask for. Building demand at store level — independents requesting your product from their Booker rep — creates pull that trading teams respond to. It's the wholesale version of proving yourself in independents first.",
      },
    ],
    requirements: [
      { k: "Food safety certification", v: "GFSI-recognised certification (BRCGS or equivalent) expected for food supply at Booker's scale, with HACCP foundations." },
      { k: "Wholesale economics", v: "Pricing built for the chain: your margin, Booker's margin, and a retailer POR that makes independents want to stock you at a competitive RRP." },
      { k: "Case & logistics format", v: "Wholesale-appropriate case sizes, outer packaging and palletisation for cash & carry and delivered wholesale." },
      { k: "GSCOP", v: "As part of Tesco Group, groceries supply code protections and disciplines apply." },
      { k: "EDI & data", v: "Electronic trading and complete product data across a 170+ branch network." },
      { k: "Capacity", v: "Ability to supply national wholesale volume — or agree a regional branch subset to start." },
    ],
    note:
      "**Why this listing punches above its weight:** wholesale sell-through is the evidence multiple grocers trust most. A brand moving cases through Booker at healthy POR has proven price, product and demand simultaneously — it's the strongest single data point you can bring to a [Tesco](/become-a-supplier/tesco) or [Asda](/become-a-supplier/asda) pitch.",
    steps: [
      { title: "Build the wholesale pack", body: "Case configurations, wholesale pricing with POR maths, RRP strategy and demand evidence.", time: "Weeks 0–4" },
      { title: "Approach the trading team", body: "Category buyer pitch through official channels; trade event meetings accelerate this.", time: "1–3 months" },
      { title: "Commercial negotiation", body: "Pricing, promotional mechanics (wholesale runs deep trade promotions), volumes and branch coverage.", time: "1–2 months" },
      { title: "Compliance & onboarding", body: "Certification checks, EDI setup, product data and logistics arrangements.", time: "1–2 months" },
      { title: "Land in branches", body: "Launch across agreed branches — availability and depot service levels are watched closely.", time: "Launch" },
      { title: "Drive retailer pull", body: "Symbol-group features, depot promotions and rep engagement turn a listing into velocity.", time: "Ongoing" },
    ],
    costs: [
      { item: "BRCGS certification & audit", range: "£3,000–£8,000 / year" },
      { item: "EDI setup", range: "£3,000–£10,000" },
      { item: "Product liability insurance", range: "£2,000–£5,000 / year" },
      { item: "Wholesale case packaging", range: "£2,000–£10,000" },
      { item: "Trade promotions", range: "Built into wholesale pricing" },
    ],
    costNote:
      "Wholesale margins stack (yours → Booker's → retailer's POR), so unit economics need engineering from the RRP backwards. Get the maths right and the volume does the rest.",
    tips: [
      { title: "Pitch in POR, not just price.", body: "Booker's customers buy on profit-on-return. Show the independent retailer's margin at your RRP and the pitch writes itself." },
      { title: "Design cases for cash & carry.", body: "Shelf-ready outers, sensible case counts and clear branding — your packaging works the depot as well as the shop." },
      { title: "Create store-level pull.", body: "Independents asking their Booker rep for your product is the most persuasive signal a trading team can receive." },
      { title: "Use Booker data in every multiple pitch.", body: "Cases per depot per week is the proof multiple buyers respect most — track it from day one." },
    ],
    faqs: [
      { q: "How do I become a Booker supplier?", a: "Approach Booker's trading team directly — there's no public submission portal. A category-targeted pitch with wholesale pricing, case formats and demand evidence, or meetings at wholesale trade events, is the route in." },
      { q: "What does a Booker listing reach?", a: "170+ branches serving around 120,000 independent retailers and 450,000 catering businesses, plus the Premier, Londis, Budgens and Family Shopper symbol groups." },
      { q: "What certifications does Booker expect?", a: "GFSI-recognised food safety certification (BRCGS or equivalent) for food supply, consistent with its position in Tesco Group." },
      { q: "Is Booker owned by Tesco?", a: "Yes — Booker has been part of Tesco Group since 2018, and supplier standards and GSCOP disciplines reflect that." },
      { q: "Why supply wholesale before supermarkets?", a: "One relationship reaches thousands of independent shelves, margins stack predictably, and the sell-through data you generate is the strongest evidence you can bring to a multiple-grocer pitch." },
    ],
    sources: [
      { label: "Booker Wholesale — official site", href: "https://www.booker.co.uk/" },
      { label: "Booker — Premier symbol group", href: "https://www.booker.co.uk/content/pages/retail/premier.html" },
    ],
  },
];
