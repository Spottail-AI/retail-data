import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Can I change plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate your billing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.",
  },
  {
    q: "Is there a contract?",
    a: "No contracts. Monthly plans are flexible. Cancel anytime from your billing settings.",
  },
  {
    q: "What happens if I downgrade?",
    a: "Your downgrade takes effect at the end of your current billing period. You won't lose any data.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day free trial with no credit card required. After that, we don't offer refunds, but you can cancel anytime.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "If you exceed limits (e.g., tracking 3+ competitors on Free plan), features are disabled until you upgrade or remove tracked items.",
  },
];

export const PricingFAQ = () => (
  <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
      Frequently Asked Questions
    </h2>
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="text-foreground font-medium text-left hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
