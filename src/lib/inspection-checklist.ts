// Typed data for the used car inspection checklist (/inspection-checklist).
// Kept separate from the component so it's easy to test and to extend.

export type ChecklistItem = {
  id: string;
  label: string;
  hint?: string;
};

export type ChecklistGroup = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export const inspectionChecklist: ChecklistGroup[] = [
  {
    id: "exterior",
    title: "Exterior",
    items: [
      { id: "ext-panel-gaps", label: "Panel gaps are even on all sides", hint: "Uneven gaps can mean prior accident repair" },
      { id: "ext-paint-match", label: "Paint color and texture match across every panel" },
      { id: "ext-rust", label: "No rust on rocker panels, wheel wells, or frame" },
      { id: "ext-glass", label: "Windshield and windows free of cracks or deep chips" },
      { id: "ext-lights", label: "Headlights, taillights, and turn signals all work" },
      { id: "ext-tires-tread", label: "Tire tread is even and above 4/32\"", hint: "Uneven wear can signal alignment or suspension issues" },
      { id: "ext-tires-match", label: "All four tires match in brand and size" },
      { id: "ext-doors", label: "All doors, hood, and trunk open, close, and latch properly" },
    ],
  },
  {
    id: "interior",
    title: "Interior",
    items: [
      { id: "int-seats", label: "Seats free of excessive wear, tears, or stains" },
      { id: "int-odometer", label: "Odometer reading matches the listing and title" },
      { id: "int-wear-vs-miles", label: "Wear on pedals, seat, and wheel is consistent with the mileage" },
      { id: "int-ac-heat", label: "Air conditioning and heat both blow cold/hot" },
      { id: "int-windows", label: "Power windows and locks all operate" },
      { id: "int-dash-lights", label: "No warning lights stay on after startup" },
      { id: "int-electronics", label: "Infotainment, backup camera, and gauges all work" },
      { id: "int-smell", label: "No smoke, mildew, or musty smell" },
      { id: "int-spare", label: "Spare tire (or repair kit) and jack are present" },
    ],
  },
  {
    id: "engine",
    title: "Engine & mechanical",
    items: [
      { id: "eng-oil", label: "Engine oil is not dark, gritty, or low" },
      { id: "eng-leaks", label: "No visible leaks around the engine or under the hood" },
      { id: "eng-belts-hoses", label: "Belts and hoses show no cracking or fraying" },
      { id: "eng-battery", label: "Battery terminals are clean, no corrosion" },
      { id: "eng-coolant", label: "Coolant is at the correct level and not milky/rusty" },
      { id: "eng-noise-idle", label: "Engine idles smoothly with no unusual noise" },
      { id: "eng-exhaust-smoke", label: "No blue, black, or excessive white smoke from the exhaust" },
      { id: "eng-transmission-fluid", label: "Transmission fluid (if checkable) is not dark or burnt-smelling" },
      { id: "eng-check-engine", label: "Check engine and other warning lights are off" },
    ],
  },
  {
    id: "test-drive",
    title: "Test drive",
    items: [
      { id: "td-start", label: "Engine starts promptly, cold and warm" },
      { id: "td-shifting", label: "Transmission shifts smoothly with no hesitation or clunking" },
      { id: "td-brakes", label: "Brakes stop straight with no pulling, grinding, or pulsing" },
      { id: "td-steering", label: "Steering is centered and doesn't pull to one side" },
      { id: "td-suspension", label: "No excessive bouncing or noise over bumps" },
      { id: "td-alignment", label: "Car tracks straight on a flat road without correcting" },
      { id: "td-highway", label: "No vibration or noise at highway speed" },
      { id: "td-reverse", label: "Reverse engages smoothly and backup sensors/camera work" },
      { id: "td-parking", label: "Parking brake holds the car on an incline" },
    ],
  },
  {
    id: "paperwork",
    title: "Paperwork & history",
    items: [
      { id: "doc-title", label: "Title is clean, in the seller's name, and matches the VIN" },
      { id: "doc-vin-match", label: "VIN on the dash, door jamb, and title all match" },
      { id: "doc-history-report", label: "Vehicle history report reviewed (accidents, title brands, owners)" },
      { id: "doc-maintenance", label: "Maintenance records or receipts available" },
      { id: "doc-recalls", label: "Checked for open safety recalls on the VIN" },
      { id: "doc-liens", label: "No outstanding lien on the title" },
      { id: "doc-registration", label: "Current registration matches the vehicle and seller" },
      { id: "doc-deal-score", label: "Ran the listing through DealScan for a deal score" },
      { id: "doc-inspection", label: "Independent pre-purchase inspection scheduled or completed" },
    ],
  },
];

export const totalChecklistItems = inspectionChecklist.reduce(
  (sum, group) => sum + group.items.length,
  0,
);
