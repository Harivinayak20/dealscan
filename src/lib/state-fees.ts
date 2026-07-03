// Per-state used-car buying fees: doc fee caps/typicals, vehicle sales tax,
// title fee, and what to watch for. Figures are typical published amounts as of
// mid-2026 and are shown as estimates on the page; each page tells the reader
// to verify with their state DMV. Targets "dealer fees in [state]" queries.

export type StateFee = {
  slug: string;
  name: string;
  docFee: string; // cap or typical, one line
  capped: "Yes" | "No" | "Partially";
  salesTax: string; // state vehicle sales/excise tax, one line
  titleFee: string;
  regNote: string; // registration cost note
  watchFor: string;
  updatedAt: string;
};

const UPDATED = "2026-07-03";

const s = (
  slug: string,
  name: string,
  docFee: string,
  capped: StateFee["capped"],
  salesTax: string,
  titleFee: string,
  regNote: string,
  watchFor: string,
): StateFee => ({ slug, name, docFee, capped, salesTax, titleFee, regNote, watchFor, updatedAt: UPDATED });

export const stateFees: StateFee[] = [
  s("alabama", "Alabama", "No cap; ~$300–$500 typical", "No", "2% state + local (often 3–5% total)", "~$18", "Based on vehicle weight; ~$23–$105/yr", "Uncapped doc fees vary dealer to dealer — compare out-the-door quotes, not sticker prices."),
  s("alaska", "Alaska", "No cap; ~$200–$400 typical", "No", "No state sales tax (local tax possible)", "~$15", "~$100 biennial for cars", "No state sales tax makes add-ons the main padding — question every line item."),
  s("arizona", "Arizona", "No cap; ~$400–$500 typical", "No", "5.6% state + local", "~$4", "Vehicle license tax based on value, paid yearly", "The vehicle license tax is real and recurring — budget it before agreeing to a payment."),
  s("arkansas", "Arkansas", "No cap; ~$100–$150 typical", "No", "6.5% state + local", "~$10", "~$17–$30/yr by weight", "Buyers pay sales tax directly to the state after private-party purchases — don't let it surprise you."),
  s("california", "California", "Capped at $85", "Yes", "7.25% state + local (often 8–10% total)", "~$28", "Value-based registration; several hundred $/yr on newer cars", "The doc fee is capped, so profit moves to add-ons: theft etch, paint protection, nitrogen. Decline them."),
  s("colorado", "Colorado", "No cap; ~$500–$700 typical", "No", "2.9% state + local (often 7%+ total)", "~$7", "Ownership tax based on age and value", "One of the higher typical doc fees — negotiate the total price to offset it."),
  s("connecticut", "Connecticut", "No cap; ~$500–$700 typical", "No", "6.35% (7.75% over $50k)", "~$25", "~$120 biennial", "High uncapped doc fees; ask for the out-the-door figure in writing before visiting."),
  s("delaware", "Delaware", "No cap; ~$300–$500 typical", "No", "No sales tax; 4.25% document fee on price instead", "~$35", "~$40/yr", "The state's own 4.25% 'document fee' is a tax — don't confuse it with the dealer's doc fee, which is separate."),
  s("florida", "Florida", "No cap; ~$700–$1,000 typical", "No", "6% state + county surtax", "~$78", "~$28–$46/yr + one-time $225 new-plate fee", "Among the highest doc fees in the country, plus common 'dealer prep' and 'electronic filing' duplicates."),
  s("georgia", "Georgia", "No cap; ~$500–$800 typical", "No", "No sales tax; 7% one-time Title Ad Valorem Tax (TAVT)", "~$18", "~$20/yr", "TAVT is 7% of the car's value up front — factor it into every budget alongside the big doc fee."),
  s("hawaii", "Hawaii", "No cap; ~$200–$400 typical", "No", "4% state + county surcharge", "~$5", "Weight-based; ~$45–$75/yr+", "Island shipping charges on dealer stock can be padded — ask for documentation."),
  s("idaho", "Idaho", "No cap; ~$300–$500 typical", "No", "6%", "~$14", "~$45–$69/yr by age", "Watch for pre-installed add-on packages rolled into the advertised price."),
  s("illinois", "Illinois", "Capped (indexed yearly; ~$360)", "Yes", "6.25% state + local", "~$165", "~$151/yr", "The cap is adjusted each year — verify the current maximum and don't pay above it."),
  s("indiana", "Indiana", "No cap; ~$200–$300 typical", "No", "7%", "~$15", "~$21/yr + excise tax by value/age", "Ask whether the advertised price already includes the doc fee — Indiana dealers vary."),
  s("iowa", "Iowa", "Capped at $180", "Yes", "5% one-time registration fee on price", "~$25", "Value + weight based, paid yearly", "Anything above the $180 cap on the doc line is an error — make them fix it."),
  s("kansas", "Kansas", "No cap; ~$400–$500 typical", "No", "6.5% state + local", "~$10", "~$30–$45/yr + property tax on the vehicle", "Vehicle property tax is due at registration — get an estimate before you buy."),
  s("kentucky", "Kentucky", "No cap; ~$300–$450 typical", "No", "6% motor vehicle usage tax", "~$9", "~$21/yr + property tax", "Usage tax is calculated on retail value, not always your price — check the number used."),
  s("louisiana", "Louisiana", "Capped (~$425)", "Yes", "4.45% state + local (often 9%+ total)", "~$68", "~$20–$82/yr by value", "Local parish taxes stack high — the tax line should still match your parish's published rate."),
  s("maine", "Maine", "No cap; ~$400–$500 typical", "No", "5.5%", "~$33", "~$35/yr + local excise tax by value", "Local excise tax is owed at town offices at registration — budget several hundred dollars on newer cars."),
  s("maryland", "Maryland", "Capped at $500", "Yes", "6% excise tax on price/value", "~$100", "~$135–$187 biennial", "Dealers charge up to the $500 cap almost universally — offset it in the negotiated price."),
  s("massachusetts", "Massachusetts", "No cap; ~$400–$600 typical", "No", "6.25%", "~$75", "~$60 biennial + local excise tax", "Annual local excise tax ($25 per $1,000 of value) continues every year you own the car."),
  s("michigan", "Michigan", "Capped (5% of price, max ~$260)", "Yes", "6%", "~$15", "Value-based, paid yearly", "The cap scales with price up to the maximum — a $260 doc fee on a cheap car is over the legal limit."),
  s("minnesota", "Minnesota", "Capped (~$125)", "Yes", "6.875% motor vehicle sales tax", "~$8+", "Value-based; drops as the car ages", "One of the friendlier doc-fee states — pressure to add 'processing' fees on top is a red flag."),
  s("mississippi", "Mississippi", "No cap; ~$300–$450 typical", "No", "5% on vehicles", "~$9", "~$14/yr + ad valorem tax", "Ad valorem tax at registration surprises many buyers — ask the county for an estimate."),
  s("missouri", "Missouri", "Capped (~$565, indexed)", "Yes", "4.225% state + local", "~$8.50", "~$24–$87/yr by horsepower", "You pay sales tax at the DMV within 30 days, not at the dealer — set the money aside."),
  s("montana", "Montana", "No cap; ~$300–$400 typical", "No", "No state sales tax", "~$12", "Age-based; ~$28–$217/yr", "No sales tax attracts out-of-state schemes — registering here without residency can be tax evasion in your home state."),
  s("nebraska", "Nebraska", "No cap; ~$300–$400 typical", "No", "5.5% state + local", "~$10", "~$15/yr + motor vehicle tax by value/age", "Motor vehicle tax is owed yearly at the county — check the schedule for your model year."),
  s("nevada", "Nevada", "No cap; ~$500–$600 typical", "No", "6.85% state + local (often 8%+ total)", "~$29", "$33/yr + governmental services tax by value", "High doc fees plus value-based yearly tax — get the full out-the-door and first-year registration estimate."),
  s("new-hampshire", "New Hampshire", "No cap; ~$400–$500 typical", "No", "No state sales tax", "~$25", "Town + state fees by weight/value; ~$60–$600/yr", "No sales tax, but town registration fees on newer cars are substantial — call your town clerk first."),
  s("new-jersey", "New Jersey", "No cap; ~$400–$700 typical", "No", "6.625%", "~$60", "~$35–$85/yr by weight/age", "Doc fees run high and are often presented as fixed — they are dealer profit; negotiate the total."),
  s("new-mexico", "New Mexico", "No cap; ~$300–$400 typical", "No", "4% motor vehicle excise tax", "~$5+", "~$27–$62/yr", "The excise tax applies to the price paid — make sure trade-in credit is applied before tax where eligible."),
  s("new-york", "New York", "Capped at $175", "Yes", "4% state + local (often 8%+ total)", "~$50", "Weight-based; ~$26–$140 biennial", "The doc fee is capped at $175 — anything higher on the contract is illegal. Watch add-ons instead."),
  s("north-carolina", "North Carolina", "No cap; ~$600–$800 typical", "No", "3% highway-use tax", "~$56", "~$38/yr + property tax", "Low 3% tax but among the highest doc fees — the out-the-door comparison matters more than the tax rate."),
  s("north-dakota", "North Dakota", "No cap; ~$200–$300 typical", "No", "5% motor vehicle excise tax", "~$5", "Weight/age-based; ~$49–$274/yr", "Modest fees overall; a doc fee above ~$300 here is above market."),
  s("ohio", "Ohio", "Capped ($250 or 10% of price, whichever is less)", "Yes", "5.75% state + local", "~$15", "~$31/yr + local permissive tax", "On a car under $2,500 the cap is 10% of price — the flat $250 would be over the limit."),
  s("oklahoma", "Oklahoma", "No cap; ~$300–$400 typical", "No", "1.25% sales tax + 3.25% excise tax", "~$11", "Age-based; ~$26–$96/yr", "The combined 4.5% tax is calculated at the tag agency — verify the value they use."),
  s("oregon", "Oregon", "Capped ($150 with e-filing, $115 without)", "Yes", "No sales tax; 0.5% vehicle use tax on newer cars", "~$101–$192", "~$126–$316 per 2-year period", "No sales tax makes Oregon quotes look cheap — compare title/registration, which run higher than most states."),
  s("pennsylvania", "Pennsylvania", "Capped (~$144, indexed; higher for e-filing)", "Yes", "6% state (7–8% in Allegheny/Philadelphia)", "~$67", "~$45/yr", "The cap adjusts periodically — verify the current maximum before signing."),
  s("rhode-island", "Rhode Island", "No cap; ~$400–$500 typical", "No", "7%", "~$54", "~$30–$60/yr by weight", "7% flat tax plus uncapped doc fee — always negotiate on the out-the-door number."),
  s("south-carolina", "South Carolina", "No cap; ~$400–$500 typical", "No", "5% capped at $500 (Infrastructure Maintenance Fee)", "~$15", "~$40 biennial + property tax", "The sales-tax side is capped at $500, so dealers make it up on doc and closing fees — push back there."),
  s("south-dakota", "South Dakota", "No cap; ~$200–$300 typical", "No", "4% motor vehicle excise tax", "~$10", "Weight-based; ~$36–$144/yr", "Low-tax state; a doc fee creeping toward $500 is out of line with local norms."),
  s("tennessee", "Tennessee", "No cap; ~$400–$600 typical", "No", "7% state + local (capped local portion)", "~$14", "~$29/yr + county wheel tax", "County wheel taxes vary widely — check yours before comparing quotes across county lines."),
  s("texas", "Texas", "No cap; ~$150–$250 typical", "No", "6.25% motor vehicle sales tax", "~$33", "~$51–$54/yr + local fees", "Texas doc fees are modest by law of the market — but 'dealer inventory tax' passed to you as a line item is negotiable."),
  s("utah", "Utah", "No cap; ~$300–$400 typical", "No", "4.85% state + local (often 7%+ total)", "~$6", "Age-based uniform fee; ~$10–$150/yr", "Verify whether advertised prices include the doc fee — practices vary across the Wasatch Front."),
  s("vermont", "Vermont", "No cap; ~$200–$300 typical", "No", "6% purchase and use tax", "~$35", "~$76–$132/yr", "Tax is assessed on NADA average value if you paid less — bring proof of price for unusual deals."),
  s("virginia", "Virginia", "No cap; ~$700–$900 typical", "No", "4.15% motor vehicle sales tax (minimum $75)", "~$15", "~$31–$46/yr + local property tax", "Routinely the highest doc ('processing') fees in the country, plus yearly car property tax — budget both."),
  s("washington", "Washington", "Capped at $200", "Yes", "6.5% state + local + 0.3% motor vehicle tax", "~$15", "~$30/yr + RTA excise tax in Sound Transit counties", "RTA excise tax in the Seattle area adds hundreds per year on newer cars — check your address's rate."),
  s("west-virginia", "West Virginia", "Capped (~$175)", "Yes", "6% sales tax on vehicles", "~$15", "~$51.50/yr + property tax", "A doc fee above the cap is a compliance problem — point it out and it disappears."),
  s("wisconsin", "Wisconsin", "No cap; ~$200–$400 typical", "No", "5% state + county", "~$164.50", "~$85/yr", "Title fee is one of the nation's highest — it's a state charge, not dealer padding, but verify the exact amount."),
  s("wyoming", "Wyoming", "No cap; ~$300–$400 typical", "No", "4% state + county", "~$15", "County fee by value + $30 state fee", "County registration fees on newer vehicles are significant — get the county's estimate before buying."),
];

export function getStateFee(slug: string) {
  return stateFees.find((entry) => entry.slug === slug);
}
