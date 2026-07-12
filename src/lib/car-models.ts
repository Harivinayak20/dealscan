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
  {
    slug: "used-toyota-highlander",
    make: "Toyota",
    model: "Highlander",
    years: "2008–2024",
    quickAnswer:
      "A used Toyota Highlander is one of the most dependable three-row SUVs you can buy, and the known issues are cheap to check: oil cooler line leaks on 2008–2013 V6 models, water pump seepage on the same engine, and a slightly hesitant 8-speed automatic on 2017–2019 cars that is annoying rather than fatal. The bigger risk is price — Highlanders carry a strong reputation premium, so verify the condition matches the asking price.",
    mileageNote:
      "The 3.5L V6 routinely clears 250,000 miles. A 140,000-mile Highlander with dealer records is a safer buy than an 80,000-mile one with none. Hybrids age well too, but ask about hybrid battery health past 150,000 miles.",
    knownIssues: [
      "2008–2013 V6: rubber oil cooler line can rupture and dump oil — check for the updated metal line and any oil loss history",
      "2GR-FE V6 water pump weeps coolant with age — look for pink crust around the pump and front of the engine",
      "2017–2019 8-speed automatic: low-speed hesitation and clunky shifts — test drive in stop-and-go; software updates improved it",
      "2020+ models are largely trouble-free; focus on accident history and dealer service gaps instead",
    ],
    verify: [
      "No oil drips under the engine and no oil-loss history (2008–2013)",
      "Coolant level and water pump area dry",
      "Smooth low-speed shifting on the test drive (2017–2019)",
      "Hybrid battery health report past 150,000 miles on Hybrid trims",
    ],
    faqs: [
      {
        q: "Which used Highlander years should I avoid?",
        a: "None are truly bad. Be most careful with 2008–2013 oil cooler lines and early 2017–2019 transmission behavior. 2014–2016 and 2020+ are the cleanest picks.",
      },
      {
        q: "Is the Highlander Hybrid worth it used?",
        a: "Usually yes — the hybrid system is one of the most proven on the road. Past 150,000 miles, price in possible battery replacement and ask for a hybrid health check.",
      },
      {
        q: "Highlander vs Pilot used — which is the safer buy?",
        a: "The Highlander, in most years. The Pilot's V6 is strong but its VCM cylinder deactivation and 9-speed transmission generate more complaints than anything on the Highlander.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-prius",
    make: "Toyota",
    model: "Prius",
    years: "2010–2024",
    quickAnswer:
      "A used Prius is a great commuter buy if you know the generation: 2010–2015 (Gen 3) cars have real risks — EGR clogging that can lead to head gasket failure, and a brake actuator that costs $2,000+ when it fails — while 2016+ (Gen 4) cars are dramatically more robust. On any Prius, check hybrid battery health and confirm the catalytic converter hasn't been stolen and replaced with a cheap aftermarket unit.",
    mileageNote:
      "Prius taxis routinely pass 300,000 miles. Hybrid batteries usually last 150,000–250,000 miles; replacements run $1,500–$3,000 installed, so price high-mileage cars accordingly.",
    knownIssues: [
      "2010–2015: EGR system clogs with carbon, raising combustion temps — a known path to head gasket failure; cold-start rattle or misfire is the warning sign",
      "2010–2015: brake actuator failure — listen for an abnormal pump noise and check for ABS/brake warning lights",
      "Catalytic converter theft is rampant — look underneath for shiny welds or aftermarket cats, which can fail emissions",
      "Hybrid battery degradation past 150,000 miles — a dealer or shop health report is worth the $100",
    ],
    verify: [
      "No head gasket symptoms: white smoke or rough cold start (Gen 3)",
      "No brake system warning lights and normal pedal feel",
      "Original catalytic converter or documented quality replacement",
      "Hybrid battery health report on cars past 120,000 miles",
    ],
    faqs: [
      {
        q: "Which used Prius years should I avoid?",
        a: "Approach 2010–2014 with the most caution due to EGR-related head gasket failures and brake actuator costs. 2016+ Gen 4 cars are far more trouble-free.",
      },
      {
        q: "How much does a Prius hybrid battery cost to replace?",
        a: "Roughly $1,500–$3,000 installed depending on new vs refurbished. If a high-mileage Prius is priced near market, that risk should be your negotiation lever.",
      },
      {
        q: "Is a high-mileage Prius safe to buy?",
        a: "Yes, if it has records and a healthy battery report. The drivetrain outlasts the badge's stereotype — neglect and deferred EGR cleaning are the real killers.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-sienna",
    make: "Toyota",
    model: "Sienna",
    years: "2011–2024",
    quickAnswer:
      "A used Toyota Sienna is the most durable minivan choice, but test the things that actually fail: power sliding doors (cable failures are notorious and run $500–$1,500 per side), oil cooler line leaks on 2011–2016 V6 cars, and transmission shudder on 2017–2020 8-speeds. 2021+ Siennas are hybrid-only and very reliable, but verify it isn't a heavily-used rideshare or shuttle van.",
    mileageNote:
      "The V6 easily passes 250,000 miles. Family-hauled Siennas with highway miles are great buys; airport-shuttle or rideshare vans with crushed interiors at low prices are not.",
    knownIssues: [
      "Power sliding door cable and motor failures — cycle both doors several times from the key fob, the dash button, and the handles",
      "2011–2016 V6: oil cooler line leaks, same as other 2GR vans — check for drips and the updated part",
      "2017–2020 8-speed: low-speed shudder and hesitation — test in parking-lot speeds",
      "2021+ hybrid: solid record so far; check tire wear (heavy van) and confirm software recalls are done",
    ],
    verify: [
      "Both sliding doors open and close smoothly from every control",
      "No oil leaks at the oil cooler lines (2011–2016)",
      "Smooth low-speed shifting (2017–2020)",
      "Interior wear matches the odometer — shuttle vans hide hard lives",
    ],
    faqs: [
      {
        q: "Which used Sienna years should I avoid?",
        a: "No year is a disaster. Budget for sliding door repairs on any older Sienna, watch oil cooler lines on 2011–2016, and prefer 2021+ if you want the fewest issues.",
      },
      {
        q: "Are Sienna sliding door repairs expensive?",
        a: "Yes — cable assemblies run $500–$1,500 per door installed. A door that hesitates, grinds, or reverses is your strongest negotiating point on price.",
      },
      {
        q: "Sienna vs Odyssey used — which holds up better?",
        a: "The Sienna, usually. The Odyssey rides nicer but brings VCM oil consumption and more transmission complaints. The Sienna's faults are doors and hoses, not the drivetrain.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-toyota-4runner",
    make: "Toyota",
    model: "4Runner",
    years: "2010–2024",
    quickAnswer:
      "A used Toyota 4Runner is mechanically one of the safest SUV buys — the 4.0L V6 and 5-speed automatic are dated but nearly indestructible — so your real job is checking for frame rust, off-road abuse, and overpricing. 4Runners hold value so well that asking prices are routinely $2,000–$4,000 over fair market, and a cheap one usually has rust or a hidden hit.",
    mileageNote:
      "300,000 miles is achievable. A 150,000-mile highway 4Runner with records beats a 90,000-mile lifted one that's been rock crawling. Mileage matters less than how it was used.",
    knownIssues: [
      "Frame and underbody rust on northern cars — inspect the frame rails, crossmembers, and skid plates, not just the body",
      "Off-road abuse: check for dented skid plates, bent control arms, mud in crevices, and aftermarket lift quality",
      "2010–2013: some brake master cylinder complaints — confirm a firm pedal",
      "The drivetrain itself rarely fails; most problems trace to modification, rust, or neglect",
    ],
    verify: [
      "Frame rails and crossmembers for rust, especially northeast/midwest cars",
      "Suspension components if lifted — quality of parts and install",
      "Service records confirming regular fluid changes",
      "Price against fair market — 4Runner listings run high; negotiate from comps",
    ],
    faqs: [
      {
        q: "Which used 4Runner years should I avoid?",
        a: "The 5th gen (2010–2024) has no bad years mechanically. Avoid specific trucks instead: rusted frames, sloppy lifts, and hard off-road use are the dealbreakers.",
      },
      {
        q: "Why are used 4Runners so expensive?",
        a: "Reliability reputation plus off-road demand keeps resale extremely strong. That also means overpriced listings are normal — compare several comps and be willing to walk.",
      },
      {
        q: "Is a lifted 4Runner a red flag?",
        a: "Not automatically, but it shifts the burden of proof. Ask who installed the lift, look for quality brands, and check tires, ball joints, and alignment wear closely.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-honda-pilot",
    make: "Honda",
    model: "Pilot",
    years: "2009–2024",
    quickAnswer:
      "A used Honda Pilot is a solid family SUV with one recurring theme: VCM, Honda's cylinder deactivation, which causes oil consumption, fouled spark plugs, and worn engine mounts on 2009–2015 models especially. On 2016–2018 Touring and Elite trims, test the 9-speed automatic carefully — early ones shift roughly. Records of the timing belt service (every ~100,000 miles) matter because this is an interference engine.",
    mileageNote:
      "Pilots reach 200,000+ miles routinely when the timing belt is done on schedule. Check oil level on the spot — VCM-era engines that burn oil and ran low have shortened lives.",
    knownIssues: [
      "VCM cylinder deactivation (2009–2015 worst): oil consumption, spark plug fouling, vibration, and engine mount wear — many owners install VCM disablers",
      "2016–2018 9-speed (ZF): harsh or delayed shifts and occasional limp mode — test drive thoroughly; 6-speed trims are safer",
      "Timing belt is a ~$1,000 service due every 100,000 miles — no proof means budget for it now",
      "2009–2011: some transmission torque converter shudder — feel for vibration at light throttle around 35–45 mph",
    ],
    verify: [
      "Oil level on the dipstick and any oil-consumption history",
      "Timing belt service receipt with date and mileage",
      "Shift quality on 9-speed trims (2016–2018)",
      "Engine mounts: clunks or shudder on acceleration from a stop",
    ],
    faqs: [
      {
        q: "Which used Pilot years should I avoid?",
        a: "Be most cautious with 2009–2011 (VCM oil burning plus transmission shudder) and 2016 first-year 9-speed models. 2019+ Pilots are the cleanest.",
      },
      {
        q: "What is VCM and should it scare me off?",
        a: "Variable Cylinder Management shuts cylinders to save fuel but causes oil burning and vibration as miles climb. It's manageable — check oil records and current level — but it's your main negotiating point.",
      },
      {
        q: "Has the timing belt been done — and does it matter?",
        a: "A lot. The V6 is an interference engine: a snapped belt destroys it. If there's no receipt around 100,000 miles, subtract a $1,000 service from your offer.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-honda-odyssey",
    make: "Honda",
    model: "Odyssey",
    years: "2011–2024",
    quickAnswer:
      "A used Honda Odyssey drives better than any minivan but carries known drivetrain quirks: VCM-related oil consumption on 2011–2017 models, torque converter shudder on 2014–2017 6-speeds, and rough early shifts from the 2018–2019 9/10-speeds. Cycle the power sliding doors repeatedly — door repairs are common and not cheap. A well-documented Odyssey is a great family buy; an undocumented one deserves a hard look at the oil.",
    mileageNote:
      "200,000+ miles is common with maintenance. Timing belt service every ~100,000 miles is mandatory budgeting, same as the Pilot. Check oil level on the test drive.",
    knownIssues: [
      "VCM oil consumption and spark plug fouling (2011–2017) — verify oil level and ask about top-offs",
      "2014–2017: torque converter shudder at light throttle — a fluid change helps early cases, but feel for it on the drive",
      "2018–2019: 9-speed shift quality complaints; the 10-speed (2018+ Touring/Elite) is better",
      "Power sliding doors: motors, cables, and sensors fail with age — test every door function",
    ],
    verify: [
      "Oil level and consumption history on VCM engines",
      "Timing belt receipt near 100,000 miles",
      "Sliding doors from fob, dash, and handles — several cycles",
      "Smooth light-throttle cruising with no shudder (2014–2017)",
    ],
    faqs: [
      {
        q: "Which used Odyssey years should I avoid?",
        a: "2014–2017 carry the most drivetrain complaints (shudder plus VCM oil burning). 2011–2013 are decent with records; 2020+ are the safest picks.",
      },
      {
        q: "Odyssey vs Sienna used — which is the better buy?",
        a: "The Odyssey wins on driving feel and interior; the Sienna wins on drivetrain durability. If you buy the Odyssey, prioritize oil records and transmission behavior.",
      },
      {
        q: "Are the sliding doors really a problem?",
        a: "Often enough to test seriously. A hesitating or reversing door means a repair bill of several hundred dollars per side — use it in negotiation.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-mazda-3",
    make: "Mazda",
    model: "Mazda3",
    years: "2010–2024",
    quickAnswer:
      "A used Mazda3 is one of the best value picks in compact cars — Skyactiv engines (2012+) are genuinely reliable and the conventional 6-speed automatic avoids CVT drama entirely. Check rust on the rear wheel arches and rocker panels of pre-2014 cars in snow states, and confirm the expensive LED headlights work on 2014–2018 models. Enthusiast-owned manuals deserve a check for hard launches and cheap mods.",
    mileageNote:
      "Skyactiv engines pass 200,000 miles with basic care. The 6-speed automatic is one of the most durable in the class — fluid changes every 60,000 miles or so keep it that way.",
    knownIssues: [
      "Rust on rear wheel arches and rockers, 2010–2013 especially in salt states — look closely and check under trim",
      "2014–2018: LED headlight unit failures — a single replacement can run $800+; verify both work fully",
      "2010–2013 2.0/2.5: generally solid; check motor mounts and clutch wear on manuals",
      "Infotainment screen ghost touches on 2014–2018 — test the touchscreen and commander knob",
    ],
    verify: [
      "Wheel arches and rockers for bubbling paint or filler",
      "Both headlights, all functions, on 2014–2018 LED-equipped cars",
      "Clean fluid and smooth shifts from the 6-speed auto",
      "No boy-racer mods: intake, exhaust, lowering springs",
    ],
    faqs: [
      {
        q: "Which used Mazda3 years should I avoid?",
        a: "None are bad mechanically. Watch rust on 2010–2013 cars and headlight/infotainment costs on 2014–2018. 2019+ models are excellent across the board.",
      },
      {
        q: "Is the Mazda3 as reliable as a Civic or Corolla?",
        a: "Close enough that condition matters more than badge. You also skip the CVT (Corolla) and turbo oil-dilution (Civic 1.5T) concerns — the Mazda's 6-speed auto is a known quantity.",
      },
      {
        q: "Why is this Mazda3 cheaper than equivalent Civics?",
        a: "Mazda resale runs lower despite similar reliability — that's the value play. Just make sure the discount isn't actually rust or a salvage history.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-mazda-cx-5",
    make: "Mazda",
    model: "CX-5",
    years: "2013–2024",
    quickAnswer:
      "A used Mazda CX-5 is the sleeper pick among compact SUVs: Skyactiv engines and a conventional automatic give it a better reliability record than most rivals, with no CVT or major engine recall to worry about. Check the LED headlights on 2016+ cars (expensive units), listen for rear wheel bearing hum on higher-mileage examples, and on 2018+ cylinder-deactivation 2.5L engines confirm smooth light-throttle cruising.",
    mileageNote:
      "200,000 miles is realistic with oil changes. The 6-speed automatic is durable; fluid service by 60,000–80,000 miles is cheap insurance on any used example.",
    knownIssues: [
      "2016+: LED headlight failures out of warranty are pricey — verify both units fully work",
      "Rear wheel bearings hum at 80,000+ miles on some cars — listen at highway speed",
      "2018+ 2.5 with cylinder deactivation: occasional light-throttle shudder complaints — feel for it cruising at 40–50 mph",
      "2013–2015: infotainment aging and occasional A/C actuator clicks; drivetrain itself is strong",
    ],
    verify: [
      "Both headlights work in all modes (2016+)",
      "No droning/humming from rear bearings at speed",
      "Smooth cruising on 2018+ 2.5L non-turbo engines",
      "Transmission fluid service history past 60,000 miles",
    ],
    faqs: [
      {
        q: "Which used CX-5 years should I avoid?",
        a: "None stand out as bad. The 2013 first year has the most small complaints; 2017+ second generation is the sweet spot for refinement and reliability.",
      },
      {
        q: "Is the CX-5 turbo (2019+) reliable?",
        a: "So far yes — the 2.5T has a good record. Prefer one with synthetic oil changes on schedule and no tune; boosted engines forgive less neglect.",
      },
      {
        q: "CX-5 vs RAV4 or CR-V used?",
        a: "The CX-5 typically costs less for equal years and skips the CR-V's 1.5T oil-dilution question and RAV4 price premium. Its weak spots — headlights, bearings — are cheaper than engine problems.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-subaru-forester",
    make: "Subaru",
    model: "Forester",
    years: "2011–2024",
    quickAnswer:
      "A used Subaru Forester is a capable all-weather buy with two documented soft spots: oil consumption on 2011–2015 FB25 engines (subject of a class action — check for top-off habits) and CVT reliability on 2014–2018 cars, for which Subaru extended the warranty to 10 years/100,000 miles. 2019+ models mostly trade those for minor annoyances like windshield cracking and battery drain. Verify head gasket history on anything older you're cross-shopping.",
    mileageNote:
      "200,000 miles is attainable, but Subarus punish neglect more than Toyotas. An oil-fed, CVT-serviced Forester at 120,000 miles beats a vague-history one at 70,000.",
    knownIssues: [
      "2011–2015: FB25 oil consumption — check the dipstick now and ask how often oil is added between changes",
      "2014–2018: CVT failures led Subaru to extend coverage to 100,000 miles — confirm whether the CVT was serviced or replaced",
      "2019+: windshield stress cracking and parasitic battery drain complaints — ask about replacements",
      "AWD system needs four matched tires — mismatched tread depths cause drivetrain wear",
    ],
    verify: [
      "Current oil level and consumption history (2011–2015)",
      "CVT service or replacement records (2014–2018)",
      "All four tires same brand/model with even wear",
      "No head gasket seepage on high-mileage examples",
    ],
    faqs: [
      {
        q: "Which used Forester years should I avoid?",
        a: "Be most careful with 2014–2016: they combine the oil-consumption engine with the early CVT. 2019+ models have the cleanest record.",
      },
      {
        q: "Is the Forester CVT a dealbreaker?",
        a: "No, but it's a checkpoint. Subaru's extended warranty acknowledgment means you should ask directly: serviced, replaced, or original? Factor the answer into price.",
      },
      {
        q: "Why do tires matter so much on a used Subaru?",
        a: "Full-time AWD needs all four tires within about 2/32\" of each other. A seller who replaced one or two tires cheaply may have quietly stressed the drivetrain.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-subaru-crosstrek",
    make: "Subaru",
    model: "Crosstrek",
    years: "2013–2024",
    quickAnswer:
      "A used Subaru Crosstrek holds value stubbornly because demand is high, so your job is mostly verifying it wasn't neglected: 2013–2017 FB20 engines can consume oil (check the dipstick), the CVT on 2013–2018 cars falls under Subaru's extended 100,000-mile coverage, and the 2.0L is slow enough that many were driven hard. Mechanically honest examples are great small-AWD buys.",
    mileageNote:
      "200,000 miles is realistic with care. The engine is understressed in daily driving; oil top-off neglect and skipped CVT fluid are what shorten lives.",
    knownIssues: [
      "2013–2017: oil consumption on the FB20 — verify level and top-off habits",
      "2013–2018 CVT: extended warranty to 100,000 miles tells you what to ask about — service history or replacement",
      "2018+: windshield cracking complaints and minor battery drain issues",
      "Underpowered on highways — test a full-throttle merge; a screaming but smooth CVT is normal, shudder is not",
    ],
    verify: [
      "Oil level on the dipstick today (2013–2017)",
      "CVT fluid service records",
      "Four matched tires with even wear (AWD requirement)",
      "No accident repair from its small-car-in-snow life",
    ],
    faqs: [
      {
        q: "Which used Crosstrek years should I avoid?",
        a: "2013–2015 carry the most oil-consumption and early-CVT risk. 2018+ second-generation cars are the safest, with mostly minor complaints.",
      },
      {
        q: "Why are used Crosstreks so expensive for their size?",
        a: "Outdoorsy demand plus Subaru loyalty. Expect to pay near-new prices for 3-year-old examples — which makes verifying condition more important, not less.",
      },
      {
        q: "Is the Crosstrek too slow to buy?",
        a: "It's slow but functional. The buying risk isn't speed — it's that previous owners flogged it. Listen for CVT shudder under hard acceleration rather than judging the spec sheet.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-chevrolet-malibu",
    make: "Chevrolet",
    model: "Malibu",
    years: "2013–2024",
    quickAnswer:
      "A used Chevrolet Malibu is a genuine value play — it depreciates hard, so you get a lot of car per dollar — but pick the engine carefully: the 2016+ 1.5L turbo has documented oil consumption and turbo failures, while the 2.5L and the 2.0T are sturdier. Many Malibus were rental or fleet cars; that's not automatically bad, but verify maintenance actually happened and check for the stop/start system behaving properly.",
    mileageNote:
      "150,000–200,000 miles is reachable with care. Fleet cars often have consistent oil changes — ask for the auction or fleet maintenance printout if it was one.",
    knownIssues: [
      "2016+ 1.5T: oil consumption and turbo failures — check oil level, listen for turbo whine, look for blue smoke on startup",
      "2013–2015 2.5L: stop/start system glitches and some starter complaints — watch the restart behavior at lights",
      "2016+: occasional transmission shudder on 6-speed cars — feel for vibration at light throttle",
      "Rental/fleet history is common — verify with the history report and match wear to miles",
    ],
    verify: [
      "Oil level and any consumption history (1.5T especially)",
      "Smooth stop/start cycles during the test drive",
      "History report for rental/fleet use and accident records",
      "All electronics: infotainment, sensors, cameras — fleet cars get rough use",
    ],
    faqs: [
      {
        q: "Which used Malibu years should I avoid?",
        a: "Approach 2016–2018 1.5T cars with the most caution unless oil records are solid. The 2.0T and the 2013–2015 2.5L are the more durable picks.",
      },
      {
        q: "Is a former rental Malibu a bad buy?",
        a: "Not necessarily — rentals get regular oil changes but rough handling. Price should reflect it: a former rental should cost noticeably less than a one-owner car.",
      },
      {
        q: "Why is this Malibu so much cheaper than an Accord or Camry?",
        a: "Depreciation and badge perception, not necessarily condition. That's the opportunity — but it also means resale will stay soft when you sell.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-chevrolet-tahoe",
    make: "Chevrolet",
    model: "Tahoe",
    years: "2007–2024",
    quickAnswer:
      "A used Chevrolet Tahoe is a capable family hauler with one dominant risk: AFM/DFM lifter failure on the 5.3L V8, which can require a $3,000+ top-end repair and affects 2007–2021 models broadly. Listen cold for ticking, check for a misfire history, and ask directly whether lifters were ever replaced. Also inspect autoride/air suspension on loaded trims and assume any Tahoe may have towed — look at the hitch wear.",
    mileageNote:
      "250,000 miles is possible on a cared-for 5.3, but lifter risk is mileage-blind. A documented lifter/cam repair already done can actually make a higher-mileage truck the safer buy.",
    knownIssues: [
      "AFM/DFM lifter collapse on 5.3/6.2 V8s — cold-start ticking, misfires, or a check-engine light for cylinder misfire are the tells",
      "2007–2014: dash cracking, door lock actuators, and HVAC blend door failures",
      "Loaded trims: autoride shocks and air compressor failures are expensive — test ride height and listen for the compressor",
      "Towing history: check hitch, transmission fluid condition, and rear suspension sag",
    ],
    verify: [
      "Cold start: no ticking or misfire, no startup rattle",
      "Any lifter, cam, or engine top-end repair receipts",
      "Air/autoride suspension holds height overnight (ask) and rides level",
      "Transmission fluid condition and towing wear",
    ],
    faqs: [
      {
        q: "Which used Tahoe years should I avoid?",
        a: "Lifter risk spans 2007–2021, but 2015–2020 5.3L trucks generate the most complaints. A truck with documented lifter repair, or a 2022+ with the updated engines, is the safer route.",
      },
      {
        q: "How expensive is the AFM lifter failure?",
        a: "Commonly $2,500–$4,500 at independent shops since the heads come off. That's why a cold-start listen and misfire-history check matter more than anything else on this truck.",
      },
      {
        q: "Should I avoid a Tahoe that towed?",
        a: "Light towing is fine — these are built for it. What you're avoiding is neglected towing: burnt transmission fluid, sagging rear springs, and brake wear without service records.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-gmc-sierra-1500",
    make: "GMC",
    model: "Sierra 1500",
    years: "2014–2024",
    quickAnswer:
      "A used GMC Sierra 1500 shares everything with the Silverado, including the problems: AFM/DFM lifter failures on 5.3L and 6.2L V8s, the well-known 'Chevy shake' driveline vibration on 2014–2019 trucks with the 8-speed, and condenser failures. Listen to a cold start, feel for vibration at 65–75 mph, and check whether the 8-speed has had the fluid swap that mitigates shudder. Work trucks hide hard lives — match bed and hitch wear to the story.",
    mileageNote:
      "These V8s can pass 250,000 miles, and a documented lifter repair already done removes the biggest unknown. Judge service proof over the odometer.",
    knownIssues: [
      "AFM/DFM lifter collapse (5.3/6.2) — cold ticking, misfires, check-engine history",
      "2014–2019 8-speed: torque converter shudder ('Chevy shake') — GM's fluid change helps; ask if it was done",
      "AC condenser failures, especially 2014–2018 — confirm cold AC",
      "Check for work-truck abuse: bed damage, hitch wear, brake controller wiring, suspension sag",
    ],
    verify: [
      "Cold start with no ticking; misfire history scan if possible",
      "Highway test at 65–75 mph for driveline vibration",
      "AC blows cold at idle",
      "Service records and signs of towing or plow duty",
    ],
    faqs: [
      {
        q: "Which used Sierra years should I avoid?",
        a: "2014–2019 carry the densest cluster: lifter risk plus 8-speed shudder. A 6-speed truck, or one with documented lifter and fluid service, is the safer pick.",
      },
      {
        q: "Sierra vs Silverado used — any real difference?",
        a: "Mechanically they're twins; buy on condition and price, not badge. Sierra trims often carry a small price premium for the same hardware.",
      },
      {
        q: "Is the 'Chevy shake' fixable?",
        a: "Often — GM's torque converter fluid exchange (Mobil 1 LV ATF HP) resolves many cases. If the truck still shakes on your test drive, price it as an open repair, not a quirk.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ford-fusion",
    make: "Ford",
    model: "Fusion",
    years: "2013–2020",
    quickAnswer:
      "A used Ford Fusion can be a bargain midsize sedan, but the engine choice decides the risk: the 1.5T and 1.6T EcoBoost engines have a documented coolant-intrusion problem that can destroy the engine, while the 2.5L and the 2.0 hybrid are the durable picks. Check for coolant loss with no visible leak — that's the tell — and verify the long list of recalls (door latches, steering) was completed.",
    mileageNote:
      "2.5L and hybrid models regularly exceed 200,000 miles. EcoBoost cars need a stricter standard: coolant history, records, and a cold-start check before you trust high mileage.",
    knownIssues: [
      "1.5T/1.6T EcoBoost: coolant leaks into cylinders — unexplained coolant loss, white exhaust smoke, or misfires after warm-up are dealbreakers",
      "Door latch recalls — doors that won't stay shut; confirm recall completion by VIN",
      "Swollen lug nuts: the capped lug nuts deform and strand you at a flat tire — a cheap fix, but check",
      "Power steering rack failures on 2013–2016 — feel for notchy or heavy spots",
    ],
    verify: [
      "Coolant level with a cold engine and any top-off history (EcoBoost)",
      "All recalls completed — run the VIN at ford.com",
      "Steering feel: smooth and even lock to lock",
      "Hybrid battery behavior on hybrid trims: engine cycling, EV mode works",
    ],
    faqs: [
      {
        q: "Which used Fusion years and engines should I avoid?",
        a: "Avoid 2013–2019 1.5T/1.6T EcoBoost cars without pristine coolant history. The 2.5L and the hybrid are the reliable choices and worth seeking out specifically.",
      },
      {
        q: "Why are used Fusions so cheap?",
        a: "Ford killed the model in 2020, sedans are out of fashion, and fleets dumped them. A 2.5L or hybrid Fusion is genuinely undervalued; an EcoBoost is cheap for a reason.",
      },
      {
        q: "Is the Fusion Hybrid a good used buy?",
        a: "Yes — it shares proven hybrid hardware logic with Toyota-style systems and routinely passes 200,000 miles in taxi fleets. Check the hybrid battery cycles properly and price in age.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-ford-mustang",
    make: "Ford",
    model: "Mustang",
    years: "2011–2024",
    quickAnswer:
      "A used Ford Mustang is mechanically stout — the 5.0 Coyote V8 is one of the most durable performance engines around — so the real risks are human: crash repairs, hard launches, cheap tunes, and hidden track use. Run the history report, look for overspray and panel gaps, and ask directly about tunes on EcoBoost cars. On 2011–2014 manuals, test the MT82 gearbox for notchy or crunchy shifts.",
    mileageNote:
      "A stock, adult-owned 5.0 at 100,000 miles is a better buy than a modified 40,000-mile car. EcoBoost engines are fine stock but forgive tuning poorly.",
    knownIssues: [
      "Accident and abuse history — Mustangs lead crash statistics; inspect paint depth, panel gaps, and frame rails",
      "2011–2014 MT82 manual: notchy 1-2 shifts and crunches when cold — test thoroughly",
      "2015–2017 2.3 EcoBoost: head gasket failures on early cars, worsened by tunes — ask about coolant loss and tuning history",
      "Clutch and rear tire condition reveal launch habits — fresh rear tires on a cheap car ask a question",
    ],
    verify: [
      "History report plus visual crash-repair inspection",
      "Stock tune confirmation — ask, and look for aftermarket intake/exhaust/downpipe",
      "Cold manual shift quality (2011–2014)",
      "Coolant level and history on EcoBoost cars",
    ],
    faqs: [
      {
        q: "Which used Mustang years should I avoid?",
        a: "No year is inherently bad; specific cars are. Highest caution: 2011–2014 manuals (gearbox), early tuned EcoBoosts, and anything with sketchy repair history.",
      },
      {
        q: "Should I avoid a modified Mustang?",
        a: "Mild bolt-ons with receipts from an adult owner can be fine. Tunes without supporting records, drag radials, or a laundry list of cheap parts — walk away; there are plenty of stock cars.",
      },
      {
        q: "Is the EcoBoost Mustang reliable?",
        a: "Stock, yes — it's a solid commuter coupe. The risk profile changes completely with a tune, which stresses the head gasket and turbo. Stock and documented is the rule.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-jeep-grand-cherokee",
    make: "Jeep",
    model: "Grand Cherokee",
    years: "2011–2024",
    quickAnswer:
      "A used Jeep Grand Cherokee offers a lot of capability per dollar, but it demands a careful inspection: air suspension failures on 2014+ loaded trims are a $1,500+ repair, 2011–2013 3.6L V6s had cylinder head failures (left bank), early TIPM electrical modules cause no-start gremlins, and the 2014–2015 shifter recall must be verified done. Buy a documented one and it's a great truck; buy blind and it's a gamble.",
    mileageNote:
      "The 3.6 V6 and 5.7 V8 can both pass 200,000 miles with care. Air suspension and electronics age on calendar time as much as miles — a low-mile loaded trim isn't automatically safe.",
    knownIssues: [
      "Quadra-Lift air suspension (2014+): compressor and strut failures — confirm it raises/lowers through all modes and holds height",
      "2011–2013 3.6L: cylinder head failure on the left bank — ticking or misfire on cylinders 2/4/6; many were replaced under extended warranty",
      "2011–2013 TIPM (power module): fuel pump relay and electrical gremlins — intermittent no-starts are the symptom",
      "2014–2015: monostable shifter recall (rollaway risk) — verify recall completion by VIN",
    ],
    verify: [
      "Air suspension cycles through all heights and holds overnight",
      "Cylinder head replacement records on 2011–2013 V6s",
      "All recalls completed by VIN",
      "4WD system engages properly in all modes",
    ],
    faqs: [
      {
        q: "Which used Grand Cherokee years should I avoid?",
        a: "2011–2014 carry the most documented risk: early V6 heads, TIPM electrics, and first-year air suspension. 2016+ WK2s are meaningfully better; 2022+ is a new generation.",
      },
      {
        q: "Is the air suspension worth the risk?",
        a: "It's excellent when working and expensive when not. On a 2014+ trim with Quadra-Lift, test every height mode and budget for a compressor eventually — or buy a steel-spring trim.",
      },
      {
        q: "Grand Cherokee vs 4Runner used?",
        a: "The Jeep rides and tows better and costs less used; the 4Runner will likely outlast it with less drama. Pick the Jeep with records and an inspection; pick the 4Runner if you keep cars a decade.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-kia-sorento",
    make: "Kia",
    model: "Sorento",
    years: "2011–2024",
    quickAnswer:
      "A used Kia Sorento can be a strong value, but the 2.4L and 2.0T Theta II engines (2011–2019) are the same family behind Kia's massive engine-failure recalls — verify by VIN whether recalls were done and whether the engine was already replaced, which is actually a plus. Listen for any rod-bearing knock cold, and on 2011–2021 key-start models confirm the anti-theft software update was applied.",
    mileageNote:
      "A Sorento with a replaced engine or clean recall history can run a long time; V6 models avoid the Theta issue entirely. Maintenance proof matters more than miles here.",
    knownIssues: [
      "Theta II 2.4/2.0T (2011–2019): rod bearing failure — listen cold for knock, check recall status and knock-sensor software update by VIN",
      "Already-replaced engines are common and good news — ask for the replacement paperwork",
      "2011–2021 key-start models: Kia theft wave — confirm the immobilizer software update and check for broken steering column trim",
      "3.3 V6 models skip the Theta drama; their checks are routine — fluids, mounts, brakes",
    ],
    verify: [
      "Cold-start listen for engine knock (Theta II cars)",
      "Recall and engine-replacement history by VIN",
      "Anti-theft software update sticker or dealer confirmation",
      "Steering column and door lock condition (theft attempts)",
    ],
    faqs: [
      {
        q: "Which used Sorento years should I avoid?",
        a: "Be most careful with 2011–2019 2.4L and 2.0T cars lacking recall documentation. The V6 trims and 2021+ models are the cleaner paths.",
      },
      {
        q: "Is a Sorento with a replaced engine a red flag?",
        a: "Usually the opposite — Kia replaced engines under recall with updated parts. Paperwork in hand, it's arguably safer than an original-engine car with no records.",
      },
      {
        q: "Does the Kia theft problem affect the Sorento?",
        a: "Key-start 2011–2021 models are in the affected group. The free software update largely fixes it, but unpatched cars can be hard to insure — confirm before you buy.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-hyundai-tucson",
    make: "Hyundai",
    model: "Tucson",
    years: "2016–2024",
    quickAnswer:
      "A used Hyundai Tucson is a sensible budget SUV with two generation-specific checks: 2016–2018 cars with the 1.6T use a dual-clutch transmission that hesitates from a stop (test it on a hill), and the 2.0L engines have enough oil-consumption complaints that you should check the dipstick and service history on the spot. Confirm anti-theft updates on key-start cars, and the 2022+ generation has been solid.",
    mileageNote:
      "150,000–200,000 miles is reasonable with documented oil changes. Oil-starved examples die young — the dipstick check at the showing is non-negotiable.",
    knownIssues: [
      "2016–2018 1.6T DCT: hesitation and roll-back from stops, especially uphill — test exactly that; software updates helped some cars",
      "2.0L Nu engine: oil consumption complaints — check level and ask about top-offs",
      "Key-start 2016–2021 models: confirm the anti-theft software update (Hyundai theft wave)",
      "Engine recalls vary by year and engine — run the VIN before the test drive",
    ],
    verify: [
      "Uphill stop-and-go behavior on DCT cars (2016–2018)",
      "Oil level on the dipstick and consumption history",
      "Anti-theft update and intact steering column",
      "Open recalls by VIN at hyundaiusa.com",
    ],
    faqs: [
      {
        q: "Which used Tucson years should I avoid?",
        a: "2016–2018 1.6T DCT cars without software updates frustrate in traffic, and any 2.0L without oil records is a gamble. 2022+ models have the strongest early record.",
      },
      {
        q: "Is the Tucson's dual-clutch transmission bad?",
        a: "It's a trade-off: efficient when rolling, awkward from stops. Drive it in the exact traffic you face daily. If the hesitation bothers you on the test drive, it will bother you for years.",
      },
      {
        q: "How do I check the Hyundai theft issue on this car?",
        a: "Key-start (non push-button) 2016–2021 cars need the free immobilizer software update. Ask for proof, look for a window sticker, or have a dealer run the VIN — some insurers surcharge unpatched cars.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-volkswagen-jetta",
    make: "Volkswagen",
    model: "Jetta",
    years: "2011–2024",
    quickAnswer:
      "A used VW Jetta is a comfortable, efficient compact that rewards documented maintenance and punishes neglect: 2011–2013 1.4/1.8/2.0 TSI engines had timing chain tensioner failures that can destroy the engine (a cold-start rattle is the warning), water pumps fail on a schedule, and carbon buildup needs periodic cleaning on direct-injection engines. The 2011–2014 2.5L five-cylinder is the unsung durable pick.",
    mileageNote:
      "With records, 180,000+ miles is realistic. Without records, even 60,000 miles deserves skepticism — deferred VW maintenance compounds faster than on Japanese rivals.",
    knownIssues: [
      "EA888 TSI (2011–2013 especially): timing chain tensioner failure — listen for rattle at cold start; updated tensioner receipts are gold",
      "Plastic water pumps fail around 60,000–100,000 miles — coolant smell or low level is the tell",
      "Carbon buildup on direct-injection engines: rough idle and lost power — walnut blasting service ~$400–600",
      "DSG-equipped cars need fluid service every 40,000 miles — ask for proof",
    ],
    verify: [
      "Cold-start listen for chain rattle",
      "Coolant level and water pump replacement records",
      "DSG service receipts on dual-clutch cars",
      "Scan for stored codes — VWs log everything",
    ],
    faqs: [
      {
        q: "Which used Jetta years should I avoid?",
        a: "Early EA888 turbo cars (2011–2013) without tensioner documentation are the riskiest. The 2.5L five-cylinder of the same era and 2019+ 1.4T cars have better records.",
      },
      {
        q: "Are used VWs really money pits?",
        a: "Documented ones, no — parts are reasonable and the engines are solid once known issues are addressed. Undocumented ones, often yes. The records are the whole game.",
      },
      {
        q: "What's the cheapest reliable used Jetta?",
        a: "A 2011–2014 2.5L SE with records. It's thirstier and less refined than the turbos, but the engine is famously durable and avoids the tensioner and carbon drama.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-lexus-rx-350",
    make: "Lexus",
    model: "RX 350",
    years: "2010–2024",
    quickAnswer:
      "A used Lexus RX 350 is arguably the most reliable luxury SUV on the market — the 3.5L V6 is the same proven Toyota engine family that runs forever — so the checklist is short: water pump seepage and oil cooler line leaks on 2010–2015 cars, full service history (luxury cars suffer when third owners skip maintenance), and honest pricing, because RX listings carry a badge premium. High-mileage examples with dealer records are genuinely safe buys.",
    mileageNote:
      "250,000+ miles is common. An RX with 130,000 documented miles routinely outlasts a German rival with 60,000. Prioritize the service folder over the odometer.",
    knownIssues: [
      "2010–2015: water pump weep and oil cooler line leaks — check the front of the engine and under the car",
      "Remote-touch infotainment is dated and the mouse controller divides opinion — test it before assuming you'll adjust",
      "Third-owner neglect: luxury depreciation means some RXs hit owners who skip $300 services — gaps in records matter",
      "2016+: very few patterns; check 20-inch wheel/tire condition and panoramic roof drains",
    ],
    verify: [
      "Service history continuity — especially recent owners",
      "Dry water pump and oil cooler lines (2010–2015)",
      "All power features: tailgate, seats, sunroof",
      "Price against comps — badge premium invites overpricing",
    ],
    faqs: [
      {
        q: "Which used RX 350 years should I avoid?",
        a: "None, really — this is one of the safest used luxury buys. The 2010–2012 cars are just older; verify leaks were addressed and the interior wasn't neglected.",
      },
      {
        q: "Is a high-mileage RX 350 still worth buying?",
        a: "With records, yes — these engines are proven past 250,000 miles. A 140,000-mile one-owner RX with a dealer folder is a better risk than most 70,000-mile luxury SUVs.",
      },
      {
        q: "RX 350 vs German luxury SUVs used?",
        a: "The RX trades sportiness for durability and running costs that are a fraction of BMW/Mercedes equivalents. If the goal is luxury that doesn't surprise you, the RX is the answer.",
      },
    ],
    updatedAt: "2026-06-12",
  },
  {
    slug: "used-jeep-cherokee",
    make: "Jeep",
    model: "Cherokee",
    years: "2014–2023",
    quickAnswer:
      "A used Jeep Cherokee (the KL, 2014–2023) is a buy-the-right-year proposition: 2014–2016 cars fought the new ZF 9-speed transmission and the 2.4L Tigershark's oil consumption, while 2019–2023 cars with the 3.2L V6 are far more settled. Cherokees depreciate faster than the segment, so a cheap listing isn't automatically a red flag here, but an undocumented early car is.",
    mileageNote:
      "V6 cars with records go 180,000+ miles. The 2.4L needs proof it wasn't run low on oil: with that proof, 150,000 miles is fine; without it, even 80,000 is a gamble.",
    knownIssues: [
      "2014–2016: ZF 9-speed transmission rough shifting, hesitation, and hunting; multiple software reflashes were issued and some units were replaced. Ask for transmission update and service history",
      "2014–2019 2.4L Tigershark: oil consumption, subject of a class action; check the dipstick on the spot and ask directly about top-offs between changes",
      "4x4 models: power transfer unit (PTU) wear; listen for driveline whine and check for gear-oil leaks underneath",
      "Electrical: UConnect freezes and battery-drain complaints; confirm the 2015 UConnect security recall was completed",
    ],
    verify: [
      "Transmission software updates and any replacement paperwork (2014–2016)",
      "Oil level on the dipstick right now (2.4L cars)",
      "PTU leak inspection on 4x4 versions",
      "All recalls closed by VIN, including the UConnect security recall",
    ],
    faqs: [
      {
        q: "Which used Jeep Cherokee years should I avoid?",
        a: "2014–2016 carry the worst of the 9-speed transmission and 2.4L oil-consumption issues. 2019–2023, especially with the 3.2L V6, are the safest picks.",
      },
      {
        q: "Is the V6 or the 2.4L the better used Cherokee engine?",
        a: "The 3.2L V6. It avoids the oil-consumption pattern entirely and pairs better with the 9-speed. The 2.4L is acceptable only with documented oil habits.",
      },
      {
        q: "Why are used Cherokees so cheap?",
        a: "Fast depreciation and the early transmission reputation. That makes a documented, updated V6 car a legitimate value; it does not make an undocumented 2014 a bargain.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-ford-focus",
    make: "Ford",
    model: "Focus",
    years: "2008–2018",
    quickAnswer:
      "A used Ford Focus splits cleanly in two: manuals and pre-2012 automatics are cheap, honest transportation, while 2012–2016 automatics carry the infamous PowerShift (DPS6) dual-clutch that shudders, slips, and fails, and was the subject of a class action. The transmission question is the whole purchase decision on this car.",
    mileageNote:
      "The engines routinely pass 150,000–200,000 miles. On PowerShift cars the odometer matters less than the clutch and module replacement history: many needed multiple clutch jobs before 100,000 miles.",
    knownIssues: [
      "2012–2016 PowerShift (DPS6) automatic: shudder, slipping, delayed engagement, clutch and TCM failures; Ford extended coverage on clutches and control modules and settled a class action",
      "2017–2018 automatics are improved but use the same design; verify the latest clutch and TCM revisions were installed",
      "TCM failure can put the car in limp mode without warning; a TCM recall applies to many 2012–2015 cars",
      "Pre-2012 cars use a conventional automatic with few issues; rust on northern cars is the bigger concern",
    ],
    verify: [
      "Clutch and TCM replacement invoices on any 2012–2018 automatic",
      "Cold test drive with low-speed creep in traffic to feel for shudder",
      "TCM recall completion by VIN",
      "Rocker panels and rear wheel arches for rust on older cars",
    ],
    faqs: [
      {
        q: "Which used Focus years should I avoid?",
        a: "Avoid 2012–2016 automatics unless the clutch and TCM history is fully documented and recent. Manual-transmission cars from any year are a different, much safer purchase.",
      },
      {
        q: "Is a manual Focus reliable?",
        a: "Yes. The stick-shift cars avoid the PowerShift entirely, and the ST is one of the best cheap hot hatches; check for abuse rather than design faults.",
      },
      {
        q: "Should the PowerShift scare me off a cheap Focus?",
        a: "It should shape your offer, not necessarily kill the deal. A car with a fresh documented clutch and updated TCM at a low price can be rational; an undocumented one is not.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-nissan-sentra",
    make: "Nissan",
    model: "Sentra",
    years: "2013–2024",
    quickAnswer:
      "A used Nissan Sentra is a CVT story: 2013–2017 cars have the worst transmission failure record in the class (Nissan extended warranties because of it), 2018–2019 improved somewhat, and the redesigned 2020+ car is genuinely competitive and far more dependable. Buy the newest Sentra your budget allows, and buy nothing without CVT evidence.",
    mileageNote:
      "The engines are fine to 200,000 miles; the early CVTs often are not. On 2013–2019 cars, treat 90,000+ miles without CVT fluid records as a transmission bill waiting to happen.",
    knownIssues: [
      "2013–2017 CVT: shudder, overheating in summer driving, whine, and outright failure; Nissan extended CVT warranty coverage on these years for a reason",
      "2018–2019: same basic transmission with fewer complaints; still verify fluid service",
      "2020+: new platform, dramatically better record; only minor electronics and brake-wear complaints so far",
      "Cheap interiors on 2013–2019 wear fast; heavy seat and trim wear at low miles suggests hard fleet or rideshare use",
    ],
    verify: [
      "CVT fluid service records (ideally every 30,000–40,000 miles)",
      "Uphill test drive: watch for RPM flare and shudder under load",
      "Any CVT warranty claim or replacement paperwork",
      "Recall status by VIN",
    ],
    faqs: [
      {
        q: "Which used Sentra years should I avoid?",
        a: "2013–2017 unless the CVT was already replaced or serviced on schedule and is priced accordingly. 2020 and newer is the clear pick.",
      },
      {
        q: "How long does a Sentra CVT last?",
        a: "Serviced on schedule, many pass 150,000 miles; neglected early units commonly fail between 60,000 and 100,000. Fluid history is the difference.",
      },
      {
        q: "Is the 2020+ Sentra actually better?",
        a: "Yes, meaningfully: new platform, better CVT behavior, standard safety tech, and a much stronger reliability record. It changed the buying advice on this model.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-toyota-tundra",
    make: "Toyota",
    model: "Tundra",
    years: "2007–2024",
    quickAnswer:
      "A used Toyota Tundra with the 5.7L V8 (2007–2021) is one of the most durable trucks ever sold, with two known checkbook items: secondary air injection pump failures on 2007–2013 trucks and cam tower oil seepage. The 2022+ twin-turbo V6 generation is different: verify the engine recall for machining debris was resolved, because affected trucks got full engine replacements.",
    mileageNote:
      "300,000-mile 5.7 Tundras are common enough to be boring. A 150,000-mile truck with maintenance records and a rust-free frame is a safer buy than most 60,000-mile trucks from other brands.",
    knownIssues: [
      "2007–2013: secondary air injection pump failures; a repair that can run into the thousands, so check for codes and whether a documented fix or bypass exists",
      "5.7L V8: cam tower oil seepage on many trucks; usually slow and cosmetic, but use it to negotiate",
      "Frame corrosion on 2007–2011 trucks from salt states; inspect the frame, not just the body",
      "2022–2023 3.4L twin-turbo: engine recall for machining debris with engine replacements on affected VINs; confirm completion paperwork",
    ],
    verify: [
      "Air injection system codes and repair history (2007–2013)",
      "Frame condition underneath on any northern truck",
      "Recall completion by VIN on 2022–2023",
      "Signs of heavy towing: hitch wear, transmission service history",
    ],
    faqs: [
      {
        q: "Which used Tundra years should I avoid?",
        a: "None are avoid-outright, but 2007–2013 need the air pump and frame checked, and 2022–2023 need the engine recall documented. 2014–2021 is the sweet spot.",
      },
      {
        q: "Is a high-mileage Tundra safe to buy?",
        a: "With records, yes; the 5.7 is proven far past 250,000 miles. Rust and neglect kill these trucks, not mileage.",
      },
      {
        q: "Why do used Tundras cost so much?",
        a: "Resale is exceptional because demand and durability are real. That premium also attracts overpriced listings, so compare several trucks before offering.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-honda-hr-v",
    make: "Honda",
    model: "HR-V",
    years: "2016–2024",
    quickAnswer:
      "A used Honda HR-V is mechanically one of the safest small SUVs: the complaints are about refinement (noise, slow acceleration, early infotainment), not durability. Check CVT fluid service on 2016–2018 cars and you've covered the main risk; the redesigned 2023+ model fixes most of the daily annoyances.",
    mileageNote:
      "The 1.8L engine is a 200,000-mile unit with basic care. Average is 10,000–12,000 miles a year; a higher-mileage highway car with records beats a low-mileage car without them.",
    knownIssues: [
      "2016–2018: CVT whine and judder complaints, usually tied to skipped fluid changes; the transmission itself holds up when serviced",
      "2016–2018 touchscreen with no volume knob: freezes and slow response were common gripes; test it fully",
      "Thin paint and easy chipping, a Honda-wide complaint; check the hood and roof edges",
      "2023+: new generation on the Civic platform with a stronger powertrain feel; a few 12V battery drain complaints early on",
    ],
    verify: [
      "CVT fluid changes roughly every 25,000–30,000 miles",
      "Tire wear pattern for alignment issues",
      "Infotainment, backup camera, and all USB ports working",
      "Recall status by VIN",
    ],
    faqs: [
      {
        q: "Which used HR-V years should I avoid?",
        a: "No hard avoids. Prefer 2019+ for the improved infotainment, or 2023+ for the redesign; buy 2016–2018 only with CVT service evidence.",
      },
      {
        q: "Is the HR-V underpowered?",
        a: "The 2016–2022 1.8L is slow, and that's the honest trade for its reliability and economy. The 2023+ 2.0L feels notably better. Drive both expectations-first.",
      },
      {
        q: "HR-V or CR-V used?",
        a: "Same reliability DNA. The HR-V costs less and is easier to park; the CR-V is quicker, quieter, and roomier. At equal price, the CR-V is usually the better car.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-chevrolet-traverse",
    make: "Chevrolet",
    model: "Traverse",
    years: "2009–2024",
    quickAnswer:
      "A used Chevrolet Traverse is two different vehicles: the 2009–2017 first generation has two well-known failure points (3.6L timing chain stretch and the 6-speed's wave-plate failure that takes out reverse), while the 2018+ generation is substantially more dependable. This is a big, cheap three-row; the discipline is refusing early cars without engine and transmission evidence.",
    mileageNote:
      "Family haulers live hard lives: expect kid wear and towing history. A 120,000-mile 2018+ car with fluid records is a better risk than an 80,000-mile 2011 without them.",
    knownIssues: [
      "2009–2012 3.6L V6: timing chain stretch; listen for cold-start rattle and check for codes P0008/P0017",
      "2009–2013 6-speed automatic: 3-5-reverse wave plate failure, often appearing first as delayed or lost reverse",
      "2018–2020: start/stop system complaints, low-speed shudder reports, and infotainment glitches; mostly software-addressable",
      "All years: verify transmission fluid was actually serviced; many never were",
    ],
    verify: [
      "Cold start listen for chain rattle (first generation)",
      "Reverse engagement from cold and warm",
      "Transmission fluid service history",
      "Check engine light history and stored codes",
    ],
    faqs: [
      {
        q: "Which used Traverse years should I avoid?",
        a: "Be strictest with 2009–2013: timing chain plus wave-plate risk in one package. 2021+ is the cleanest record.",
      },
      {
        q: "Is the Traverse expensive to fix?",
        a: "The two first-generation failures are four-figure repairs, which is why documentation matters more than price on early cars. The 2018+ generation has ordinary running costs.",
      },
      {
        q: "Is a used Traverse good value for a three-row?",
        a: "Yes: it's one of the cheapest ways into real eight-seat space. Put the savings versus a Highlander into a pre-purchase inspection and you come out ahead.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-ford-edge",
    make: "Ford",
    model: "Edge",
    years: "2007–2024",
    quickAnswer:
      "A used Ford Edge has two headline risks that decide the purchase: coolant intrusion on 2015–2018 2.0L EcoBoost engines (which can end in an engine replacement) and power transfer unit failures on AWD cars of every generation. A front-wheel-drive V6 or a 2019+ car sidesteps most of the danger, and Edges are cheap enough that being picky costs nothing.",
    mileageNote:
      "V6 engines go 200,000 miles; the risk items fail by mechanism, not mileage. An AWD car at 90,000 miles with an original PTU is due, whatever the odometer suggests.",
    knownIssues: [
      "2015–2018 2.0L EcoBoost: coolant intrusion into cylinders, showing as coolant loss, white exhaust, or misfires; Ford extended coverage on some builds and many needed long-block replacements",
      "AWD power transfer unit (all generations): small sealed unit that runs hot; whine, leaks, or shudder mean it's failing",
      "2007–2014 3.5L V6: internal water pump that can contaminate the oil when it fails; an engine-out job, so check for coolant-in-oil at inspection",
      "2011–2014: MyFord Touch glitches and the door-ajar sensor fault",
    ],
    verify: [
      "Coolant level and any top-off history on 2.0T cars, plus exhaust color at startup",
      "PTU fluid condition and leaks on AWD",
      "Oil cap and dipstick for any milkiness (V6 water pump)",
      "Recall and extended-coverage history by VIN",
    ],
    faqs: [
      {
        q: "Which used Edge years should I avoid?",
        a: "2015–2018 with the 2.0L EcoBoost unless coolant-intrusion work or coverage is documented. 2019+ revised engines and the 8-speed have a much cleaner record.",
      },
      {
        q: "Is AWD worth it on a used Edge?",
        a: "Only with PTU service evidence. FWD versions dodge the Edge's most common four-figure failure and cost less to buy and run.",
      },
      {
        q: "Which Edge engine is the safest bet?",
        a: "The 3.5L V6 in FWD form for older cars (with the water pump checked), or a 2019+ 2.0T. The 2.7T Sport is quick; verify it wasn't driven like it.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-hyundai-santa-fe",
    make: "Hyundai",
    model: "Santa Fe",
    years: "2007–2024",
    quickAnswer:
      "A used Hyundai Santa Fe hinges on one word: Theta. The 2.4L and 2.0T Theta II engines in roughly 2010–2019 cars have a documented rod-bearing failure and fire-recall history, and Hyundai replaced enormous numbers of engines under extended campaigns. A Santa Fe with recall completion and engine paperwork is a strong value; one without is a lottery ticket. The 2021+ generation is excellent and largely drama-free.",
    mileageNote:
      "A replaced engine resets the clock: a 130,000-mile car with a 40,000-mile campaign engine is often the best buy on the lot. Original-engine cars need the knock-sensor update and quiet idle verified.",
    knownIssues: [
      "2010–2019 Theta II 2.4L/2.0T: rod-bearing wear leading to knock, stalling, or seizure; multiple recalls and the knock-sensor detection software (KSDS) campaign apply",
      "Engine fire recalls on several years; completion is non-negotiable before purchase",
      "2013–2016: steering coupler wear causing a clunk at low speed",
      "2021+ 2.5L cars: few patterns so far; dual-clutch versions want smooth low-speed behavior confirmed",
    ],
    verify: [
      "Recall and campaign completion by VIN, including KSDS software",
      "Engine replacement paperwork if the campaign engine was installed",
      "Cold idle listen for knock; oil level and consumption history",
      "Steering clunk over low-speed bumps (2013–2016)",
    ],
    faqs: [
      {
        q: "Which used Santa Fe years should I avoid?",
        a: "Undocumented 2010–2019 Theta II cars. The same years with a campaign engine and closed recalls are fine, and often underpriced for what you get.",
      },
      {
        q: "Does the engine warranty extension transfer to me?",
        a: "The recall campaigns attach to the car, not the owner, so completed work and eligibility follow the VIN. Confirm status with a dealer before buying.",
      },
      {
        q: "Is the 2021+ Santa Fe reliable?",
        a: "Yes, it's a different story: new engines, strong safety scores, and few complaints. It's the version to stretch for if the budget allows.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-kia-sportage",
    make: "Kia",
    model: "Sportage",
    years: "2011–2024",
    quickAnswer:
      "A used Kia Sportage follows the same Theta II script as its Hyundai cousins: 2011–2016 2.4L and 2.0T engines carry seizure and fire-recall history with many engines replaced under campaigns, so paperwork decides the deal. 2017–2022 cars are much steadier, and the 2023+ generation is a genuinely strong value with a hybrid option.",
    mileageNote:
      "Post-recall oil consumption still shows up on 2.4L cars: check the dipstick and ask about top-offs. A documented campaign engine with modest miles beats an original engine every time.",
    knownIssues: [
      "2011–2016 Theta II: rod-bearing failure and engine fire recalls; verify campaign completion and any engine replacement by VIN",
      "2.4L GDI: oil consumption even on cars with recall work; monitor between services",
      "2017–2022: minor electrical complaints (door locks, infotainment); engine issues far rarer but the knock-sensor software still applies",
      "2023+: early-build software glitches only; hybrid powertrain has a clean record so far",
    ],
    verify: [
      "VIN recall and campaign status, including knock-sensor software",
      "Engine replacement documentation where applicable",
      "Current oil level and any cold-start rattle",
      "All electronics: locks, screen, camera",
    ],
    faqs: [
      {
        q: "Which used Sportage years should I avoid?",
        a: "Undocumented 2011–2016 cars. With a replaced engine and closed recalls, those same years become defensible budget buys.",
      },
      {
        q: "Is a Sportage with a replaced engine a red flag?",
        a: "Usually the opposite: the campaign engine is newer than the car and the known defect is gone. Just confirm the work was done by a dealer under the recall.",
      },
      {
        q: "Is the 2023+ Sportage worth it over the older shape?",
        a: "If the budget reaches, yes: more space, hybrid economy, and a long remaining factory warranty make it one of the segment's best used values.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-chrysler-pacifica",
    make: "Chrysler",
    model: "Pacifica",
    years: "2017–2024",
    quickAnswer:
      "A used Chrysler Pacifica is the best-driving minivan of its era with the roughest first years: 2017–2018 cars accumulated transmission complaints, electrical gremlins, a stalling recall, and (on the plug-in Hybrid) a battery fire recall. From 2021 the record improves markedly. Buy late, buy documented, and the Pacifica is a family-hauling bargain.",
    mileageNote:
      "Minivans rack up short-trip family miles: judge sliding-door mechanisms, interior condition, and service continuity over the odometer. 150,000 miles with records is fine on post-2019 vans.",
    knownIssues: [
      "2017–2018: 9-speed rough shifting and hesitation addressed through multiple software updates; verify they were applied",
      "2017–2018 Hybrid: battery fire recall that included a park-outside notice; completion paperwork is mandatory",
      "Electrical: UConnect freezes, sliding-door sensor faults, and auxiliary battery drain issues",
      "2021+: much cleaner record; on AWD vans confirm driveline service and no shudder",
    ],
    verify: [
      "All recalls closed by VIN, especially stalling and Hybrid battery campaigns",
      "Transmission software currency and shift quality on a long test drive",
      "Both sliding doors and the tailgate cycling smoothly repeatedly",
      "UConnect, cameras, and rear-seat systems all functioning",
    ],
    faqs: [
      {
        q: "Which used Pacifica years should I avoid?",
        a: "2017–2018 unless every recall is closed and the transmission updates are documented. 2021+ is the version to target.",
      },
      {
        q: "Is the Pacifica Hybrid worth buying used?",
        a: "With the battery recall completed, yes: 30+ electric miles covers most school runs and the fuel savings are real. Without that paperwork, walk away.",
      },
      {
        q: "Pacifica vs Odyssey or Sienna used?",
        a: "The Pacifica drives best and costs least used; the Toyota and Honda hold reliability edges. A documented 2021+ Pacifica narrows that gap at a meaningfully lower price.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-dodge-charger",
    make: "Dodge",
    model: "Charger",
    years: "2011–2023",
    quickAnswer:
      "A used Dodge Charger is mechanically simpler and sturdier than its image suggests: the Pentastar V6 and 5.7L Hemi are proven engines and the 2015+ 8-speed is excellent. The real risks are 2011–2014 TIPM electrical failures, the Hemi lifter tick, and how the car was driven; performance trims attract abuse, theft, and rebuilt titles, so history checks matter more here than on any family sedan.",
    mileageNote:
      "V6 cars go 200,000+ miles routinely. On V8s, listen warm for lifter tick and weigh consumables: tires, brakes, and suspension on a hard-driven car can total more than the price gap to a cleaner example.",
    knownIssues: [
      "2011–2014: TIPM (integrated power module) failures causing fuel-pump relay and no-start problems; documented fixes exist, so ask",
      "5.7L Hemi: lifter and camshaft wear (the Hemi tick); audible ticking warm is a four-figure job waiting",
      "2011–2014 5-speed is dated but tough; the 2015+ ZF 8-speed is the better gearbox in every way",
      "Title and history: theft targeting of Hemi-era cars means flood, salvage, and theft-recovery titles appear disproportionately; verify before anything else",
    ],
    verify: [
      "Warm-engine listen for lifter tick (V8)",
      "TIPM behavior: consistent starts, fuel pump prime (2011–2014)",
      "Title status and accident/theft history report",
      "Tires, brakes, and any tune or launch-control abuse evidence",
    ],
    faqs: [
      {
        q: "Which used Charger years should I avoid?",
        a: "2011–2014 need the TIPM history checked; otherwise avoid conditions, not years: abused, modified, or rebuilt-title cars are the real hazard.",
      },
      {
        q: "Is the V6 Charger reliable?",
        a: "Very: the Pentastar is one of the most durable V6s of the era. Watch for oil-cooler housing leaks and little else.",
      },
      {
        q: "What should I know about insuring a used Charger?",
        a: "Rates run high, especially on V8 trims in theft-prone areas. Get an insurance quote for the exact VIN before you commit; it changes the real monthly cost.",
      },
    ],
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-tesla-model-y",
    make: "Tesla",
    model: "Model Y",
    years: "2020–2024",
    quickAnswer:
      "A used Tesla Model Y is a case where the drivetrain is the safe part: batteries and motors have strong records, while early build quality (2020–2021 panel gaps, paint) and cold-climate heat pump failures are the real checklist. Battery health and the in-app service history tell you more than the odometer, and 2023+ cars are the best built.",
    mileageNote:
      "Expect roughly 10% range degradation by 100,000–150,000 miles on a healthy pack; a fast-degrading battery shows up in the range test, not the mileage. High-mileage highway cars can be excellent buys.",
    knownIssues: [
      "2020–2021: panel alignment, paint defects, and trim rattles; inspect in person and in daylight",
      "2021–2022: heat pump and related valve failures in cold climates, addressed through service campaigns; check the service history for heat pump work",
      "Early builds: front suspension noise complaints; listen over broken pavement",
      "Used-market hazard: flood, salvage, and auction cars are common; verify title and that the car still carries Supercharging access",
    ],
    verify: [
      "Battery health: charge high and compare indicated range against original rating",
      "Service history in the Tesla app, especially heat pump items",
      "Panel gaps, paint, and glass roof seals",
      "Title status and accident history (aluminum repairs are expensive)",
    ],
    faqs: [
      {
        q: "Which used Model Y years should I avoid?",
        a: "None outright, but 2020–2021 cars demand a careful build-quality inspection and 2021–2022 cold-climate cars need heat pump history. 2023+ is the cleanest.",
      },
      {
        q: "How much battery degradation is normal?",
        a: "Around 5% in the first years, roughly 10% by 100,000+ miles. Test it directly: a full-charge range reading beats any seller claim.",
      },
      {
        q: "What does out-of-warranty Tesla ownership cost?",
        a: "Routine costs are low (no oil, cheap brakes), but out-of-warranty repairs like screens or suspension run dealer-priced. Budget for the battery/drive warranty end at 8 years.",
      },
    ],
    updatedAt: "2026-07-11",
  },
];

export function getCarModel(slug: string) {
  return carModels.find((m) => m.slug === slug);
}
