export const BRAND = "Kanjira’s Luxeves Pavilion";
export const INSTAGRAM = "https://www.instagram.com/kanjiras_luxeves_pavilion/";
export const FILM_URL = "https://videos.pexels.com/video-files/3772577/3772577-hd_1920_1080_25fps.mp4";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/destination", label: "The Destination" },
  { to: "/celebrations", label: "Celebrations" },
  { to: "/amenities", label: "Amenities" },
  { to: "/gallery", label: "Gallery" },
  { to: "/venues", label: "Venues & Booking" },
  { to: "/contact", label: "Plan Your Day" },
] as const;

export const COLLECTIONS = ["The Gathering", "The Signature", "The Wedding Weekend"] as const;

export const CELEBRATION_TYPES = [
  "Intimate Wedding",
  "Grand Wedding & Reception",
  "Wedding Weekend",
  "Engagement",
  "Haldi, Mehndi or Sangeet",
  "Reception",
  "Private Celebration",
];

export const AMENITIES = [
  { id: "parking", title: "Guest parking & arrival", text: "Thoughtful arrival arrangements so every guest is welcomed calmly from the moment they arrive." },
  { id: "bridal", title: "Bridal preparation rooms", text: "Quiet, light-filled spaces for getting ready, with room for family and your styling team." },
  { id: "stay", title: "Guest accommodation", text: "Options for keeping loved ones close through the celebration, discussed with your planner." },
  { id: "dining", title: "Dining & catering", text: "Menus shaped around your family’s traditions, tastes and the rhythm of the day." },
  { id: "lighting", title: "Event lighting", text: "Warm, layered lighting that carries the glow of dusk well into the evening." },
  { id: "power", title: "Power backup", text: "Planning for uninterrupted celebrations, from ceremony music to the last dance." },
  { id: "sound", title: "Sound & entertainment", text: "Support for live performers, DJs and ceremonial music across every setting." },
  { id: "wifi", title: "Wi-Fi & connectivity", text: "Connectivity for live streams, vendors and guests sharing the moment." },
  { id: "access", title: "Accessibility", text: "Considered access for elders and guests with mobility needs, planned in advance." },
  { id: "comfort", title: "Washrooms & family comfort", text: "Clean, comfortable facilities and quiet corners for families with children and elders." },
  { id: "weather", title: "Covered spaces & weather planning", text: "Sheltered alternatives so your plans stay graceful, whatever the sky decides." },
  { id: "vendors", title: "Vendor access & coordination", text: "Clear access and scheduling for decorators, caterers, photographers and artists." },
] as const;

export const CONTACT = {
  phones: [
    { display: '+91 95 77 33 11 22', tel: '+919577331122' },
    { display: '+91 99 95 12 77 99', tel: '+919995127799' },
    { display: '+91 99 95 42 77 99', tel: '+919995427799' },
  ],
  whatsapp: 'https://wa.me/919577331122',
  address: 'Boattukadavu, Vadakkummuri, Triprayar, Thrissur, India',
  map: 'https://www.google.com/maps/search/?api=1&query=Kanjiras%20Luxeves%20Pavilion%20Triprayar%20Thrissur',
  mapEmbed: 'https://maps.google.com/maps?q=Kanjiras%20Luxeves%20Pavilion%20Triprayar%20Thrissur&output=embed',
} as const;
