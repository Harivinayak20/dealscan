export type CarModelFaq = {
  q: string;
  a: string;
};

export type CarModel = {
  slug: string;
  make: string;
  model: string;
  years: string;
  quickAnswer: string;
  mileageNote: string;
  knownIssues: string[];
  verify: string[];
  faqs: CarModelFaq[];
  updatedAt: string;
};

export const carModels: CarModel[] = [
  {
    slug: "used-honda-civic",
    make: "Honda",
    model: "Civic",
    years: "2006–2024",
    quickAnswer:
      "A used Honda Civic is one of the safest used-car bets if you match the year to its known issues: 2016–2021 1.5L turbo cars need proof of oil changes because of oil dilution in cold climates, and 2006–2011 cars need the engine block checked for the well-known cracking issue. Clean examples hold value, so a Civic priced far below market deserves extra scrutiny, not excitement.",
    mileageNote:
      "Civics regularly pass 200,000 miles with maintenance. Under 12,000 miles per year is average; high-mileage highway cars with records beat low-mileage cars without them.",
    knownIssues: [
      "2016–2021 1.5T engines: oil dilution in short-trip, cold-climate use — look for documented oil changes and a fuel smell in the oil",
      "2006–2011 (8th gen): engine block cracking near the coolant passage — check for coolant loss history and whether the block was replaced under Honda's extended warranty",
      "2016+ AC condenser and compressor failures — confirm the AC blows cold and ask about repairs",
      "2012–2015 models: largely trouble-free but check CVT fluid service on 2014+ CVT cars",
    ],
    verify: [
      "Oil change records on 1.5T cars (2016–2021)",
      "Coolant level and overheating history on 2006–2011",
      "AC blows cold at idle on a warm day",
      "No aftermarket tune on turbo cars",
    ],
    faqs: [
      {
        q: "Which used Civic years should I avoid?",
        a: "Be most careful with 2006–2011 (block cracking) and early 2016–2018 1.5T cars without oil-change records. 2012–2015 and 2019+ are the safest picks.",
      },
      {
        q: "What mileage is too high for a used Civic?",
        a: "With records, 150,000 miles is not a dealbreaker. Without records, even 80,000 miles is a question mark. Judge maintenance proof before the odometer.",
      },
      {
        q: "Is a used Civic worth the price premium over rivals?",
        a: "Usually yes — resale stays strong because reliability and demand are real. But the premium means overpriced listings are common, so compare against several comps before offering.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-corolla",
    make: "Toyota",
    model: "Corolla",
    years: "2009–2024",
    quickAnswer:
      "A used Toyota Corolla is about as low-risk as used cars get; the main things to check are CVT fluid service on 2014+ cars, oil consumption on 2009–2010 models, and whether the price reflects the car or just the badge. Corollas are frequently overpriced because sellers know the reputation.",
    mileageNote:
      "200,000+ miles is routine with basic maintenance. A 130,000-mile Corolla with records is often a better buy than a 70,000-mile car without them.",
    knownIssues: [
      "2009–2010: oil consumption from piston ring wear on the 2.4L — check oil level and ask about top-offs between changes",
      "2014+ CVT: durable but needs fluid service — ask for proof around 60,000–100,000 miles",
      "2009–2013: electric power steering can feel vague; confirm no warning lights and straight tracking",
      "Excellent overall record means problems usually come from neglect, accidents, or rideshare duty rather than design",
    ],
    verify: [
      "CVT fluid service records on 2014+",
      "Oil level on the dipstick right now (2009–2010 especially)",
      "Signs of rideshare or fleet use: excessive interior wear vs miles",
      "Price against at least three comparable Corollas",
    ],
    faqs: [
      {
        q: "Which used Corolla years should I avoid?",
        a: "There are no truly bad years; 2009–2010 need an oil-consumption check. 2014+ cars need CVT service proof. 2019+ (12th gen) is the strongest pick.",
      },
      {
        q: "What mileage is too high for a used Corolla?",
        a: "Corollas with records are comfortable purchases past 150,000 miles. The bigger risk is a neglected low-mileage example.",
      },
      {
        q: "Why are used Corollas so expensive?",
        a: "Reliability reputation keeps demand high, so sellers price aggressively. Compare comps carefully — paying a fair Corolla price is fine, paying a panic premium is not.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-camry",
    make: "Toyota",
    model: "Camry",
    years: "2007–2024",
    quickAnswer:
      "A used Toyota Camry is a strong buy with two caveats: 2007–2011 four-cylinder cars can burn oil from piston ring wear, and Camrys are heavily used as rideshare and fleet cars, so check the wear-versus-mileage story closely. 2018+ models have an excellent record.",
    mileageNote:
      "Camrys routinely exceed 250,000 miles. Watch for interiors that look more worn than the odometer suggests — a classic rideshare tell.",
    knownIssues: [
      "2007–2011 2.4L (2AZ-FE): oil consumption — check the dipstick and ask directly about oil top-offs",
      "2007–2011: some automatic transmission hesitation complaints; confirm smooth shifts on the test drive",
      "2012–2017: very reliable; main risks are accident history and deferred maintenance",
      "2018+: strong record; verify no rideshare history and that recalls (fuel pump) were completed",
    ],
    verify: [
      "Dipstick oil level and consumption history on 2007–2011",
      "Rideshare/fleet history: title, wear, and the seller's story",
      "Recall completion via the VIN at NHTSA.gov",
      "Smooth, hesitation-free shifts on the drive",
    ],
    faqs: [
      {
        q: "Which used Camry years should I avoid?",
        a: "None are truly bad, but 2007–2011 four-cylinders need an oil-consumption check. 2012+ is the safe zone; 2018+ is the best.",
      },
      {
        q: "What mileage is too high for a used Camry?",
        a: "With maintenance records, 150,000–180,000 miles remains buyable at the right price. Prioritize proof over the number.",
      },
      {
        q: "How do I spot an ex-rideshare Camry?",
        a: "High annual mileage, worn rear seats and door cards, phone-mount marks, and a seller vague about the car's use. It is not automatically a dealbreaker, but it should lower the price.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-honda-accord",
    make: "Honda",
    model: "Accord",
    years: "2008–2024",
    quickAnswer:
      "A used Honda Accord is a top-tier pick if you screen the engine by year: 2008–2012 V6 models with cylinder deactivation (VCM) can burn oil and eat motor mounts, and 2018+ 1.5L turbos need oil-change proof for the same dilution issue as the Civic. The 2013–2017 four-cylinder cars are the sweet spot.",
    mileageNote:
      "Accords commonly run past 200,000 miles. Highway-driven examples with records age very well.",
    knownIssues: [
      "2008–2012 V6 (VCM): oil consumption, fouled plugs, and engine mount wear — ask if a VCM disabler was used and check for misfire history",
      "2018+ 1.5T: oil dilution in cold climates — demand oil-change records",
      "2013–2015 CVT models: generally solid, but confirm CVT fluid service",
      "2008–2010: premature rear brake wear was common; not serious, but check pad life",
    ],
    verify: [
      "Oil consumption and plug history on 2008–2012 V6",
      "Oil-change records on 2018+ 1.5T",
      "CVT service proof on 2013+ four-cylinders",
      "Engine mounts: no clunk on throttle on/off",
    ],
    faqs: [
      {
        q: "Which used Accord years are best?",
        a: "2013–2017 four-cylinder cars hit the reliability sweet spot. 2018+ is excellent too if oil-change records exist for the 1.5T.",
      },
      {
        q: "Is the Accord V6 worth it?",
        a: "It is quick and smooth, but 2008–2012 VCM oil consumption is real. Budget for motor mounts and check plug/misfire history before paying V6 money.",
      },
      {
        q: "What mileage is too high for a used Accord?",
        a: "With records, 150,000+ miles is reasonable at the right price. The transmission service history matters more than the total.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-honda-cr-v",
    make: "Honda",
    model: "CR-V",
    years: "2012–2024",
    quickAnswer:
      "A used Honda CR-V is a dependable family hauler with one headline issue: 2017–2019 1.5L turbo models had widespread oil dilution complaints, especially in cold climates, so oil-change records are non-negotiable on those years. On AWD cars, ask about rear differential fluid service to avoid a noisy rear end.",
    mileageNote:
      "CR-Vs regularly reach 200,000 miles. AWD examples need the rear diff fluid changed every 25,000–30,000 miles to stay quiet.",
    knownIssues: [
      "2017–2019 1.5T: oil dilution (gas in oil) — check for the software update, oil records, and any fuel smell on the dipstick",
      "AWD rear differential: groaning on tight turns means overdue fluid — cheap fix, good negotiation point",
      "2012–2016: vibration complaints at idle on some cars; otherwise very solid",
      "2015–2016: CVT judder reports — confirm smooth low-speed behavior",
    ],
    verify: [
      "Oil-change records and dipstick smell on 2017–2019",
      "Rear diff fluid service on AWD",
      "Smooth CVT behavior from a cold start",
      "AC performance (compressor issues appear on some years)",
    ],
    faqs: [
      {
        q: "Which used CR-V years should I avoid?",
        a: "2017–2019 1.5T cars without oil-change documentation. With records and the software update, they are acceptable; 2020+ and 2012–2016 are safer default picks.",
      },
      {
        q: "Is the CR-V better used than a RAV4?",
        a: "They are close. CR-V interiors are roomier; RAV4 resale is stronger. Buy the better-documented example rather than the badge.",
      },
      {
        q: "What mileage is too high for a used CR-V?",
        a: "150,000 miles with records is fine. On AWD cars, confirm diff service regardless of mileage.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-rav4",
    make: "Toyota",
    model: "RAV4",
    years: "2006–2024",
    quickAnswer:
      "A used Toyota RAV4 is a strong buy with year-specific checks: 2006–2008 2.4L engines can burn oil, 2019–2020 models had low-speed transmission shudder largely fixed by software updates, and strong resale means asking prices often run hot. Verify the update history and compare comps before paying list.",
    mileageNote:
      "200,000 miles is common. Hybrid RAV4s age especially well; verify hybrid battery health indirectly through fuel economy.",
    knownIssues: [
      "2006–2008 2.4L: oil consumption from piston rings — dipstick check and top-off questions",
      "2019–2020: harsh low-speed shifting/shudder — confirm transmission software updates were done",
      "2013–2018: very reliable; main risks are neglect and accident history",
      "2019+: check for fuel pump recall completion via VIN",
    ],
    verify: [
      "Transmission software update history on 2019–2020",
      "Oil level and consumption on 2006–2008",
      "Recall completion via VIN at NHTSA.gov",
      "AWD operation and tire wear evenness",
    ],
    faqs: [
      {
        q: "Which used RAV4 years are best?",
        a: "2013–2018 are dependable and cheaper; 2021+ resolved the early 5th-gen transmission complaints. 2006–2008 need the oil check.",
      },
      {
        q: "Is a used RAV4 Hybrid worth it?",
        a: "Usually yes — better economy and a strong reliability record. Confirm consistent MPG (a tired battery shows up as worse economy) and intact hybrid warranty.",
      },
      {
        q: "Why do used RAV4s cost so much?",
        a: "Demand and resale strength. Never pay a premium without comparing at least three similar listings — overpricing is the RAV4's most common red flag.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ford-f-150",
    make: "Ford",
    model: "F-150",
    years: "2004–2024",
    quickAnswer:
      "A used Ford F-150 can be a great value, but engine choice decides the risk: 2004–2010 5.4L V8s suffer cam phaser and spark plug problems, 2011–2016 3.5L EcoBoosts can have timing chain and turbo issues if oil changes were skipped, and 2018+ 10-speed transmissions should shift cleanly with no clunks. Buy on maintenance proof, not truck pride.",
    mileageNote:
      "Well-maintained F-150s run 250,000+ miles. Towing history matters more than mileage — ask what it pulled and how often.",
    knownIssues: [
      "2004–2010 5.4L 3V: cam phaser rattle, spark plug ejection/breakage — listen for startup rattle",
      "2011–2016 3.5L EcoBoost: timing chain stretch with poor oil history; early intercooler condensation issues",
      "2017+ 10R80 10-speed: some harsh shifts and clunks — test from cold",
      "2015+: aluminum body panels cost more to repair — check accident history closely",
    ],
    verify: [
      "Cold-start listen for rattle (cam phasers/timing chain)",
      "Oil-change cadence on EcoBoost engines",
      "Towing history and hitch wear",
      "Frame and bed mounts for rust in snow states",
    ],
    faqs: [
      {
        q: "Which used F-150 engine is the safest bet?",
        a: "The 5.0L V8 (2011+) has the simplest record. EcoBoosts are fine with documented oil changes; the 2004–2010 5.4L needs a careful cold-start inspection.",
      },
      {
        q: "What mileage is too high for a used F-150?",
        a: "A 150,000-mile highway truck with records beats an 80,000-mile truck that towed heavy every weekend. Ask about use, not just miles.",
      },
      {
        q: "Are aluminum-body F-150s (2015+) a problem?",
        a: "No rust worries, but bodywork costs more after accidents. A clean history report matters more on these trucks.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-chevrolet-silverado-1500",
    make: "Chevrolet",
    model: "Silverado 1500",
    years: "2007–2024",
    quickAnswer:
      "A used Silverado 1500's biggest risk is the 5.3L V8's Active Fuel Management (AFM) lifter failures and oil consumption, which span roughly 2007–2021. Listen for ticking, check oil consumption history, and on 2015–2021 eight-speed trucks confirm the transmission shudder fix was applied.",
    mileageNote:
      "300,000-mile Silverados exist, but AFM-related engine work often appears between 80,000–150,000 miles when oil changes were stretched.",
    knownIssues: [
      "5.3L AFM/DFM lifter failure: ticking, misfires, check-engine light — the signature Silverado problem",
      "2007–2013 5.3L: oil consumption from AFM oil spray — check level and top-off habits",
      "2015–2021 8-speed: torque converter shudder — ask if the fluid-flush TSB was performed",
      "Interior electronics and HVAC blend door actuators clicking on 2014+",
    ],
    verify: [
      "Cold-start listen for lifter tick",
      "Oil level and consumption story",
      "8-speed shudder fix documentation (2015–2021)",
      "Frame rust in snow states",
    ],
    faqs: [
      {
        q: "Which used Silverado years should I avoid?",
        a: "No year is automatically off-limits, but any 5.3L without records is a gamble. The 6.2L and trucks with documented lifter/AFM work already done are safer.",
      },
      {
        q: "What does an AFM lifter failure cost?",
        a: "Commonly $2,000–$4,500 depending on shop and scope. Price that risk into any high-mileage 5.3L without engine work history.",
      },
      {
        q: "Silverado or F-150 used?",
        a: "Both are fine bought right. Judge the specific truck: maintenance records, rust, towing history, and how it starts cold beat brand loyalty.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ram-1500",
    make: "Ram",
    model: "1500",
    years: "2009–2024",
    quickAnswer:
      "A used Ram 1500 rides and tows well, but check three things: the 5.7L Hemi's lifter/cam 'Hemi tick' history, the optional air suspension (expensive when it fails), and rust on pre-2019 trucks in snow states. A quiet cold start and working suspension modes are worth more than a detailed interior.",
    mileageNote:
      "Hemis with 6-quart oil-change discipline go 250,000+ miles. Air suspension repairs commonly appear after 80,000 miles.",
    knownIssues: [
      "5.7L Hemi: lifter and camshaft wear ('Hemi tick') — a consistent tick that changes with RPM is the warning",
      "Air suspension (2013+ optional): compressor and air spring failures — test all height modes",
      "Exhaust manifold bolts breaking on Hemis: ticking at cold start that fades when warm",
      "2009–2018: rear window and cab corner leaks/rust — check the carpet and rear cab seams",
    ],
    verify: [
      "Cold-start tick assessment (manifold vs lifter)",
      "All air-suspension modes cycle correctly",
      "Underbody rust inspection",
      "Oil-change records with correct intervals",
    ],
    faqs: [
      {
        q: "Is the Hemi tick a dealbreaker?",
        a: "A tick that disappears as the engine warms is often manifold bolts (cheap-ish). A persistent tick at all temps can be lifters — that is walk-away or big-discount territory.",
      },
      {
        q: "Should I avoid the air suspension?",
        a: "It rides beautifully but adds $1,500–$4,000 repair exposure out of warranty. Coil-spring trucks are the lower-risk used buy.",
      },
      {
        q: "Which used Ram years are best?",
        a: "2019+ (5th gen) has the nicest cabin and fewer rust complaints; well-kept 2013–2018 trucks are the value play with the checks above.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-nissan-altima",
    make: "Nissan",
    model: "Altima",
    years: "2013–2024",
    quickAnswer:
      "Used Nissan Altimas are cheap for a reason: the 2013–2016 CVT transmissions fail often enough that a CVT service history is the single most important document the seller can show you. A discounted Altima with CVT records and a smooth, whine-free test drive can still be a sensible budget buy.",
    mileageNote:
      "Engines are durable, but unserviced CVTs often fail between 60,000–120,000 miles. Fluid changes every 30,000–40,000 miles are the survival factor.",
    knownIssues: [
      "2013–2016 CVT: shudder, whine, overheating and failure — the defining issue; warranty was extended on some years",
      "2017+: improved but still service-dependent — fluid records matter",
      "Hood latch and passenger airbag sensor recalls on several years — check VIN",
      "Interior wear runs ahead of mileage on rental/fleet examples — Altimas were heavily fleeted",
    ],
    verify: [
      "CVT fluid service records (non-negotiable)",
      "Extended test drive: no shudder at low speed, no whine at highway speed",
      "Rental/fleet history on the title and history report",
      "Recall completion via VIN",
    ],
    faqs: [
      {
        q: "Should I buy a used Altima at all?",
        a: "Yes, if the price reflects the CVT risk and records exist. The discount versus a Camry or Accord is real; just budget for the transmission's service needs.",
      },
      {
        q: "How much does an Altima CVT replacement cost?",
        a: "Typically $3,500–$5,000 installed. That number should anchor your negotiation on any car without CVT service proof.",
      },
      {
        q: "Which Altima years are safest?",
        a: "2019+ has the better record. For older cars, choose on documentation, not year — a 2014 with three fluid services beats a 2017 with none.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-nissan-rogue",
    make: "Nissan",
    model: "Rogue",
    years: "2014–2024",
    quickAnswer:
      "The used Nissan Rogue's story is the same as the Altima's: CVT reliability decides everything, with 2014–2016 the riskiest years. Demand CVT fluid records, take a long test drive listening for whine and shudder, and price any undocumented car as if a transmission is in its future.",
    mileageNote:
      "With CVT fluid changes every 30,000–40,000 miles, Rogues are fine daily drivers; without them, 70,000–120,000 miles is the common failure window.",
    knownIssues: [
      "2014–2016 CVT: failure-prone — extended warranties applied to some; check what was done",
      "2017–2020: improved CVT but service-dependent",
      "2021+: new generation with a stronger early record; engine uses a variable-compression design on some trims — verify oil history",
      "AEB (automatic emergency braking) false-activation complaints on 2017–2018 — check recalls and software updates",
    ],
    verify: [
      "CVT service documentation",
      "30+ minute test drive including highway speeds",
      "Recall and software update completion",
      "AWD engagement and tire wear",
    ],
    faqs: [
      {
        q: "Which used Rogue years should I avoid?",
        a: "2014–2016 without transmission documentation. 2021+ is the most confident pick if the budget allows.",
      },
      {
        q: "Is a used Rogue cheaper to buy than a RAV4 or CR-V for a reason?",
        a: "Yes — the market prices in CVT risk and softer resale. Bought with records at the discounted price, it is rational; bought blind, it is a gamble.",
      },
      {
        q: "What does a Rogue CVT replacement cost?",
        a: "Around $3,500–$5,000. Use that as your negotiation anchor when records are missing.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-hyundai-elantra",
    make: "Hyundai",
    model: "Elantra",
    years: "2011–2024",
    quickAnswer:
      "A used Hyundai Elantra is a budget-friendly buy with two big checks: engine health on 2011–2016 cars (ticking, oil consumption, and related recalls) and the theft problem — 2011–2021 cars with key-start ignitions lack immobilizers, are targeted by thieves, and can carry higher insurance. Confirm the anti-theft software update and get an insurance quote before you buy.",
    mileageNote:
      "120,000+ miles is fine with records; listen for engine tick at idle on 2011–2016 cars regardless of mileage.",
    knownIssues: [
      "2011–2016: engine ticking/knock and oil consumption complaints — cold-start listen and dipstick check",
      "2011–2021 key-start cars: no immobilizer — theft target ('Kia Boyz' wave); anti-theft software update available",
      "Insurance carriers surcharge or decline some affected years — quote insurance before buying",
      "2017+: better record; verify recalls completed via VIN",
    ],
    verify: [
      "Anti-theft software update sticker/documentation",
      "Insurance quote on the exact VIN",
      "Cold-start engine listen",
      "Recall completion at NHTSA.gov",
    ],
    faqs: [
      {
        q: "Is the Elantra theft problem real?",
        a: "Yes — key-start 2011–2021 Hyundais lack immobilizers and theft rates spiked. The free software update plus a steering lock largely addresses it, but verify insurance costs first.",
      },
      {
        q: "Which used Elantra years are best?",
        a: "2017–2020 with the anti-theft update done, or 2021+ (new generation, push-button cars have immobilizers).",
      },
      {
        q: "What engine noise should worry me?",
        a: "A metallic tick or knock at idle on 2011–2016 cars. Walk away or price in an engine — related failures were common enough to trigger recalls and extended warranties.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-hyundai-sonata",
    make: "Hyundai",
    model: "Sonata",
    years: "2011–2024",
    quickAnswer:
      "On a used Hyundai Sonata, the 2011–2014 2.0T and 2.4L Theta II engines are the headline risk — failures led to recalls, a class action, and extended warranties, so proof of the knock-sensor update and any engine replacement is essential. Add the same immobilizer/theft check as other key-start Hyundais of 2011–2019.",
    mileageNote:
      "A 2011–2014 with an engine already replaced under warranty is arguably safer than an untouched original. Records decide everything here.",
    knownIssues: [
      "2011–2014 Theta II engines: rod-bearing failure — recall 'knock sensor detection' update and many engines replaced under extended warranty",
      "2011–2019 key-start cars: immobilizer/theft issue — software update and insurance check",
      "2015–2019: improved but still verify recall completion",
      "2020+: strong record; check for any open campaigns via VIN",
    ],
    verify: [
      "Engine replacement or knock-sensor update documentation",
      "VIN recall lookup at NHTSA.gov",
      "Anti-theft update on key-start cars",
      "Cold-start listen for knock",
    ],
    faqs: [
      {
        q: "Should I avoid 2011–2014 Sonatas entirely?",
        a: "Not necessarily — one with a documented replacement engine and remaining extended warranty can be a value play. Avoid undocumented originals.",
      },
      {
        q: "Does the engine warranty transfer to me?",
        a: "Hyundai's Theta II extended coverage generally follows the car, but conditions apply. Confirm with a dealer using the VIN before purchase.",
      },
      {
        q: "Which used Sonata years are safest?",
        a: "2020+ for the cleanest record; 2015–2019 with completed recalls and the anti-theft update as the value pick.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ford-escape",
    make: "Ford",
    model: "Escape",
    years: "2013–2024",
    quickAnswer:
      "Used Ford Escapes are cheap, and the risk is concentrated in 2013–2016: the 1.6L EcoBoost had coolant-leak and fire recalls, the 2.0L can develop coolant intrusion, and multiple recalls hit those years. Run the VIN through NHTSA, verify cooling system work, and prefer 2017+ or the 2.5L non-turbo engine for lower risk.",
    mileageNote:
      "The 2.5L non-turbo is the long-haul engine. EcoBoost cars need coolant and oil history to be trusted past 100,000 miles.",
    knownIssues: [
      "2013–2016 1.6T: coolant leaks and fire-related recalls — VIN check is mandatory",
      "1.5T/2.0T: coolant intrusion into cylinders on some engines — white exhaust smoke and coolant loss are the signs",
      "2013–2016: multiple recalls (doors, steering) — confirm all completed",
      "2020+: early-build quality complaints; verify software updates done",
    ],
    verify: [
      "Full recall history via VIN at NHTSA.gov",
      "Coolant level, overflow tank condition, and any loss history",
      "White smoke at cold start (coolant intrusion sign)",
      "Service records on turbo engines",
    ],
    faqs: [
      {
        q: "Which used Escape years should I avoid?",
        a: "2013–2016 EcoBoost cars without complete recall and cooling-system documentation. 2017–2019 with the 2.5L is the safe value pick.",
      },
      {
        q: "Why are used Escapes so cheap?",
        a: "Soft resale from the issues above and heavy fleet/rental use. That makes a documented, recall-complete Escape a genuine bargain — and an undocumented one a trap.",
      },
      {
        q: "What is coolant intrusion and how do I check?",
        a: "Coolant seeping into cylinders, eventually damaging the engine. Look for coolant loss without visible leaks, white sweet-smelling exhaust at startup, and misfire codes.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ford-explorer",
    make: "Ford",
    model: "Explorer",
    years: "2011–2024",
    quickAnswer:
      "The used Ford Explorer's defining problem is the 2011–2019 3.5L V6's internal water pump: it is driven by the timing chain, and when it fails coolant can mix with oil, turning a $60 part into a $2,500–$4,500 job. Verify cooling history and listen for whine; on 2020+ confirm early-build recalls were handled.",
    mileageNote:
      "Internal water pump failures cluster around 100,000–150,000 miles on 2011–2019 V6s. A documented replacement is a strong plus on a high-mileage Explorer.",
    knownIssues: [
      "2011–2019 3.5L V6: internal (timing-cover) water pump failure — coolant loss, overheating, or milky oil are late-stage signs",
      "PTU (power transfer unit) on AWD models: fluid neglect leads to whine and failure — ask about PTU service",
      "2011–2017: exhaust odor in cabin complaints — confirm any TSB work",
      "2020+: first-year quality issues and recalls — verify completion via VIN",
    ],
    verify: [
      "Cooling system history and oil condition (no milkiness)",
      "PTU fluid service on AWD",
      "Recall completion via VIN",
      "Whine from the engine front at idle and revs",
    ],
    faqs: [
      {
        q: "Is the internal water pump reason to skip the Explorer?",
        a: "Not if priced in. A car with a documented pump replacement is de-risked; an original-pump car past 120,000 miles should be discounted accordingly.",
      },
      {
        q: "Which used Explorer years are best?",
        a: "2016–2019 with cooling and PTU records, or 2021+ once early recalls were completed.",
      },
      {
        q: "What does PTU service cost versus failure?",
        a: "A fluid change is around $150–$250; a failed PTU is $1,500–$3,000. Ask when it was last serviced — most owners never have.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-chevrolet-equinox",
    make: "Chevrolet",
    model: "Equinox",
    years: "2010–2024",
    quickAnswer:
      "The used Equinox to be careful with is any 2010–2017 with the 2.4L engine: oil consumption from piston-ring wear is widespread, can starve the timing chain, and led to extended coverage and lawsuits. Check the dipstick, demand consumption history, and prefer the 2018+ generation or a documented ring-replacement car.",
    mileageNote:
      "2.4L oil burners often show trouble by 80,000–120,000 miles. The 2018+ 1.5T generation has a cleaner record with routine maintenance.",
    knownIssues: [
      "2010–2017 2.4L: oil consumption — the defining issue; some engines got new pistons/rings under extended coverage",
      "Timing chain wear secondary to low oil — rattle at cold start is a red flag",
      "2018+ 1.5T: generally solid; verify oil-change cadence",
      "Check recalls via VIN on all years",
    ],
    verify: [
      "Dipstick level right now plus top-off history",
      "Any piston/ring repair documentation",
      "Cold-start rattle listen",
      "Recall completion via VIN",
    ],
    faqs: [
      {
        q: "Which used Equinox years should I avoid?",
        a: "2010–2017 2.4L cars without oil-consumption documentation. The 2018+ generation is the safer default.",
      },
      {
        q: "How do I test for oil consumption before buying?",
        a: "Check the dipstick cold, ask directly how much oil gets added between changes, and look for consumption notes in service records. A seller who 'tops off regularly' has answered your question.",
      },
      {
        q: "Is a cheap Equinox still worth it?",
        a: "A documented 2.4L with rings already replaced, or a 2018+, can be a genuine value. An undocumented 2.4L is only worth a price that assumes engine work.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-tacoma",
    make: "Toyota",
    model: "Tacoma",
    years: "2005–2024",
    quickAnswer:
      "Used Tacomas hold value so well that the main risks are overpaying and frame rust: 2005–2010 trucks had a frame-corrosion recall (some frames replaced outright), so inspect the frame and ask whether it was replaced. Mechanically they are excellent; financially, compare comps hard because 'Tacoma tax' pricing is real.",
    mileageNote:
      "300,000-mile Tacomas are common. A rust-free frame matters more than the odometer reading.",
    knownIssues: [
      "2005–2010: frame rust/perforation — recall included frame replacement on qualifying trucks; check for documentation",
      "2016–2017 V6: some transmission shift-flare complaints — software updates addressed most",
      "Leaf spring recalls on some years — VIN check",
      "Resale premium means overpriced and scam listings cluster around this model",
    ],
    verify: [
      "Frame inspection on a lift (or photos underneath)",
      "Frame replacement documentation on 2005–2010",
      "VIN recall lookup",
      "Comp pricing across several listings — beware bait pricing",
    ],
    faqs: [
      {
        q: "What is the 'Tacoma tax'?",
        a: "The resale premium buyers pay for Tacoma reliability. It is real, but it also attracts fake listings priced 'reasonably' to harvest deposits — verify hard on any below-market Tacoma.",
      },
      {
        q: "Which used Tacoma years are best?",
        a: "2012–2015 hits a value sweet spot; 2005–2010 only with a documented replaced or rust-free frame; 2016+ after confirming transmission updates.",
      },
      {
        q: "Is high mileage okay on a Tacoma?",
        a: "Yes — with records, 150,000–200,000 miles is normal Tacoma middle age. Frame condition and maintenance proof set the price.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-jeep-wrangler",
    make: "Jeep",
    model: "Wrangler",
    years: "2007–2024",
    quickAnswer:
      "A used Wrangler needs a different checklist than a normal car: look for 'death wobble' (violent steering shake after bumps at highway speed) on lifted or worn-suspension Jeeps, frame and underbody rust, off-road abuse, and on 2018+ JLs confirm steering-damper recall work. Modifications are the biggest wildcard — stock and documented beats built and mysterious.",
    mileageNote:
      "The 3.6L V6 (2012+) is durable; what kills Wranglers is rust, water crossings, and hard off-road use, none of which show on the odometer.",
    knownIssues: [
      "Death wobble: solid front axle plus worn track bar/dampers — test at 55+ mph over imperfect pavement",
      "Frame and skid plate rust, especially 2007–2017 in snow states",
      "2018+ JL: steering feel complaints and damper recall — verify completion",
      "2012–2018 3.6L: oil cooler housing leaks — check for oil around the engine valley",
    ],
    verify: [
      "Highway test drive over bumps (wobble check)",
      "Underbody: rust, dents, skid plate scars, water lines",
      "Lift kit quality and alignment records if modified",
      "4WD engagement high and low range",
    ],
    faqs: [
      {
        q: "Should I avoid modified Wranglers?",
        a: "Not always — quality lifts with documentation are fine. Avoid cheap lifts, mismatched tires, and any seller who cannot say who installed what.",
      },
      {
        q: "What is death wobble and is it fixable?",
        a: "A violent front-end oscillation triggered by bumps, usually from worn track bar bushings or steering dampers. Fixable for hundreds, not thousands — but it signals deferred maintenance.",
      },
      {
        q: "Which used Wrangler years are best?",
        a: "2012–2017 JK with the 3.6L for value; 2019+ JL after recall work for refinement. Inspect the specific Jeep — condition variance is huge.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-subaru-outback",
    make: "Subaru",
    model: "Outback",
    years: "2010–2024",
    quickAnswer:
      "On a used Subaru Outback, the era determines the check: 2010–2012 2.5L engines carry the classic head-gasket and oil-consumption risks, 2013–2015 had piston-ring oil consumption (class action and extended coverage), and CVT cars should have fluid service plus Subaru's extended CVT warranty history verified. AWD also means four matched tires — uneven tread is a real cost.",
    mileageNote:
      "200,000-mile Outbacks are common in Subaru country. Oil consumption history and CVT service matter more than mileage.",
    knownIssues: [
      "2013–2015 FB25: oil consumption — extended warranty applied; check for the oil-consumption test paperwork",
      "2010–2012 EJ25: head gasket seepage — look for oil/coolant residue on the block edges",
      "CVT (2010+): service-dependent; Subaru extended CVT coverage on many years",
      "AWD requires matched tires — measure tread depth on all four",
    ],
    verify: [
      "Oil consumption test/repair records (2013–2015)",
      "Head gasket edges for seepage (2010–2012)",
      "CVT fluid service and warranty status",
      "Four tires of matching brand and tread depth",
    ],
    faqs: [
      {
        q: "Which used Outback years are safest?",
        a: "2016–2019 after the ring fix, with CVT service records, or 2020+. 2013–2015 only with consumption paperwork.",
      },
      {
        q: "Why do matched tires matter on a Subaru?",
        a: "Symmetrical AWD is sensitive to circumference differences; mismatched tires can damage the drivetrain. Budget four tires if tread varies more than ~2/32\".",
      },
      {
        q: "Are Outback head gaskets still a thing?",
        a: "Mostly a 2000s–2012 EJ25 story. The FB engines shifted the risk to oil consumption instead — different check, same lesson: records first.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-tesla-model-3",
    make: "Tesla",
    model: "Model 3",
    years: "2018–2024",
    quickAnswer:
      "A used Tesla Model 3 is mostly a battery-and-software purchase: check degradation by charging to 100% and comparing indicated range to the original spec (under ~10% loss is normal, over ~15% deserves a discount), and confirm how much battery/drive-unit warranty (8 years, 100k–120k miles) remains. Then inspect the usual early-build items: panel gaps, suspension fore links, and screen condition.",
    mileageNote:
      "Drivetrains age well; battery calendar age and fast-charging habits matter more than miles. A 60,000-mile car with 95% range health is a strong buy.",
    knownIssues: [
      "Battery degradation: verify with a 100% charge range reading versus original EPA spec",
      "2018–2019 builds: panel alignment, paint thinness, and trim issues — inspect in good light",
      "Front suspension fore links and upper control arms: clunks and creaks over bumps",
      "Check for salvage/flood history carefully — wrecked Teslas are commonly rebuilt and can lose Supercharging access",
    ],
    verify: [
      "Range at 100% charge vs original spec",
      "Remaining battery/drive-unit warranty by VIN",
      "Salvage/rebuilt history (affects warranty and Supercharging)",
      "Software/account transfer and any FSD package status in writing",
    ],
    faqs: [
      {
        q: "How much battery degradation is normal?",
        a: "Roughly 5–10% in the first years, then a slow plateau. Over 15% on a young car suggests heavy fast-charging or a tired pack — negotiate or pass.",
      },
      {
        q: "Does the warranty transfer to me?",
        a: "The remaining battery/drive-unit warranty follows the car for private sales, but salvage titles void it. Verify status with the VIN before paying.",
      },
      {
        q: "Do paid software features like FSD come with the car?",
        a: "Not reliably — Tesla ties some features to the account and has removed them on resale. Get what is included confirmed in the car's software screen, not the seller's word.",
      },
    ],
    updatedAt: "2026-06-12",
  },
];

export function getCarModel(slug: string) {
  return carModels.find((m) => m.slug === slug);
}
