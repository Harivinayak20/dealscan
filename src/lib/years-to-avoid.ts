export type YearVerdict = {
  years: string;
  reason: string;
};

export type YearsToAvoidEntry = {
  slug: string; // matches CarModel slug
  avoid: YearVerdict[];
  best: YearVerdict[];
  verdict: string;
  updatedAt: string;
};

const UPDATED = "2026-06-12";

export const yearsToAvoid: YearsToAvoidEntry[] = [
  {
    slug: "used-honda-civic",
    avoid: [
      { years: "2006–2011", reason: "Engine block cracking near the coolant passage. Many blocks were replaced under Honda's extended warranty, but an original block with coolant-loss history is a walk-away." },
      { years: "2016–2018", reason: "First years of the 1.5L turbo with the worst oil-dilution complaints, plus widespread AC condenser failures. Only buy with full oil-change records." },
    ],
    best: [
      { years: "2012–2015", reason: "The unglamorous sweet spot: no turbo, no block issue, simple and durable." },
      { years: "2019–2021", reason: "Oil-dilution software updates applied from the factory and the 10th gen's kinks worked out." },
    ],
    verdict: "The Civic has no bad generation, just bad configurations: an undocumented early 1.5T or an original-block 8th gen. Match the year to its known issue and the Civic is one of the safest used buys there is.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-corolla",
    avoid: [
      { years: "2009–2010", reason: "Piston-ring oil consumption on the 2.4L. Not fatal, but check the dipstick and ask about top-offs before trusting one." },
    ],
    best: [
      { years: "2017–2019", reason: "Late 11th-gen cars: CVT proven by then, Toyota Safety Sense standard from 2017, prices now reasonable." },
      { years: "2020+", reason: "The current generation has been near-flawless; buy the newest your budget allows." },
    ],
    verdict: "There is no Corolla year that should scare you off. The real risk is overpaying for the badge or buying a neglected rideshare car — judge the individual car, not the year.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-camry",
    avoid: [
      { years: "2007–2009", reason: "2.4L oil consumption from piston rings — the one genuinely common Camry engine complaint. Verify oil level and history." },
      { years: "2018", reason: "First year of the current generation: infotainment glitches and early 8-speed tuning quirks. Minor, but 2019+ is cleaner." },
    ],
    best: [
      { years: "2012–2017", reason: "The 2.5L four and V6 of this era are about as durable as engines get, and prices are now excellent." },
      { years: "2019+", reason: "First-year issues sorted; the 2.5 Dynamic Force engine has a strong record." },
    ],
    verdict: "Avoid undocumented 2007–2009 oil-burners and you can buy almost any Camry with confidence. It's the default safe choice in midsize sedans for a reason.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-honda-accord",
    avoid: [
      { years: "2008–2012", reason: "V6 models with VCM: oil consumption and fouled plugs. Four-cylinder cars of the same years are much safer." },
      { years: "2013–2015", reason: "CVT early years on the four-cylinder — durable if serviced, but demand fluid-change proof." },
    ],
    best: [
      { years: "2016–2017", reason: "End of the 9th gen: refined, proven drivetrains, strong value today." },
      { years: "2018–2022 (1.5T with records)", reason: "Great cars when oil-dilution awareness is documented; the 2.0T is the standout engine." },
    ],
    verdict: "Skip undocumented VCM V6s and demand CVT or oil-change records on newer cars. Done right, an Accord routinely outlasts its loan by a decade.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-honda-cr-v",
    avoid: [
      { years: "2017–2018", reason: "Peak 1.5T oil-dilution complaints — fuel mixing into oil in cold climates. Only buy with full records, ideally from a warm state." },
    ],
    best: [
      { years: "2012–2014", reason: "Simple 2.4L with a conventional automatic — the most trouble-free CR-V formula." },
      { years: "2020+", reason: "Software updates and hardware revisions tamed the 1.5T issues; hybrid models are excellent." },
    ],
    verdict: "The CR-V's only real blemish is the early 1.5T oil-dilution era. Either buy older and simpler, or newer and updated — and always check the oil for a fuel smell.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-rav4",
    avoid: [
      { years: "2019–2020", reason: "First years of the current generation: transmission hesitation complaints at low speed and some fuel-tank fill issues. Updates helped; test drive carefully." },
      { years: "2006–2008 (V6)", reason: "Aging now, with oil line and rack complaints — fine with records, risky without." },
    ],
    best: [
      { years: "2016–2018", reason: "End of the previous generation: proven drivetrain, hybrid available, strong value." },
      { years: "2021+", reason: "Early kinks resolved; the hybrid is one of the best used SUV buys outright." },
    ],
    verdict: "RAV4s are reliable across the board; the 2019–2020 transition years just need a more careful test drive. The hybrid versions are the smart-money pick.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ford-f-150",
    avoid: [
      { years: "2004–2010 (5.4L 3V)", reason: "Cam phaser failures, spark plug ejection/breakage — the riskiest F-150 engine era." },
      { years: "2011–2013 (3.5 EcoBoost)", reason: "First-gen EcoBoost: timing chain stretch, condensation-related misfires. Demand records." },
      { years: "2015–2017", reason: "Aluminum-body transition plus 10-speed early years on 2017; also cam phaser rattle returns on some 3.5s." },
    ],
    best: [
      { years: "2014 (5.0)", reason: "The naturally-aspirated 5.0 with the proven 6-speed — simple and strong." },
      { years: "2018–2020 (5.0 or 2.7EB)", reason: "The 2.7 EcoBoost is the quiet reliability star; the 5.0 stays the simple choice." },
    ],
    verdict: "Pick the engine, not just the year: the 2.7 EcoBoost and 5.0 V8 have the best records. A cold-start listen for cam phaser rattle is mandatory on any 3.5 EcoBoost.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-chevrolet-silverado-1500",
    avoid: [
      { years: "2014–2019", reason: "The dense cluster: AFM lifter failures on the 5.3, plus 8-speed torque converter shudder. Documented repairs change the math." },
      { years: "2007–2013 (5.3 AFM)", reason: "Oil consumption from AFM — check level and ask about top-offs." },
    ],
    best: [
      { years: "2014–2018 (6-speed, with lifter repair done)", reason: "A truck with the lifter job already documented removes the biggest unknown." },
      { years: "2022+", reason: "Updated engines and transmission pairings with a cleaner record so far." },
    ],
    verdict: "AFM/DFM lifter risk dominates a Silverado purchase. Buy one with the repair already done, listen cold for ticking, and the rest of the truck is honest.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ram-1500",
    avoid: [
      { years: "2013–2016", reason: "Air suspension failures on equipped trims and early 3.6 Pentastar issues; also check the cam/lifter health on Hemis." },
      { years: "2019", reason: "First year of the new generation plus eTorque debut — more TSBs than the years after." },
    ],
    best: [
      { years: "2017–2018", reason: "Last of the proven previous generation; coil suspension trims avoid air-ride bills." },
      { years: "2020+", reason: "New-gen teething sorted; interior and ride lead the class." },
    ],
    verdict: "Hemi tick, air suspension, and electrical gremlins are the Ram trifecta — all checkable in one inspection. Steel-spring trims with records are the value play.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-nissan-altima",
    avoid: [
      { years: "2013–2016", reason: "The worst CVT years: shudder, overheating, and failures often before 120,000 miles. Nissan extended warranties tell the story." },
    ],
    best: [
      { years: "2019+", reason: "Meaningfully improved CVT and standard safety tech; still cheap used." },
    ],
    verdict: "The Altima is the textbook 'cheap for a reason' car of 2013–2016. Later cars are fairly priced transportation — but any Altima needs a CVT-focused test drive and fluid history.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-nissan-rogue",
    avoid: [
      { years: "2014–2016", reason: "CVT failure complaints peak here — whining, shudder, and replacements. The riskiest mainstream SUV years of the era." },
    ],
    best: [
      { years: "2021+", reason: "The current generation is dramatically better built; the CVT record improved too." },
    ],
    verdict: "A cheap 2014–2016 Rogue is usually pricing in a future CVT bill. Either buy one with a documented CVT replacement or skip to 2021+.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-hyundai-elantra",
    avoid: [
      { years: "2011–2016", reason: "Nu engine ticking/oil consumption complaints plus the key-start theft wave — confirm the anti-theft update and engine health." },
    ],
    best: [
      { years: "2017–2018", reason: "Better build, fewer engine complaints, still cheap." },
      { years: "2021+", reason: "The current car is genuinely competitive and has been reliable." },
    ],
    verdict: "Check two things on any Elantra: engine noise history and the immobilizer update. Both verified, it's one of the best cheap commuters available.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-hyundai-sonata",
    avoid: [
      { years: "2011–2014", reason: "Theta II engine failure epicenter — rod bearings. Only buy with recall/replacement documentation and a silent cold start." },
      { years: "2015–2019 (2.4)", reason: "Same engine family; later but not immune. Documentation still required." },
    ],
    best: [
      { years: "2020+", reason: "New generation, new engines, strong feature value used." },
    ],
    verdict: "The Sonata question is always the engine: replaced under recall (good), documented updates (acceptable), or unknown (walk). A replaced engine with paperwork is genuinely the safe buy.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ford-escape",
    avoid: [
      { years: "2013–2019 (1.5T/1.6T)", reason: "EcoBoost coolant intrusion — the same failure mode as the Fusion. Unexplained coolant loss kills these engines." },
    ],
    best: [
      { years: "2013–2016 (2.5L)", reason: "The fleet-spec 2.5 is the durable, boring choice." },
      { years: "2020+ hybrid", reason: "The hybrid drivetrain has been the bright spot of the current generation." },
    ],
    verdict: "Engine choice is everything: 2.5L or hybrid yes, small EcoBoost only with pristine coolant history. The discount on turbo cars exists for a reason.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ford-explorer",
    avoid: [
      { years: "2011–2017", reason: "Water pump buried inside the engine (a $2,500+ failure that can take the engine with it), plus transmission and PTU complaints." },
      { years: "2020", reason: "Famously rough launch year of the new generation — early build quality and transmission issues." },
    ],
    best: [
      { years: "2018–2019", reason: "Last of the old platform with the kinks known and prices soft." },
      { years: "2021+", reason: "Post-launch fixes applied; still verify the 10-speed shifts cleanly." },
    ],
    verdict: "The internal water pump is the Explorer's defining risk — ask directly if it was done. Soft resale makes a documented Explorer a value play; an undocumented one a gamble.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-chevrolet-equinox",
    avoid: [
      { years: "2010–2017 (2.4L)", reason: "Severe oil consumption from piston rings — the defining Equinox problem. Many burned a quart every 1,000 miles." },
    ],
    best: [
      { years: "2018+ (1.5T with records)", reason: "Different engine, far fewer complaints; just keep up with oil changes." },
    ],
    verdict: "The 2.4L era is the one to skip unless rings/pistons were replaced with paperwork. The newer 1.5T is ordinary in the good sense.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-tacoma",
    avoid: [
      { years: "2005–2010", reason: "Frame rust — Toyota ran a replacement campaign for a reason. Inspect the frame before anything else." },
      { years: "2016–2017", reason: "Early 3rd gen: transmission hunting and rear differential leak complaints; updates helped." },
    ],
    best: [
      { years: "2013–2015", reason: "Late 2nd gen with the frame era behind it — simple and proven." },
      { years: "2018–2023", reason: "3rd-gen kinks resolved; holds value almost annoyingly well." },
    ],
    verdict: "Rust is the Tacoma's only real enemy — the drivetrains are workhorses. Crawl under it with a flashlight, then negotiate hard because asking prices run high.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-jeep-wrangler",
    avoid: [
      { years: "2007–2011 (3.8L)", reason: "Underpowered and oil-thirsty engine, plus the era's interior quality. The weakest modern Wrangler combo." },
      { years: "2012–2013", reason: "First Pentastar years with cylinder head issues, plus the infamous 'death wobble' risk on worn or lifted front ends." },
    ],
    best: [
      { years: "2015–2017 JK", reason: "Mature platform, head issue behind it, huge parts ecosystem." },
      { years: "2019+ JL", reason: "Better everything; verify steering recalls done and no wobble on the test drive." },
    ],
    verdict: "Buy the truck, not the mods: stock or professionally-built Wranglers are dependable, while cheap lifts cause most 'Jeep problems'. Test at highway speed over bumps for wobble.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-subaru-outback",
    avoid: [
      { years: "2010–2012", reason: "End of the head-gasket-prone EJ25 era plus early CVT — double documentation needed." },
      { years: "2013–2014", reason: "FB25 oil consumption class-action years with the early CVT." },
    ],
    best: [
      { years: "2017–2019", reason: "Mature CVT, oil issues largely resolved, strong value." },
      { years: "2020+", reason: "Newest platform; watch only for windshield and electronics quirks." },
    ],
    verdict: "Outbacks reward the records check more than most cars: head gaskets, oil habits, and CVT service tell you everything. Verified, they're superb winter wagons.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-tesla-model-3",
    avoid: [
      { years: "2017–2018", reason: "Early-build panel and paint quality, plus aging original batteries now — get a battery health report." },
    ],
    best: [
      { years: "2021–2022", reason: "Build quality matured, heat pump added, prices dropped hard after the 2023 price wars — strong used value." },
    ],
    verdict: "Model 3 buying is battery-and-build, not engine-and-transmission: a degradation report and a panel inspection replace the mechanic. Used prices are genuinely favorable now.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-highlander",
    avoid: [
      { years: "2008–2010", reason: "Oldest of the oil-cooler-line era — fine if the updated line is fitted, risky if original." },
    ],
    best: [
      { years: "2014–2016", reason: "Proven V6 with the conventional 6-speed — the simplest, strongest combo." },
      { years: "2020+", reason: "Current generation has been quiet; hybrids especially." },
    ],
    verdict: "There's no bad Highlander, only deferred maintenance. Check the oil lines and water pump on older ones and buy on records.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-prius",
    avoid: [
      { years: "2010–2014", reason: "Gen 3's EGR-clogging-to-head-gasket pipeline and $2,000+ brake actuator failures. The riskiest Prius era by far." },
    ],
    best: [
      { years: "2016–2019", reason: "Gen 4 fixed the Gen 3 weaknesses; superb efficiency and reliability." },
      { years: "2023+", reason: "The current car is quicker and has been solid — if budget allows." },
    ],
    verdict: "Gen 3 (2010–2015) needs a head-gasket-aware inspection; Gen 4 onward is back to bulletproof. On any Prius, check the cat hasn't been stolen and get a battery report past 120k.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-sienna",
    avoid: [
      { years: "2011–2013", reason: "Oil cooler line leaks plus the oldest sliding-door hardware — both checkable, neither cheap if ignored." },
    ],
    best: [
      { years: "2015–2020 (doors tested)", reason: "Proven V6 era; just cycle every door function before buying." },
      { years: "2021+", reason: "Hybrid-only generation with a strong record and huge fuel savings." },
    ],
    verdict: "Sienna risk lives in the doors and hoses, not the drivetrain. Test the sliding doors like your purchase depends on it — because repair quotes run $500–$1,500 per side.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-toyota-4runner",
    avoid: [
      { years: "2010–2013 (rust-belt trucks)", reason: "Not a design flaw — just age plus salt. Frame rust is the only common 4Runner killer." },
    ],
    best: [
      { years: "2014–2019", reason: "Same bulletproof drivetrain, newer everything else, easier to find unmodified." },
    ],
    verdict: "Year matters less on a 4Runner than on almost any vehicle — the 5th gen barely changed. Buy the cleanest frame and the least-modified truck you can find.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-honda-pilot",
    avoid: [
      { years: "2009–2011", reason: "VCM oil burning plus torque converter shudder — the highest-complaint Pilot years." },
      { years: "2016", reason: "First-year 9-speed on upper trims shifted poorly; 6-speed trims of the same year are fine." },
    ],
    best: [
      { years: "2012–2015 (with records)", reason: "VCM still present but manageable; otherwise mature and roomy." },
      { years: "2019+", reason: "Transmission updates landed; the current gen has been solid." },
    ],
    verdict: "VCM oil consumption and the timing belt schedule define Pilot buying. Records plus a current dipstick check beat any year-picking strategy.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-honda-odyssey",
    avoid: [
      { years: "2014–2017", reason: "Torque converter shudder layered on VCM oil consumption — the most complained-about Odyssey window." },
    ],
    best: [
      { years: "2011–2013 (documented)", reason: "Older but simpler; budget the timing belt." },
      { years: "2020+", reason: "10-speed sorted, doors improved, strongest recent record." },
    ],
    verdict: "Drive an Odyssey at light throttle around 40 mph before talking price — shudder is the tell. Oil level and door function complete the three-check inspection.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-mazda-3",
    avoid: [
      { years: "2010–2013 (salt states)", reason: "Rust at the rear arches and rockers — the era's main weakness. Southern cars are fine." },
    ],
    best: [
      { years: "2014–2018 (headlights verified)", reason: "Skyactiv era: efficient, reliable, cheap to run." },
      { years: "2019+", reason: "Upscale cabin, same dependable mechanicals — the bargain entry-luxury car." },
    ],
    verdict: "Rust check on old ones, headlight check on middle ones, and that's the whole Mazda3 risk list. One of the best value compacts on the used market.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-mazda-cx-5",
    avoid: [
      { years: "2013–2014", reason: "Nothing serious — just first-year refinement gaps and aging infotainment. The closest the CX-5 has to weak years." },
    ],
    best: [
      { years: "2017–2020", reason: "Second generation: nicer cabin, same proven drivetrain, prices now attractive." },
    ],
    verdict: "The CX-5 has no scary years — headlights and wheel bearings are the recurring costs, and both announce themselves. Buy on condition and records.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-subaru-forester",
    avoid: [
      { years: "2014–2016", reason: "Oil-consumption engine plus the early CVT in one package — the highest-risk Forester combination." },
      { years: "2011–2013", reason: "FB25 oil consumption (class-action era); fine with proof of top-off-free running." },
    ],
    best: [
      { years: "2017–2018", reason: "CVT matured, oil issues largely resolved." },
      { years: "2019+", reason: "Cleanest record; quirks are windshields and batteries, not drivetrains." },
    ],
    verdict: "Dipstick now, CVT records always, four matched tires — the three Forester rules. Pass all three and it's a dependable snow-country choice.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-subaru-crosstrek",
    avoid: [
      { years: "2013–2015", reason: "Oil consumption plus early CVT — same story as the Forester of those years." },
    ],
    best: [
      { years: "2018–2021", reason: "Second gen: better everything; most complaints are minor (windshields, infotainment)." },
    ],
    verdict: "Crosstreks hold value so well that a cheap one demands suspicion. Verify oil habits and CVT service, then expect boring dependability.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-chevrolet-malibu",
    avoid: [
      { years: "2016–2018 (1.5T)", reason: "Oil consumption and turbo failures on the small turbo — the engine to skip without records." },
    ],
    best: [
      { years: "2013–2015 (2.5L)", reason: "Simple port-injected four with a conventional auto — the durable budget pick." },
      { years: "2019+ (2.0T)", reason: "The stronger engine with fewer complaints, at heavy depreciation discounts." },
    ],
    verdict: "Malibus are cheap transportation done right if you pick the engine right: 2.5 or 2.0T yes, undocumented 1.5T no.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-chevrolet-tahoe",
    avoid: [
      { years: "2015–2020", reason: "Peak AFM/DFM lifter complaint years on the 5.3 — buy with the repair documented or a perfect cold start." },
      { years: "2007–2009", reason: "Oldest AFM era plus interior electronics aging — dash cracks, door locks, HVAC doors." },
    ],
    best: [
      { years: "2021+", reason: "New generation with independent rear suspension and updated engines — strongest record." },
    ],
    verdict: "One sound decides a Tahoe purchase: the cold start. Ticking or misfire history means a lifter job is in the price, whether the seller admits it or not.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-gmc-sierra-1500",
    avoid: [
      { years: "2014–2019", reason: "Lifter failures plus 8-speed shudder — the same cluster as the Silverado twin." },
    ],
    best: [
      { years: "2020+", reason: "10-speed pairing and updated engines pushed complaint rates down." },
      { years: "2014–2019 (repairs documented)", reason: "A truck with lifter and fluid work done is de-risked at a discount." },
    ],
    verdict: "Treat Sierra and Silverado as the same truck: cold-start listen, highway vibration test, and ask about the torque converter fluid exchange by name.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ford-fusion",
    avoid: [
      { years: "2013–2019 (1.5T/1.6T)", reason: "Coolant intrusion into cylinders kills these engines. Unexplained coolant loss is a walk-away, not a haggle." },
    ],
    best: [
      { years: "2014–2020 (2.5L or Hybrid)", reason: "Fleet-proven engines that shrug off 200,000 miles, at sedan-market discount prices." },
    ],
    verdict: "The Fusion is two different cars: the durable 2.5/hybrid and the risky small EcoBoost. The badge discount makes the right engine a legitimate bargain.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-ford-mustang",
    avoid: [
      { years: "2011–2014 (manual)", reason: "MT82 gearbox complaints — notchy, crunchy cold shifts. Autos of the same years are fine." },
      { years: "2015–2017 (tuned EcoBoost)", reason: "Head gasket risk multiplies with a tune. Stock cars are fine; modified ones need proof." },
    ],
    best: [
      { years: "2018+ (5.0)", reason: "The Gen 3 Coyote with the 10-speed or improved manual — durable and quick." },
    ],
    verdict: "Mustang years matter less than Mustang owners. A stock, insured, garage-kept car of any year beats a modified 'deal' — inspect for crash repair and launches, not just the model year.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-jeep-grand-cherokee",
    avoid: [
      { years: "2011–2013", reason: "The trifecta years: early Pentastar head failures, TIPM electrical gremlins, and aging air suspension on equipped trims." },
      { years: "2014–2015", reason: "Monostable shifter recall (rollaway risk) plus first-year 8-speed quirks — verify recalls by VIN." },
    ],
    best: [
      { years: "2017–2021", reason: "Mature WK2: known quantities, strong V6/V8, much better electrics." },
    ],
    verdict: "A documented 2017+ on steel springs is a dependable family truck; a vague-history 2011–2014 on air suspension is a repair subscription. The inspection decides which one you're looking at.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-kia-sorento",
    avoid: [
      { years: "2011–2019 (2.4/2.0T, undocumented)", reason: "Theta II rod-bearing failure years. No recall paperwork and no cold-start listen means no purchase." },
    ],
    best: [
      { years: "2016–2020 (V6)", reason: "The 3.3 V6 sidesteps the Theta issue entirely — the safe Sorento." },
      { years: "2021+", reason: "New generation, new engines, good early record." },
    ],
    verdict: "Sorento buying is engine triage: V6 safe, replaced-under-recall four acceptable with paperwork, undocumented Theta II a pass. Also confirm the anti-theft update on key-start cars.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-hyundai-tucson",
    avoid: [
      { years: "2016–2018 (1.6T DCT)", reason: "Dual-clutch hesitation from stops — worst uphill. Test it in traffic before you commit." },
    ],
    best: [
      { years: "2019–2021 (2.4 with records)", reason: "Conventional automatic and known engine — just verify oil habits." },
      { years: "2022+", reason: "Current generation has been the strongest Tucson yet." },
    ],
    verdict: "Drive a DCT Tucson on a hill and check any 2.0/2.4's dipstick — those two tests cover most of the risk. The 2022+ redesign is the comfortable choice.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-volkswagen-jetta",
    avoid: [
      { years: "2011–2013 (TSI)", reason: "Timing chain tensioner failures can destroy the engine without warning beyond a cold-start rattle. Updated-tensioner proof or walk." },
    ],
    best: [
      { years: "2011–2014 (2.5L)", reason: "The five-cylinder is unfashionable and nearly unkillable — the sleeper buy." },
      { years: "2019+", reason: "The 1.4T has a solid record and excellent economy." },
    ],
    verdict: "VW buying is a records game: tensioner, water pump, DSG fluid, carbon cleaning. Every receipt present, the Jetta is a refined bargain; receipts missing, keep shopping.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-lexus-rx-350",
    avoid: [
      { years: "2010–2012 (neglected)", reason: "Not bad cars — just the oldest, where skipped luxury maintenance shows. Water pump and oil line checks required." },
    ],
    best: [
      { years: "2016–2019", reason: "Modern safety and infotainment with the same indestructible V6, now at reasonable prices." },
    ],
    verdict: "The RX has no bad years — only neglected owners. The service folder is the product; buy the thickest one.",
    updatedAt: UPDATED,
  },
  {
    slug: "used-jeep-cherokee",
    avoid: [
      { years: "2014–2016", reason: "The worst of the ZF 9-speed's shifting problems and the 2.4L's oil consumption landed here. Without transmission updates and oil records, pass." },
    ],
    best: [
      { years: "2019–2023 (V6)", reason: "Software matured, the 3.2L V6 avoids the oil-consumption pattern, and depreciation makes these cheap for what they are." },
    ],
    verdict: "The Cherokee's bad reputation was earned early and priced in everywhere. That makes a documented late V6 car a quiet bargain, and an undocumented 2014 exactly as risky as it looks.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-ford-focus",
    avoid: [
      { years: "2012–2016 (automatic)", reason: "The PowerShift dual-clutch: shudder, clutch failures, TCM faults, class action. Only consider one with fresh documented clutch and module work." },
    ],
    best: [
      { years: "2012–2018 (manual)", reason: "The stick avoids the PowerShift entirely; the same car becomes cheap, honest transport." },
      { years: "2008–2011", reason: "Conventional automatic, simple mechanicals; rust is the only real enemy." },
    ],
    verdict: "One transmission decision defines this car. Manuals and pre-2012 autos are safe money; a 2012–2016 automatic without a paper trail is the classic used-car trap.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-nissan-sentra",
    avoid: [
      { years: "2013–2017", reason: "The class's worst CVT record: shudder, overheating, failure. Nissan extended the warranty because it had to." },
    ],
    best: [
      { years: "2020+", reason: "New platform, better CVT, standard safety tech, and a genuinely competitive car. Night and day versus the old one." },
    ],
    verdict: "The Sentra is a transmission bet. Skip the 2013–2017 cars unless the CVT was replaced, and stretch to 2020+ where the bet mostly disappears.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-toyota-tundra",
    avoid: [
      { years: "2007–2013 (unchecked)", reason: "Not bad trucks, but the air injection pump and salt-state frame rust need inspecting before money moves." },
      { years: "2022–2023 (recall open)", reason: "The twin-turbo V6 machining-debris recall replaced engines. Only buy with completion paperwork." },
    ],
    best: [
      { years: "2014–2021", reason: "The 5.7 V8's mature years: air pump issues largely behind it, frames better protected, and the drivetrain is one of the most durable ever put in a truck." },
    ],
    verdict: "There is no genuinely bad Tundra, just two homework items: old-truck inspection up front, recall paperwork at the back. The 2014–2021 V8 is the safe center of the range.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-honda-hr-v",
    avoid: [
      { years: "2016–2018 (no CVT records)", reason: "The only pattern that costs money is a neglected CVT plus the knobless touchscreen era's gremlins. Records fix the first; patience fixes the second." },
    ],
    best: [
      { years: "2019–2022", reason: "Volume knob returned, CVT proven, prices reasonable." },
      { years: "2023+", reason: "The redesign fixes power and refinement complaints while keeping Honda reliability." },
    ],
    verdict: "The HR-V has no dangerous years, only annoying ones. Buy on CVT service evidence and let the refinement complaints discount the price for you.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-chevrolet-traverse",
    avoid: [
      { years: "2009–2013", reason: "Timing chain stretch and the 3-5-reverse wave plate in one vehicle: two four-figure failures stacked on the same purchase." },
    ],
    best: [
      { years: "2021+", reason: "Second generation with its early software sorted; the cheapest dependable route to real eight-seat space." },
    ],
    verdict: "Treat first-generation Traverses as guilty until proven documented. The 2018+ trucks, and especially 2021+, turn the Traverse into the value play it always promised to be.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-ford-edge",
    avoid: [
      { years: "2015–2018 (2.0 EcoBoost)", reason: "Coolant intrusion can end in an engine replacement. No coolant-loss documentation, no deal." },
      { years: "2007–2010 (AWD, original PTU)", reason: "The power transfer unit is a known consumable nobody serviced; by now an original one is overdue." },
    ],
    best: [
      { years: "2019+", reason: "Revised engines, the 8-speed, and the PTU story improved; the record cleans up noticeably." },
    ],
    verdict: "The Edge is a fine crossover wearing two known traps. FWD sidesteps one, 2019+ largely sidesteps the other, and a pre-purchase inspection covers whatever's left.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-hyundai-santa-fe",
    avoid: [
      { years: "2010–2019 (undocumented Theta II)", reason: "Rod-bearing failure and fire recalls are the defining risk. Without campaign paperwork you are buying a lottery ticket." },
    ],
    best: [
      { years: "2021+", reason: "New generation, new engines, excellent safety scores, and almost none of the old drama." },
      { years: "2016–2019 (campaign engine)", reason: "A documented replacement engine plus closed recalls makes these quietly underpriced." },
    ],
    verdict: "Santa Fe buying is paperwork buying. The same car is either a proven value with a fresh campaign engine or an uninsurable risk without one; the VIN report decides which.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-kia-sportage",
    avoid: [
      { years: "2011–2016 (undocumented)", reason: "Theta II engine seizure and fire-recall years. Campaign completion and engine paperwork or walk." },
    ],
    best: [
      { years: "2017–2022", reason: "Steadier record, cheap to buy, and the knock-sensor software adds a safety net." },
      { years: "2023+", reason: "New generation with hybrid economy and warranty left on the clock; one of the best used values in the class." },
    ],
    verdict: "Same Theta II script as the Santa Fe: the paperwork is the product on early cars. Later Sportages are boring in the best way.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-chrysler-pacifica",
    avoid: [
      { years: "2017–2018", reason: "Transmission complaints, electrical gremlins, a stalling recall, and the Hybrid's battery fire recall all concentrated here. Every recall must be closed." },
    ],
    best: [
      { years: "2021+", reason: "The refresh year: cleaner record, available AWD, and the best-driving minivan of the era at a used discount." },
    ],
    verdict: "The Pacifica rewards buying late. A 2021+ van with closed recalls is a family bargain; a 2017 without paperwork is how minivan horror stories start.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-dodge-charger",
    avoid: [
      { years: "2011–2014 (unverified TIPM)", reason: "The power module's fuel-relay failures cause no-starts and stranded owners. Ask for the fix history; aftermarket solutions exist and work." },
    ],
    best: [
      { years: "2015–2019", reason: "The ZF 8-speed arrived, electrics improved, and clean examples predate the worst of the theft-era abuse." },
    ],
    verdict: "Chargers fail by biography, not by design: the mechanicals are stout, so the real screening is title history, tune evidence, and how the last owner drove it.",
    updatedAt: "2026-07-11",
  },
  {
    slug: "used-tesla-model-y",
    avoid: [
      { years: "2020–2021 (sight unseen)", reason: "Early build quality: panel gaps, paint, rattles. Nothing dangerous, but never buy one without an in-person inspection." },
    ],
    best: [
      { years: "2023+", reason: "Build quality matured, the heat pump issues were addressed, and used prices dropped hard off the 2022 peak." },
    ],
    verdict: "The battery and motors are the trustworthy part; the checklist is bodywork, heat pump history, and title status. A range test tells you more than the odometer ever will.",
    updatedAt: "2026-07-11",
  },
];

export function getYearsToAvoid(slug: string) {
  return yearsToAvoid.find((e) => e.slug === slug);
}
