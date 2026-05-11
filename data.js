// data.js — Mock data for car maintenance tracker.
// Single hybrid vehicle (2023 Toyota Prius Prime) — chosen to exercise both
// gas and EV displays.

window.CAR_DATA = {
  vehicle: {
    nickname: 'My Prius',
    year: 2023,
    make: 'Toyota',
    model: 'Prius Prime',
    trim: 'XSE',
    color: 'Supersonic Red',
    plate: '8NXY-302',
    vin: 'JTDKAMFP•••72841',
    odometer: 28450,
    odometerUnit: 'mi',
    type: 'PHEV',
    purchased: '2023-04-12',
  },

  energy: {
    fuelPercent: 78,
    fuelGallons: 8.4,
    fuelCapacity: 10.6,
    fuelRangeMi: 384,
    batteryPercent: 84,
    batteryKwh: 7.2,
    batteryCapacityKwh: 8.8,
    evRangeMi: 39,
    avgMpg: 54.1,
    avgMpge: 89.2,
  },

  // Health summary
  health: {
    score: 86,
    statusText: 'Good — 1 item overdue',
  },

  upcoming: [
    {
      id: 'tire-rot',
      title: 'Tire rotation',
      icon: 'Tire',
      status: 'bad',
      statusLabel: 'Overdue',
      dueLabel: '220 mi past due',
      detail: 'Recommended every 5,000 mi',
    },
    {
      id: 'oil',
      title: 'Engine oil & filter',
      icon: 'Drop',
      status: 'warn',
      statusLabel: 'Due soon',
      dueLabel: 'In 1,550 mi',
      detail: 'Recommended every 5,000 mi',
    },
    {
      id: 'cabin',
      title: 'Cabin air filter',
      icon: 'Filter',
      status: 'warn',
      statusLabel: 'Due soon',
      dueLabel: 'At 30,000 mi',
      detail: '~1,550 mi away',
    },
    {
      id: 'inspection',
      title: 'State inspection',
      icon: 'Doc',
      status: 'ok',
      statusLabel: 'Scheduled',
      dueLabel: 'In 89 days',
      detail: 'Renewal Aug 8, 2026',
    },
    {
      id: 'wipers',
      title: 'Wiper blades',
      icon: 'Drop',
      status: 'ok',
      statusLabel: 'OK',
      dueLabel: 'Visual check',
      detail: 'Replaced 3 mo ago',
    },
  ],

  recent: [
    {
      id: 'r1',
      date: '2026-04-22',
      title: 'Oil change',
      shop: 'Toyota of Cedar Park',
      cost: 89.40,
      mileage: 26000,
      icon: 'Drop',
      tag: 'ok',
    },
    {
      id: 'r2',
      date: '2026-03-08',
      title: '12V battery replacement',
      shop: 'Discount Tire',
      cost: 168.20,
      mileage: 25240,
      icon: 'Battery',
      tag: 'info',
    },
    {
      id: 'r3',
      date: '2026-01-14',
      title: 'Tire rotation + alignment',
      shop: 'Self · garage',
      cost: 22.00,
      mileage: 23510,
      icon: 'Tire',
      tag: 'ok',
    },
    {
      id: 'r4',
      date: '2025-11-02',
      title: 'Cabin air + engine filter',
      shop: 'Self · garage',
      cost: 41.80,
      mileage: 21420,
      icon: 'Filter',
      tag: 'ok',
    },
    {
      id: 'r5',
      date: '2025-08-19',
      title: 'State inspection',
      shop: 'Jiffy Lube #443',
      cost: 25.50,
      mileage: 18950,
      icon: 'Doc',
      tag: 'info',
    },
    {
      id: 'r6',
      date: '2025-06-04',
      title: 'New all-season tires (4)',
      shop: 'Discount Tire',
      cost: 612.00,
      mileage: 16800,
      icon: 'Tire',
      tag: 'info',
    },
  ],

  fuel: [
    { id: 'f1', date: '2026-05-04', gallons: 8.2, total: 28.70, mpg: 54.3, mileage: 28220, station: 'Costco' },
    { id: 'f2', date: '2026-04-19', gallons: 7.9, total: 27.65, mpg: 56.1, mileage: 27780, station: 'Shell' },
    { id: 'f3', date: '2026-04-06', gallons: 8.4, total: 31.30, mpg: 52.8, mileage: 27340, station: 'Costco' },
    { id: 'f4', date: '2026-03-22', gallons: 7.6, total: 27.50, mpg: 55.4, mileage: 26900, station: 'Buc-ee\'s' },
    { id: 'f5', date: '2026-03-09', gallons: 8.1, total: 29.80, mpg: 53.7, mileage: 26480, station: 'Costco' },
  ],

  docs: [
    { id: 'd1', title: 'Insurance policy', issuer: 'GEICO', expires: '2026-09-12', icon: 'Doc' },
    { id: 'd2', title: 'Registration', issuer: 'TX DMV', expires: '2027-04-30', icon: 'Doc' },
    { id: 'd3', title: 'Owner\'s manual.pdf', issuer: 'Toyota', expires: null, icon: 'Doc' },
    { id: 'd4', title: 'Warranty — battery', issuer: 'Toyota', expires: '2033-04-12', icon: 'Doc' },
  ],

  expense: {
    ytd: 1147.30,
    perMile: 0.084,
    breakdown: [
      { label: 'Maintenance', value: 401.30, pct: 35 },
      { label: 'Fuel', value: 458.50, pct: 40 },
      { label: 'Insurance', value: 287.50, pct: 25 },
    ],
  },
};

// Helper — relative date.
window.relDate = (iso) => {
  const d = new Date(iso);
  const now = new Date('2026-05-11');
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `in ${diff}d`;
  if (diff === 0) return 'today';
  if (diff > -7) return `${-diff}d ago`;
  if (diff > -60) return `${Math.round(-diff / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

window.fmtMiles = (n) => n.toLocaleString('en-US');
window.fmtMoney = (n) => '$' + n.toFixed(2);
