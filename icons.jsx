// icons.jsx — Single source of truth for line icons (Lucide-style, 1.6 stroke).
// All icons are 24×24 viewBox, currentColor stroke. Size via width/height props.

const I = ({ d, size = 18, fill = false, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
       strokeLinejoin="round" {...rest}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icon = {
  Home: (p) => <I {...p} d="M3 11l9-8 9 8M5 10v10h14V10" />,
  Car: (p) => <I {...p} d={
    <>
      <path d="M5 17V11l2.5-5.5h9L19 11v6" />
      <path d="M3 17h18v3H3z" />
      <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
      <path d="M5 11h14" />
    </>
  } />,
  Wrench: (p) => <I {...p} d="M14.7 6.3a4 4 0 015.6 5.4l-3.5-3.5-2.1 2.1 3.5 3.5a4 4 0 01-5.4-5.6L3 17l4 4 9.7-9.7z" />,
  Drop: (p) => <I {...p} d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z" />,
  Bolt: (p) => <I {...p} d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  Calendar: (p) => <I {...p} d={
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  } />,
  Bell: (p) => <I {...p} d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 004 0" />,
  Plus: (p) => <I {...p} d="M12 5v14M5 12h14" />,
  PlusCircle: (p) => <I {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>} />,
  ChevronRight: (p) => <I {...p} d="M9 6l6 6-6 6" />,
  ChevronLeft: (p) => <I {...p} d="M15 6l-6 6 6 6" />,
  ChevronDown: (p) => <I {...p} d="M6 9l6 6 6-6" />,
  X: (p) => <I {...p} d="M6 6l12 12M6 18L18 6" />,
  Check: (p) => <I {...p} d="M5 12l5 5L20 7" />,
  Camera: (p) => <I {...p} d={<><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>} />,
  Doc: (p) => <I {...p} d={<><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" /></>} />,
  Gauge: (p) => <I {...p} d={<><circle cx="12" cy="13" r="8" /><path d="M12 13l3.5-3.5M5 13h2M17 13h2M12 8V6" /></>} />,
  Pump: (p) => <I {...p} d={<><path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16H4z" /><path d="M4 12h10M14 8h3l2 2v8a2 2 0 11-4 0V9" /></>} />,
  Tire: (p) => <I {...p} d={<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></>} />,
  Filter: (p) => <I {...p} d="M3 5h18l-7 9v6l-4-2v-4z" />,
  Settings: (p) => <I {...p} d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" /></>} />,
  Battery: (p) => <I {...p} d={<><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2" /></>} />,
  Flash: (p) => <I {...p} d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  History: (p) => <I {...p} d={<><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8" /><path d="M3 3v5h5" /><path d="M12 8v5l3 2" /></>} />,
  Search: (p) => <I {...p} d={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>} />,
  Edit: (p) => <I {...p} d="M11 4H5a2 2 0 00-2 2v13a2 2 0 002 2h13a2 2 0 002-2v-6m-2-9l3 3-9 9H8v-3z" />,
  Trash: (p) => <I {...p} d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />,
  Pin: (p) => <I {...p} d="M12 21v-7M8 3h8l-1 7H9zM6 10h12" />,
  Receipt: (p) => <I {...p} d={<><path d="M4 3h16v18l-3-2-3 2-2-2-2 2-3-2-3 2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>} />,
  Leaf: (p) => <I {...p} d="M3 21c0-8 5-13 18-13 0 8-5 13-18 13zM3 21c4-4 8-7 12-9" />,
  Sparkle: (p) => <I {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  Map: (p) => <I {...p} d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z M9 4v16 M15 6v16" />,
};

window.Icon = Icon;
