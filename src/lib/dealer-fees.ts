export type DealerFeeFaq = {
  q: string;
  a: string;
};

export type DealerFee = {
  slug: string;
  name: string;
  aka: string[];
  title: string;
  description: string;
  shortAnswer: string;
  typicalRange: string;
  mandatory: string;
  negotiable: "Yes" | "No" | "Sometimes";
  whatItIs: string[];
  watchFor: string[];
  faqs: DealerFeeFaq[];
  updatedAt: string;
};

export const dealerFees: DealerFee[] = [
  {
    slug: "documentation-fee",
    name: "Documentation fee",
    aka: ["Doc fee", "Dealer documentation fee", "Processing fee"],
    title:
      "What Is a Documentation Fee? Doc Fee Explained (Average Cost) | Dealscan",
    description:
      "A documentation fee covers the dealer's paperwork to register and title your car. Learn the average doc fee, which states cap it, and whether you can negotiate it.",
    shortAnswer:
      "A documentation fee (doc fee) is what the dealer charges to handle the paperwork that titles and registers your car. Some states cap it, many do not, so the same task can cost $85 in one state and $700+ in another. It is a real charge, but the amount is largely a profit center.",
    typicalRange: "$85 to $700+ (varies widely by state)",
    mandatory: "Charged on nearly every deal, but capped by law in several states",
    negotiable: "Sometimes",
    whatItIs: [
      "The documentation fee is the dealer's charge for preparing and processing the sale paperwork: the purchase contract, title transfer, and registration submission to your state's DMV. Every sale involves this paperwork, so the fee itself is legitimate. What varies enormously is the price, because most states do not tie the fee to the dealer's actual cost.",
      "Some states cap the doc fee by law (for example California limits it to a low fixed amount, and New York caps it around $175), while states like Florida and Georgia leave it uncapped, where it routinely runs several hundred dollars. Because the line item is usually fixed across all of a dealer's deals, the better lever is the out-the-door price: negotiate the total, not the individual fee.",
    ],
    watchFor: [
      "A doc fee far above your state's typical or capped amount",
      "A doc fee that appears twice under different names (processing + documentation)",
      "Being told the fee is non-negotiable while the dealer refuses to lower the car price to offset it",
      "A fee added after you already agreed on an out-the-door number",
    ],
    faqs: [
      {
        q: "What is the average documentation fee on a used car?",
        a: "It depends entirely on your state. In capped states it can be under $100; in uncapped states it commonly runs $300 to $700 or more. Check your state's cap before you sign, then compare the fee on your quote against it.",
      },
      {
        q: "Can you negotiate a documentation fee?",
        a: "In states with a legal cap, dealers usually cannot go above it and rarely go below it because the same fee is applied to all buyers. The practical move is to negotiate the out-the-door total instead, so a high doc fee is offset by a lower car price.",
      },
      {
        q: "Is a documentation fee a scam?",
        a: "No, the underlying paperwork is real. It becomes a problem when the amount is far above your state's norm, when it is duplicated under another label, or when it is sprung on you after you agreed on a price.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "electronic-filing-fee",
    name: "Electronic filing fee",
    aka: ["E-filing fee", "Electronic title fee", "DMV electronic fee"],
    title:
      "What Is an Electronic Filing Fee on a Car? E-Filing Fee Explained | Dealscan",
    description:
      "An electronic filing fee covers submitting your title and registration to the DMV electronically. Learn the typical cost and whether the charge is legitimate.",
    shortAnswer:
      "An electronic filing fee covers the cost of submitting your title and registration paperwork to the DMV electronically instead of by mail. It is usually small and can be a legitimate pass-through, but some dealers pad it or stack it on top of the documentation fee.",
    typicalRange: "$20 to $40",
    mandatory: "Sometimes a real pass-through, sometimes optional padding",
    negotiable: "Sometimes",
    whatItIs: [
      "Many states let dealers file title and registration paperwork electronically through an approved provider, which is faster than mailing forms to the DMV. The provider charges the dealer a small per-transaction fee, and the electronic filing fee passes that cost to you. When it reflects the real provider cost, it is a fair charge.",
      "The issue is overlap and inflation: some dealers already bundle this work into the documentation fee, so a separate electronic filing line can be a second charge for the same task. Ask whether it duplicates the doc fee, and compare the amount against the provider rates published by your state's DMV.",
    ],
    watchFor: [
      "An electronic filing fee charged on top of a doc fee that already covers DMV submission",
      "An amount well above the typical $20 to $40 range",
      "Vague labeling that does not say what is being filed",
    ],
    faqs: [
      {
        q: "Is an electronic filing fee legitimate?",
        a: "It can be. Many states authorize a small fee for electronic title and registration filing. It is legitimate when it reflects the provider's actual cost and is not duplicated by the documentation fee.",
      },
      {
        q: "How much should an electronic filing fee be?",
        a: "Typically $20 to $40. If it is much higher, ask the dealer to show the provider rate it is based on.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "nitrogen-tire-fill",
    name: "Nitrogen tire fill fee",
    aka: ["Nitrogen tires", "Nitrogen fill", "N2 tire fee"],
    title:
      "Nitrogen Tire Fill Fee: Is It Worth It on a Used Car? | Dealscan",
    description:
      "Dealers charge for filling tires with nitrogen instead of regular air. Learn what it actually does, the typical cost, and why it is usually safe to decline.",
    shortAnswer:
      "A nitrogen tire fill fee charges you for inflating the tires with nitrogen instead of ordinary air. The claimed benefits (steadier pressure, less oxidation) are minor for everyday drivers, and the fee is almost always optional. For most buyers it is safe to decline or have removed.",
    typicalRange: "$50 to $200",
    mandatory: "No, this is an optional add-on",
    negotiable: "Yes",
    whatItIs: [
      "Regular air is already about 78% nitrogen. Filling tires with nearly pure nitrogen can slightly reduce pressure loss over time and limit oxidation inside the tire, which matters for aircraft and race cars. For a daily-driven used car, the real-world benefit over a $1 air top-up is small.",
      "Dealers often pre-fill the tires and add the fee to the sticker as a built-in upcharge. Because it is an optional convenience rather than a required part of the sale, you can ask to have it removed, and if the dealer says the tires are already filled, you can still negotiate the charge off the out-the-door price.",
    ],
    watchFor: [
      "Nitrogen fill listed as a non-removable, pre-installed add-on",
      "A fee at the top of the $50 to $200 range for a routine fill",
      "Being told nitrogen is required for the warranty (it is not)",
    ],
    faqs: [
      {
        q: "Is paying for nitrogen in tires worth it?",
        a: "For most used-car buyers, no. The benefits over regular air are marginal for normal driving, and you can maintain correct pressure for free. It is reasonable to decline the fee.",
      },
      {
        q: "Can I remove a nitrogen tire fee?",
        a: "Usually yes. It is an optional add-on. Ask the dealer to remove it, or negotiate the equivalent amount off the total price.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "vin-etching",
    name: "VIN etching fee",
    aka: ["Window etching", "Glass etching", "Anti-theft etching"],
    title:
      "VIN Etching Fee: What It Is and Whether to Pay | Dealscan",
    description:
      "VIN etching engraves your VIN onto the car's glass as an anti-theft measure. Learn the typical dealer charge, the DIY cost, and whether it is worth it.",
    shortAnswer:
      "VIN etching engraves your vehicle identification number onto the windows as a theft deterrent. The idea is legitimate, but dealers often charge $150 to $400 for something you can do yourself with a kit for around $25. It is optional and negotiable.",
    typicalRange: "$150 to $400 (DIY kits cost about $20 to $30)",
    mandatory: "No, this is an optional add-on",
    negotiable: "Yes",
    whatItIs: [
      "Etching the VIN into the glass makes a stolen car harder to resell or part out, which can modestly deter theft and sometimes earns a small insurance discount. The security concept is real and some buyers value it.",
      "The problem is the markup. A dealer etching fee of several hundred dollars covers a few minutes of stencil-and-acid work, and the same kits are sold to consumers for around $20 to $30. If the car is already etched, you can still negotiate the charge down; if it is not, you can decline and do it yourself later.",
    ],
    watchFor: [
      "An etching fee of $200 or more for pre-applied etching",
      "Etching bundled into the price as mandatory",
      "A claimed insurance discount that does not actually apply to your policy",
    ],
    faqs: [
      {
        q: "Is VIN etching worth paying the dealer for?",
        a: "Rarely at dealer prices. The anti-theft benefit is real but small, and DIY kits cost a fraction of the typical $150 to $400 dealer fee. Many buyers decline and etch the glass themselves if they want it.",
      },
      {
        q: "Can I refuse a window etching fee?",
        a: "Yes. It is an optional add-on, so you can ask to have it removed or negotiate it off the total. If the dealer pre-etched the glass, push back on the amount rather than accepting the full charge.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "dealer-prep-fee",
    name: "Dealer prep fee",
    aka: ["Prep fee", "Dealer preparation fee", "Get-ready fee"],
    title:
      "Dealer Prep Fee: Are You Supposed to Pay It? | Dealscan",
    description:
      "A dealer prep fee charges you to clean and inspect the car before delivery. Learn why it is widely considered junk and how to get it removed.",
    shortAnswer:
      "A dealer prep fee charges you for cleaning, fueling, and inspecting the car before you take it. This is normal cost-of-doing-business work that gets a car ready to sell, so the fee is widely considered junk padding. It is one of the most negotiable line items on a quote.",
    typicalRange: "$200 to $500",
    mandatory: "No, this is generally considered junk padding",
    negotiable: "Yes",
    whatItIs: [
      "Getting a car ready to sell (washing it, topping fluids, a basic inspection) is part of the dealer's overhead, not a separate service you ordered. On new cars, manufacturers already reimburse dealers for this prep, which is why a separate prep fee is often labeled a junk fee.",
      "On used cars the same logic applies: reconditioning is what a dealer does to put the car on the lot, and charging it back to you as a line item double-dips. Treat the prep fee as fully negotiable, and ask for it to be removed or absorbed into the price.",
    ],
    watchFor: [
      "A prep fee on top of a documentation fee, both for routine work",
      "Prep described vaguely with no itemized service",
      "Being told prep is mandatory or required by the manufacturer",
    ],
    faqs: [
      {
        q: "Do I have to pay a dealer prep fee?",
        a: "Usually not. Preparing a car for sale is normal dealer overhead, and on new cars the manufacturer already pays for prep. It is one of the easiest fees to negotiate away or have removed.",
      },
      {
        q: "What is the difference between a prep fee and a doc fee?",
        a: "A doc fee covers paperwork to title and register the car. A prep fee covers cleaning and readying the vehicle. The doc fee is unavoidable (though capped in some states); the prep fee is generally negotiable padding.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "market-adjustment",
    name: "Market adjustment",
    aka: ["Market adjustment markup", "Addendum sticker", "ADM"],
    title:
      "Market Adjustment Fee: What It Means and How to Avoid It | Dealscan",
    description:
      "A market adjustment is a markup added above the listed price during high demand. Learn how to spot it on the addendum sticker and negotiate it away.",
    shortAnswer:
      "A market adjustment (or additional dealer markup) is an amount added above the advertised or list price when a model is in high demand. It is pure margin, often printed on a second addendum sticker, and it is entirely negotiable, walk away if a dealer will not remove it.",
    typicalRange: "A few hundred to several thousand dollars",
    mandatory: "No, this is optional dealer margin",
    negotiable: "Yes",
    whatItIs: [
      "When a vehicle is hard to get, some dealers add a market adjustment on top of the price to capture extra profit. It usually shows up as a separate addendum sticker next to the main window sticker, with a line like market adjustment or additional dealer markup.",
      "Unlike taxes or a state-capped doc fee, this charge has no fixed basis, so it is the most negotiable number on the deal. In a normal market you should not accept it at all; in a tight market, treat it as your primary negotiation target and compare other dealers before agreeing to any markup.",
    ],
    watchFor: [
      "A second sticker (addendum) with a markup beside the factory window sticker",
      "Markups stacked with overpriced add-ons like paint protection and etching",
      "A dealer insisting the markup is fixed or non-negotiable",
    ],
    faqs: [
      {
        q: "What does market adjustment mean on a car price?",
        a: "It is an extra amount the dealer adds above the list price because demand is high. It is not a tax or required fee, it is added margin, and it is negotiable.",
      },
      {
        q: "How do I get a market adjustment removed?",
        a: "Ask for it to be taken off, get quotes from other dealers, and be ready to walk away. Because the markup has no fixed basis, competition is your strongest tool for removing it.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "paint-and-fabric-protection",
    name: "Paint and fabric protection",
    aka: ["Paint protection", "Fabric protection", "Sealant package", "Environmental package"],
    title:
      "Paint and Fabric Protection Fee: Is It Worth It? | Dealscan",
    description:
      "Dealers upsell paint sealant and fabric protection packages. Learn what they actually deliver, the typical cost, and whether to decline.",
    shortAnswer:
      "Paint and fabric protection is a dealer upsell that applies a sealant to the paint and a stain guard to the interior. The products are inexpensive and the protection is modest, while the charge is often several hundred dollars or more. It is optional and easy to decline.",
    typicalRange: "$200 to $1,000+",
    mandatory: "No, this is an optional add-on",
    negotiable: "Yes",
    whatItIs: [
      "These packages apply an exterior sealant and an interior fabric guard, sometimes branded as an environmental or protection package. Modern factory clear coats and a do-it-yourself spray-on guard already provide most of this protection, so the marginal benefit over normal care is small.",
      "Dealers price these high because they are high-margin add-ons, and the package is sometimes pre-applied so it appears unavoidable. You can decline it before purchase, and even if it is already applied, you can negotiate the charge down or off the total.",
    ],
    watchFor: [
      "A protection package pre-added to the sticker as non-removable",
      "A four-figure charge for products that cost the dealer a fraction of that",
      "Claims that the package is required to keep a warranty valid",
    ],
    faqs: [
      {
        q: "Is dealer paint protection worth it?",
        a: "For most buyers, no. Factory clear coat plus basic care covers most needs, and the dealer charge is far above the product cost. It is reasonable to decline.",
      },
      {
        q: "Can I remove a paint and fabric protection charge?",
        a: "Yes. It is an optional add-on. Decline it before signing, or negotiate it off the price even if the dealer says it is already applied.",
      },
    ],
    updatedAt: "2026-06-14",
  },
  {
    slug: "dealer-advertising-fee",
    name: "Dealer advertising fee",
    aka: ["Ad fee", "Advertising association fee", "Regional ad fee"],
    title:
      "Dealer Advertising Fee: What It Is and Whether to Pay | Dealscan",
    description:
      "A dealer advertising fee passes regional marketing costs to the buyer. Learn when it is a legitimate manufacturer charge and when you can push back.",
    shortAnswer:
      "A dealer advertising fee passes the cost of regional advertising on to you. Sometimes it reflects a real charge the manufacturer bills the dealer for a regional ad group, but often it is general marketing overhead being recovered from the buyer. Whether you can remove it depends on the source.",
    typicalRange: "$200 to $600",
    mandatory: "Sometimes a real manufacturer charge, sometimes padding",
    negotiable: "Sometimes",
    whatItIs: [
      "Many brands run regional advertising associations that bill participating dealers, and some of those charges are passed through on the invoice. When the fee corresponds to a documented manufacturer ad charge on the factory invoice, the dealer has a real cost behind it.",
      "Other times the advertising fee is just the dealer's own marketing budget recovered from buyers, which is ordinary overhead like rent or utilities. Ask the dealer to show whether the fee appears on the factory invoice. If it does not, treat it as negotiable and push to have it reduced or removed.",
    ],
    watchFor: [
      "An advertising fee the dealer cannot tie to the factory invoice",
      "An ad fee stacked on top of an already high documentation fee",
      "An amount well above the typical $200 to $600 range",
    ],
    faqs: [
      {
        q: "Is a dealer advertising fee legitimate?",
        a: "It can be when it reflects a manufacturer regional ad charge shown on the factory invoice. If the dealer cannot document it that way, it is general overhead and you can negotiate it.",
      },
      {
        q: "How do I know if I should pay an advertising fee?",
        a: "Ask to see the fee on the factory invoice. A real pass-through appears there; a fee that does not is the dealer's own marketing cost and is worth pushing back on.",
      },
    ],
    updatedAt: "2026-06-14",
  },
];

export function getDealerFee(slug: string): DealerFee | undefined {
  return dealerFees.find((fee) => fee.slug === slug);
}
