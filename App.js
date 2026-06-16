import { useState, useEffect } from "react";

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────
// Saves checked tasks to localStorage so they persist across sessions
const STORAGE_KEY = "datboydebo_tasks_v1";

const EVENT_DATE = new Date("2026-07-03T16:00:00");

const CONTACTS = [
  { role: "Event Host", name: "Kaedyn (Deebo / DATBOYDEBO)", phone: "+1 (360) 878-2132", email: "" },
  { role: "Core Team", name: "Seven (07wilsonn)", phone: "(326) 212-0698", email: "" },
  { role: "Core Team — Assistant", name: "KP", phone: "iMessage", email: "" },
  { role: "Venue Manager", name: "Hype Nito", phone: "310-901-2041 / 480-370-7373", email: "nitosevilla1997@gmail.com" },
  { role: "Security Lead (8 guards)", name: "Tony", phone: "520-476-4306", email: "" },
  { role: "Head Bartender + Full Staff", name: "Savage", phone: "+1 (480) 620-5912", email: "Full staff: bartenders + bottle girls for high capacity" },
  { role: "Licensed Bartender", name: "Bria", phone: "480-440-0245", email: "" },
  { role: "Photographer / Videographer", name: "Photog Yash", phone: "+1 (602) 813-3887", email: "Recap in queue — will tag on distribution" },
];

const ACTIVATIONS = [
  { id: 1,  name: "Red Carpet #1 — Garage Entry",     emoji: "🎬", status: "confirmed",    vendor: "Reserved ✅",    cost: "$80",  notes: "📍 Ocotillo Garage entrance. Red carpet + step & repeat + stanchions. First guest touchpoint. Branded flag on front deck panel. Directional signage from entry." },
  { id: 2,  name: "Red Carpet #2 — Pool Overlook",    emoji: "🌅", status: "in-progress",  vendor: "Needs setup",    cost: "TBD",  notes: "📍 Right side deck near pool, overlooking mountain. Second step & repeat with red carpet. Premium photo content moment. Media partners bring props + lighting." },
  { id: 3,  name: "Movie Room Gaming Lounge",          emoji: "🎮", status: "in-progress",  vendor: "Sponsor needed", cost: "TBD",  notes: "📍 Ocotillo main house movie room. 3 TVs / 3 games. SPONSORED — step & repeat + signage. Media partners supply props + lighting. Wired internet required." },
  { id: 4,  name: "Networking Bingo",                 emoji: "🎱", status: "in-progress",  vendor: "Design + Print", cost: "TBD",  notes: "Icebreaker at check-in. Complete squares by connecting with attendees. First BINGO wins merch or VIP wristband upgrade. Bingo host needed at check-in table." },
  { id: 5,  name: "360 Video Booth",                  emoji: "🔄", status: "in-progress",  vendor: "Needs booking",  cost: "TBD",  notes: "📍 Courtyard (Zone 1) or Oasis (Zone 2). Event branding overlay + instant QR delivery. Find Phoenix vendor." },
  { id: 6,  name: "Signature Photo Area",             emoji: "📸", status: "in-progress",  vendor: "Needs setup",    cost: "TBD",  notes: "📍 Pool / Oasis (Zone 2). Mountain view backdrop, pro lighting, branded signage. Media partners bring props + lighting." },
  { id: 7,  name: "Vendor Zone — Covered Front Area", emoji: "🏪", status: "in-progress",  vendor: "Recruit vendors", cost: "TBD", notes: "📍 Right side front — covered + cooled with casino slots. PRIME vendor real estate. Fill first. Power access needed." },
  { id: 8,  name: "Vendor Zone — Garage",             emoji: "🛒", status: "in-progress",  vendor: "Recruit vendors", cost: "TBD", notes: "📍 Garage. Secondary vendor zone alongside red carpet flow." },
  { id: 9,  name: "Vendor Zone — Right Side Deck",    emoji: "🎪", status: "in-progress",  vendor: "Recruit vendors", cost: "TBD", notes: "📍 Right side deck near DJ + bar flow." },
  { id: 10, name: "Vendor Zone — Pool & Bar Area",    emoji: "🍹", status: "in-progress",  vendor: "Recruit vendors", cost: "TBD", notes: "📍 Near pool and bar. Main party zone vendors. Misters or swamp coolers needed." },
  { id: 11, name: "Dunk Tank",                        emoji: "💦", status: "sourcing",     vendor: "Reserved ✅",    cost: "$250", notes: "📍 PLACEMENT TBD — concrete slab + water source. Decide by Jun 20." },
  { id: 12, name: "Giant Jenga",                      emoji: "🪵", status: "sourcing",     vendor: "Source / Rent",  cost: "TBD",  notes: "📍 PLACEMENT TBD — open outdoor flat space. Decide by Jun 20." },
  { id: 13, name: "Cornhole Tournament",              emoji: "🎯", status: "sourcing",     vendor: "Source / Rent",  cost: "TBD",  notes: "📍 PLACEMENT TBD — flat open space. Branded boards, team format, prizes." },
  { id: 14, name: "Merch Setup + QR Pay",             emoji: "👕", status: "in-progress",  vendor: "Needs setup",    cost: "TBD",  notes: "📍 High-traffic area near entry or bar. Walk-on pay codes + QR easy pay. Square/tap-to-pay setup needed." },
  { id: 15, name: "VIP Swag Bags",                    emoji: "🎁", status: "in-progress",  vendor: "Needs sourcing", cost: "TBD",  notes: "VIP exclusive swag. Branded merch, sponsor products, gift cards, event exclusives. Distributed at check-in with VIP lanyard." },
  { id: 16, name: "Basketball Shootout",              emoji: "🏀", status: "pending",      vendor: "Budget dependent", cost: "TBD", notes: "📍 TBD — near playground or open paved area. Hold until other activations confirmed." },
];

const INITIAL_TASKS = [
  { id: 1,  category: "Venue Walkthrough", task: "Schedule + confirm walkthrough date with Hype Nito", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 2,  category: "Venue Walkthrough", task: "Confirm maximum capacity — clearly state the offer", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 3,  category: "Venue Walkthrough", task: "Walk full guest flow: Garage → Courtyard → Pool/Oasis → Gathering Grounds", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 4,  category: "Venue Walkthrough", task: "Confirm ADA accessibility", due: "Jun 15", priority: "medium", owner: "La Monique", done: false },
  { id: 5,  category: "Venue Walkthrough", task: "Get Wi-Fi + Bluetooth name & password from venue", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 6,  category: "Venue Walkthrough", task: "Confirm 3 TVs in movie room + wired internet for gaming lounge", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 7,  category: "Venue Walkthrough", task: "Test power outlets in all vendor zones + movie room", due: "Jun 15", priority: "medium", owner: "La Monique", done: false },
  { id: 8,  category: "Venue Walkthrough", task: "Film full walkthrough — entry, movie room, pool, vendor zones, deck", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 9,  category: "Venue Walkthrough", task: "Confirm sound limits — music lowered after 10PM hard stop", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 10, category: "Venue Walkthrough", task: "Review decor & installation rules (flag, signage, step & repeat mounts)", due: "Jun 15", priority: "medium", owner: "La Monique", done: false },
  { id: 11, category: "Venue Walkthrough", task: "Confirm cleaning / damage policy ($850 noted)", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 12, category: "Venue Walkthrough", task: "Lock final placements: dunk tank, cornhole, giant jenga on site", due: "Jun 15", priority: "high", owner: "La Monique", done: false },
  { id: 13, category: "Operations", task: "Finalize DJ placement — right side of pool by bar (Oasis Zone 2)", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 14, category: "Operations", task: "Swamp cooler secured for DJ + bar area — confirm delivery/setup date", due: "Jun 20", priority: "high", owner: "La Monique", done: true },
  { id: 15, category: "Operations", task: "Decide: misters vs swamp coolers for pool/vendor zones — source + order", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 16, category: "Operations", task: "Order branded flag for front deck panel entry", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 17, category: "Operations", task: "Design + print directional signage for all event zones", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 18, category: "Operations", task: "Print + post NO SMOKING signs throughout property", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 19, category: "Operations", task: "Purchase yellow tape — tape off all non-guest areas day-of", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 20, category: "Operations", task: "Set up Square account — create items: GA $50, GA Upgraded $150, VIP Table $500, Merch", due: "Jun 16", priority: "high", owner: "Host", done: false },
  { id: 21, category: "Operations", task: "Order Square reader(s) — at least 2 units (check-in + merch table)", due: "Jun 17", priority: "high", owner: "Host", done: false },
  { id: 22, category: "Operations", task: "Test Square tap-to-pay + chip reader before event day", due: "Jun 28", priority: "high", owner: "Host", done: false },
  { id: 23, category: "Operations", task: "Set up Square QR code for contactless self-checkout", due: "Jun 20", priority: "high", owner: "Host", done: false },
  { id: 24, category: "Operations", task: "Assign Square operator: check-in gate + merch table", due: "Jun 25", priority: "high", owner: "Host", done: false },
  { id: 25, category: "Operations", task: "Confirm Square payout account + bank link before event", due: "Jun 20", priority: "high", owner: "Host", done: false },
  { id: 26, category: "Operations", task: "Implement ticketing system (POSH & Eventbrite) + walk-on pay codes", due: "Jun 18", priority: "high", owner: "Host", done: false },
  { id: 27, category: "Operations", task: "Finalize DJ equipment needs + schedule (music 5–10PM)", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 28, category: "Operations", task: "Assign vendor zones — covered front, garage, deck, pool", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 29, category: "Activations", task: "Secure gaming lounge sponsor for movie room (3 TVs, 3 games)", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 30, category: "Activations", task: "Source 3 gaming consoles + games for movie room", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 31, category: "Activations", task: "Set up step & repeat + sponsor signage in movie room", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 32, category: "Activations", task: "Set up Red Carpet #2 at pool overlook deck", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 33, category: "Activations", task: "Book 360 Video Booth vendor (Phoenix)", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 34, category: "Activations", task: "Set up Signature Photo Area — pool overlook, pro lighting, branded signage", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 35, category: "Activations", task: "Finalize dunk tank placement — confirm concrete slab + water source", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 36, category: "Activations", task: "Finalize Giant Jenga placement — flat outdoor space", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 37, category: "Activations", task: "Finalize Cornhole placement + source branded boards", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 38, category: "Activations", task: "Set up merch table — QR code pay + walk-on codes", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 39, category: "Activations", task: "Decide: Mechanical Bull vs Basketball Shootout", due: "Jun 18", priority: "medium", owner: "La Monique", done: false },
  { id: 40, category: "Content & Sponsorship", task: "Add media partners to Group Me", due: "Jun 14", priority: "high", owner: "KP", done: false },
  { id: 41, category: "Content & Sponsorship", task: "Send digital site map to media partners", due: "Jun 15", priority: "high", owner: "KP", done: false },
  { id: 42, category: "Content & Sponsorship", task: "Outreach to media partners — roles, shot zones, expectations", due: "Jun 16", priority: "high", owner: "KP", done: false },
  { id: 43, category: "Content & Sponsorship", task: "Send media partners prop + lighting requirements per content room", due: "Jun 18", priority: "high", owner: "KP", done: false },
  { id: 44, category: "Content & Sponsorship", task: "Confirm media partners bringing props + lighting for all content zones", due: "Jun 25", priority: "high", owner: "KP", done: false },
  { id: 45, category: "Content & Sponsorship", task: "Cap influencer invites at 50 max — audit and finalize list", due: "Jun 20", priority: "high", owner: "Seven", done: false },
  { id: 46, category: "Content & Sponsorship", task: "Secure 360 booth sponsor (beverage / clothing brand)", due: "Jun 22", priority: "high", owner: "Seven", done: false },
  { id: 47, category: "Content & Sponsorship", task: "Confirm step-and-repeat sponsor placements — garage + pool overlook", due: "Jun 22", priority: "high", owner: "Seven", done: false },
  { id: 48, category: "Content & Sponsorship", task: "Photographer + videographer confirmed — Yash (recap in queue)", due: "Jun 20", priority: "high", owner: "KP", done: true },
  { id: 49, category: "Content & Sponsorship", task: "Build drone shot list: aerial, garage entry, pool overlook, Gathering Grounds, desert gate", due: "Jun 20", priority: "high", owner: "KP", done: false },
  { id: 50, category: "Content & Sponsorship", task: "Share finalized shot list with Yash + drone operator", due: "Jun 25", priority: "high", owner: "KP", done: false },
  { id: 51, category: "Content & Sponsorship", task: "Create event SOP package", due: "Jun 25", priority: "medium", owner: "KP", done: false },
  { id: 998, category: "Content & Sponsorship", task: "Design + distribute event flyers for Creator Bash — July 3rd", due: "Jun 18", priority: "high", owner: "Seven", done: false },
  { id: 999, category: "Content & Sponsorship", task: "Promoter outreach — share flyers + lock in confirmed promoters", due: "Jun 20", priority: "high", owner: "Seven", done: false },
  { id: 52, category: "Sponsors & Vendors", task: "Build sponsor outreach list — beverage, clothing, local businesses", due: "Jun 16", priority: "high", owner: "Seven", done: false },
  { id: 53, category: "Sponsors & Vendors", task: "Build vendor outreach list — food, merch, experience vendors", due: "Jun 16", priority: "high", owner: "Seven", done: false },
  { id: 54, category: "Sponsors & Vendors", task: "Outreach to gaming lounge sponsor — movie room branded activation", due: "Jun 18", priority: "high", owner: "Seven", done: false },
  { id: 55, category: "Sponsors & Vendors", task: "Outreach to 360 booth sponsor — beverage or clothing brand", due: "Jun 18", priority: "high", owner: "Seven", done: false },
  { id: 56, category: "Sponsors & Vendors", task: "Outreach to step-and-repeat sponsors — garage + pool overlook", due: "Jun 18", priority: "high", owner: "Seven", done: false },
  { id: 57, category: "Sponsors & Vendors", task: "Outreach to covered front area vendors (prime zone — fill first)", due: "Jun 18", priority: "high", owner: "Seven", done: false },
  { id: 58, category: "Sponsors & Vendors", task: "Outreach to garage, deck, and pool/bar vendor candidates", due: "Jun 19", priority: "high", owner: "Seven", done: false },
  { id: 59, category: "Sponsors & Vendors", task: "Lock in sponsor fees + signed agreements", due: "Jun 22", priority: "high", owner: "Seven", done: false },
  { id: 60, category: "Sponsors & Vendors", task: "Lock in vendor fees + confirm placements in writing", due: "Jun 22", priority: "high", owner: "Seven", done: false },
  { id: 61, category: "Sponsors & Vendors", task: "Send confirmed vendors zone assignment + setup details", due: "Jun 25", priority: "high", owner: "Seven", done: false },
  { id: 62, category: "Sponsors & Vendors", task: "Send confirmed sponsors placement specs + logo deadlines", due: "Jun 25", priority: "high", owner: "Seven", done: false },
  { id: 63, category: "VIP & Swag", task: "Design Networking Bingo cards — branded, 24 squares, creator prompts", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 64, category: "VIP & Swag", task: "Print Networking Bingo cards — 130+ copies", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 65, category: "VIP & Swag", task: "Assign bingo host / facilitator at check-in", due: "Jun 25", priority: "medium", owner: "La Monique", done: false },
  { id: 66, category: "VIP & Swag", task: "Define bingo prizes — merch OR VIP wristband upgrade", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 67, category: "VIP & Swag", task: "Source VIP lanyards — branded with event name/logo", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 68, category: "VIP & Swag", task: "Source colored wristbands — 4 colors: VIP gold, General green, Media purple, Staff red", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 69, category: "VIP & Swag", task: "Confirm wristband color system with security team", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 70, category: "VIP & Swag", task: "Set up 3 VIP pool table sections — shaded, bar adjacent, prime location", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 71, category: "VIP & Swag", task: "Prep VIP table package: 5 wristbands + 1 bottle + full drink setup ($500 each)", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 72, category: "VIP & Swag", task: "Sell remaining VIP table sections — only 3 available, outreach now", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 73, category: "VIP & Swag", task: "Confirm bottle selection + drink setup with Bria for VIP tables", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 74, category: "VIP & Swag", task: "Curate VIP swag bag contents — merch, sponsor products, gift cards", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 75, category: "VIP & Swag", task: "Source + order all VIP swag items", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 76, category: "VIP & Swag", task: "Assemble VIP swag bags", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 77, category: "VIP & Swag", task: "Create VIP distribution plan — who gets bags + lanyards, when, where", due: "Jun 25", priority: "medium", owner: "La Monique", done: false },
  { id: 78, category: "Food & Beverage", task: "Confirm food vendor partnerships / fees + assign to zones", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 79, category: "Food & Beverage", task: "Licensed bartender confirmed — Bria (480-440-0245)", due: "Jun 22", priority: "high", owner: "La Monique", done: true },
  { id: 80, category: "Food & Beverage", task: "Bar staffing confirmed — Savage leading with full staff: bartenders + bottle girls for high capacity (+1 480-620-5912)", due: "Jun 20", priority: "high", owner: "La Monique", done: true },
  { id: 81, category: "Food & Beverage", task: "Confirm lead bartender trained + ready for full responsibilities", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 82, category: "Food & Beverage", task: "Bar split confirmed: GA drink ticket ($50), unlimited ($150), VIP bottle table ($500)", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 83, category: "Food & Beverage", task: "Build drink menu — 1–2 ingredient base drinks + 2–3 ingredient pre-made signature cocktails", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 84, category: "Food & Beverage", task: "Name + finalize pre-made cocktail recipes (e.g. 'Got Neck') for unlimited ticket service", due: "Jun 24", priority: "high", owner: "La Monique", done: false },
  { id: 85, category: "Food & Beverage", task: "Set custom cocktail premium price point — upsell above base drink tier", due: "Jun 22", priority: "medium", owner: "La Monique", done: false },
  { id: 86, category: "Food & Beverage", task: "Bartender provides menu breakdown — drink quantities + cost per item by Jun 24", due: "Jun 24", priority: "high", owner: "La Monique", done: false },
  { id: 87, category: "Food & Beverage", task: "Build COGS list — supply costs, garnishments, ice, cups itemized for budget tracking", due: "Jun 24", priority: "high", owner: "La Monique", done: false },
  { id: 88, category: "Food & Beverage", task: "Bulk prep plan — pre-make cocktails before event to cut wait times + control consumption", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 89, category: "Food & Beverage", task: "Costco run — bulk purchase using return policy for unused bottles to minimize waste", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 90, category: "Food & Beverage", task: "Set unlimited wristband drink rules — no premium liquor, pre-made drinks only", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 91, category: "Food & Beverage", task: "Create bartender enforcement guide — line management, drink limits, polite guest control", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 92, category: "Food & Beverage", task: "Request quote for extra cocktail tables with free delivery", due: "Jun 18", priority: "medium", owner: "La Monique", done: false },
  { id: 93, category: "Food & Beverage", task: "Add all bar staff + supply contacts to Group Me for real-time inventory coordination", due: "Jun 16", priority: "high", owner: "La Monique", done: false },
  { id: 94, category: "Food & Beverage", task: "Share final guest count + drink menu with bartender team for timely prep", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 95, category: "Food & Beverage", task: "Document bar profit sharing — bartender covers costs first, profit split after making nut", due: "Jun 22", priority: "high", owner: "La Monique", done: false },
  { id: 96, category: "Food & Beverage", task: "Confirm VIP bottle service section adjacent to pool VIP seating + bar", due: "Jun 20", priority: "high", owner: "La Monique", done: false },
  { id: 97, category: "Food & Beverage", task: "Add bar signage — direct guests to payment points, unlimited vs premium lines", due: "Jun 28", priority: "medium", owner: "La Monique", done: false },
  { id: 82, category: "Security", task: "Security confirmed — Tony leading, 8 guards on site (520-476-4306)", due: "Jun 18", priority: "high", owner: "La Monique", done: true },
  { id: 83, category: "Security", task: "Source walkie-talkies — 8 units for security team", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 84, category: "Security", task: "Create zone assignment map: Garage, Courtyard, Pool, Gathering Grounds, Parking, Desert Gate, Guest Houses", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 85, category: "Security", task: "Write security briefing doc — removal triggers, escalation protocol, behavior policy", due: "Jun 25", priority: "high", owner: "La Monique", done: false },
  { id: 86, category: "Security", task: "Schedule pre-event security walkthrough with Tony", due: "Jun 28", priority: "high", owner: "La Monique", done: false },
  { id: 87, category: "Security", task: "Confirm check-in process — ticket scan, pat-down, VIP credential verification", due: "Jun 25", priority: "medium", owner: "La Monique", done: false },
  { id: 88, category: "Security", task: "Yellow tape: tape off guest houses B–F, tiny homes, desert gate, staff zones day-of", due: "Jul 3", priority: "high", owner: "La Monique", done: false },
  { id: 89, category: "Security", task: "Confirm no smoking signs posted at all entry points + around property", due: "Jul 3", priority: "high", owner: "La Monique", done: false },
  // From meeting notes
  { id: 100, category: "Operations", task: "Reconfigure ticket tiers on POSH — VIP $150, GA $50, Business Owner $150 — relaunch ASAP", due: "Jun 16", priority: "high", owner: "Host", done: false },
  { id: 101, category: "Operations", task: "Update ticket descriptions — clarify perks per tier, cameraman access, guest policy for vendor tickets", due: "Jun 16", priority: "high", owner: "Host", done: false },
  { id: 102, category: "Operations", task: "Adjust POSH settings to track progress toward 300 ticket capacity goal", due: "Jun 16", priority: "high", owner: "Host", done: false },
  { id: 103, category: "Operations", task: "Finalize and publish vendor guest policy — extra attendees require separate ticket purchase", due: "Jun 16", priority: "high", owner: "La Monique", done: false },
  { id: 104, category: "Sponsors & Vendors", task: "Build vendor roster list — name, zone, ticket type, guest count, equipment needs", due: "Jun 18", priority: "high", owner: "La Monique", done: false },
  { id: 105, category: "Content & Sponsorship", task: "Grant KP admin-level permissions on all media coordination platforms", due: "Jun 15", priority: "high", owner: "Host", done: false },
  { id: 106, category: "Content & Sponsorship", task: "Formally intro KP as primary media contact to all team members and media partners", due: "Jun 15", priority: "high", owner: "Host", done: false },
  { id: 107, category: "Content & Sponsorship", task: "KP to assign media team members to specific zones — red carpet, VIP, pool, gaming room", due: "Jun 18", priority: "high", owner: "KP", done: false },
  { id: 108, category: "Content & Sponsorship", task: "Ramp up social media promotion — 1 post = 15K views, need volume to hit 300 ticket capacity", due: "Jun 17", priority: "high", owner: "Seven", done: false },
  { id: 109, category: "Content & Sponsorship", task: "Revoke project access for non-core members after event — restrict to KP, Seven, and La Monique", due: "Jul 5", priority: "medium", owner: "La Monique", done: false },
  { id: 110, category: "Operations", task: "Send 3D digital venue map to collaborator for virtual tour integration", due: "Jun 20", priority: "medium", owner: "La Monique", done: false },
];

const CATEGORIES = ["All","Venue Walkthrough","Operations","Activations","Content & Sponsorship","Sponsors & Vendors","VIP & Swag","Food & Beverage","Security"];

const STATUS_CONFIG = {
  confirmed:     { label: "Confirmed",    color: "#4ade80", bg: "#052e16" },
  "in-progress": { label: "In Progress",  color: "#facc15", bg: "#1c1a05" },
  sourcing:      { label: "Sourcing",     color: "#60a5fa", bg: "#0d1b33" },
  pending:       { label: "Pending",      color: "#a78bfa", bg: "#1a0d33" },
};

const PRIORITY_CONFIG = {
  high:   { label: "HIGH", color: "#f87171" },
  medium: { label: "MED",  color: "#facc15" },
  low:    { label: "LOW",  color: "#60a5fa" },
};

const ZONE_COLORS = {
  arrival:    { bg: "#1f1208", border: "#fb923c", badge: "#fb923c", label: "ARRIVAL" },
  activation: { bg: "#081f08", border: "#4ade80", badge: "#4ade80", label: "ACTIVATION" },
  vendor:     { bg: "#080f1f", border: "#60a5fa", badge: "#60a5fa", label: "VENDOR" },
  vip:        { bg: "#12081f", border: "#a78bfa", badge: "#a78bfa", label: "VIP ZONE" },
  ops:        { bg: "#111827", border: "#6b7280", badge: "#6b7280", label: "OPS" },
  restricted: { bg: "#1f0808", border: "#f87171", badge: "#f87171", label: "RESTRICTED" },
  sponsored:  { bg: "#1f1a08", border: "#facc15", badge: "#facc15", label: "SPONSORED" },
  amenity:    { bg: "#081a1f", border: "#22d3ee", badge: "#22d3ee", label: "AMENITY" },
};

const MAP_ROWS = [
  { label: "ENTRY & FRONT", zones: [
    { id: "garage", type: "arrival", span: 2, emoji: "🎬", name: "Garage — Ocotillo Entry", items: ["Red Carpet #1", "Step & Repeat + Stanchions", "Branded Flag on Deck Panel", "Directional Signage", "Yellow tape at boundary", "Vendor Zone (secondary)"] },
    { id: "covered-front", type: "vendor", span: 2, emoji: "🏪", name: "Covered Front Right Area", items: ["PRIME Vendor Zone", "Casino Slots On Site", "Covered + Cooled", "Power per vendor", "Fill this zone first"] },
  ]},
  { label: "MAIN HOUSE — OCOTILLO", zones: [
    { id: "movie-room", type: "sponsored", span: 2, emoji: "🎮", name: "Movie Room — Gaming Lounge", items: ["3 TVs · 3 Games", "SPONSORED AREA", "Step & Repeat + Signage", "Media Props + Lighting", "Wired Internet", "VIP + Team Only"] },
    { id: "interior", type: "vip", span: 1, emoji: "🏠", name: "Ocotillo Interior", items: ["VIP Access Only", "No Guest Houses", "Screens / TVs", "AC Interior"] },
    { id: "merch", type: "ops", span: 1, emoji: "👕", name: "Merch Table", items: ["Walk-on Pay Codes", "QR Easy Pay", "Square / Tap-to-Pay"] },
  ]},
  { label: "COURTYARD — ZONE 1", zones: [
    { id: "courtyard", type: "activation", span: 2, emoji: "⭐", name: "The Ocotillo Courtyard (Zone 1)", items: ["Event Area #1", "360 Booth Option", "Guest flow hub"] },
    { id: "playground", type: "ops", span: 1, emoji: "🛝", name: "Playground Area", items: ["Basketball shootout option", "Near guest flow"] },
    { id: "bathhouse", type: "amenity", span: 1, emoji: "🛁", name: "Bath House", items: ["Guest amenity", "No smoking zone"] },
  ]},
  { label: "OASIS / POOL — ZONE 2", zones: [
    { id: "pool", type: "vip", span: 2, emoji: "🏊", name: "Pool + Jacuzzi — The Oasis (Zone 2)", items: ["Main Party Zone", "DJ Right Side by Bar ✅", "Swamp Cooler Confirmed ✅", "3 VIP Table Sections", "Red Carpet #2 + Step & Repeat", "Mountain View Photo Area"] },
    { id: "deck", type: "vendor", span: 1, emoji: "🎪", name: "Right Side Deck", items: ["Vendor / Lounge Zone", "Near DJ + Bar Flow", "Red Carpet #2 Nearby"] },
    { id: "bar", type: "ops", span: 1, emoji: "🍹", name: "Bar Setup", items: ["Bartender: Bria ✅", "Licensed Only", "Bar Split TBD", "Card Reader Required"] },
  ]},
  { label: "GATHERING GROUNDS — ZONE 3", zones: [
    { id: "gathering", type: "activation", span: 3, emoji: "🌵", name: "The Gathering Grounds (Zone 3)", items: ["Dunk Tank — placement TBD", "Giant Jenga — placement TBD", "Cornhole — placement TBD", "Lounge Seating", "Vendor integrations"] },
    { id: "gazebo", type: "amenity", span: 1, emoji: "🏕️", name: "Gazebo", items: ["Lounge / sponsor option", "Covered outdoor space"] },
  ]},
  { label: "RESTRICTED + OPS", zones: [
    { id: "guest-houses", type: "restricted", span: 2, emoji: "🚫", name: "Guest Houses B–F + Tiny Homes (x12)", items: ["TEAM ONLY", "Yellow tape all entrances", "Security stationed", "No Smoking signs"] },
    { id: "parking", type: "ops", span: 1, emoji: "🅿️", name: "Parking Lots", items: ["Multiple P zones", "Security monitored", "Shuttle drop-off"] },
    { id: "gate", type: "restricted", span: 1, emoji: "🌄", name: "Desert Gate", items: ["RESTRICTED EXIT", "Yellow tape barrier", "Security assigned"] },
  ]},
];

const BINGO_SQUARES = [
  "Has 10K+ followers","Is a founder or CEO","Has a podcast","Repping a brand today",
  "Has been on TV or radio","Sells their own merch","Is a content creator","Has a business card",
  "Has collabed with a brand","Is from out of state","Has a YouTube channel","Is an athlete",
  "FREE — You showed up 🔥","Is an entrepreneur","Runs a nonprofit","Has a TikTok 50K+",
  "Is a real estate investor","Has been featured in press","Is a DJ or musician","Knows the host",
  "Has a newsletter","Is a vendor here today","Shot content here today","Just met for first time",
];

function getDaysUntilEvent() {
  return Math.ceil((EVENT_DATE - new Date()) / (1000 * 60 * 60 * 24));
}

// ─── SITE MAP ─────────────────────────────────────────────────────────────────
function SiteMap() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Guest Activation Flow</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 12 }}>
          {[["🎬 Garage","#fb923c"],["🎮 Movie Room","#facc15"],["⭐ Courtyard","#4ade80"],["🏊 Pool/Oasis","#a78bfa"],["🌵 Gathering Grounds","#4ade80"]].map(([l,c],i,arr) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:c, fontWeight:700 }}>{l}</span>
              {i < arr.length-1 && <span style={{ color:"#374151" }}>→</span>}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {Object.entries(ZONE_COLORS).map(([k,v]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:v.border }} />
            <span style={{ fontSize:10, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>{v.label}</span>
          </div>
        ))}
      </div>
      {MAP_ROWS.map((row, ri) => (
        <div key={ri} style={{ marginBottom:10 }}>
          <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4b5563", fontWeight:700, marginBottom:5 }}>{row.label}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5 }}>
            {row.zones.map(zone => {
              const zc = ZONE_COLORS[zone.type];
              const open = expanded === zone.id;
              return (
                <div key={zone.id} onClick={() => setExpanded(open ? null : zone.id)}
                  style={{ gridColumn:`span ${zone.span}`, background:zc.bg, border:`1.5px solid ${open ? zc.border : zc.border+"55"}`, borderRadius:8, padding:"10px 12px", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:5 }}>
                    <span style={{ fontSize:13 }}>{zone.emoji}</span>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#e5e5e5", lineHeight:1.3 }}>{zone.name}</div>
                      <span style={{ fontSize:9, fontWeight:800, color:zc.badge, textTransform:"uppercase", letterSpacing:"0.08em" }}>{zc.label}</span>
                    </div>
                  </div>
                  {open && <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${zc.border}33` }}>
                    {zone.items.map((item,i) => (
                      <div key={i} style={{ display:"flex", gap:5, marginBottom:3 }}>
                        <span style={{ color:zc.badge, fontSize:9, marginTop:2 }}>▸</span>
                        <span style={{ fontSize:11, color:"#9ca3af", lineHeight:1.4 }}>{item}</span>
                      </div>
                    ))}
                  </div>}
                  {!open && <div style={{ fontSize:9, color:"#374151", marginTop:3 }}>tap to expand</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop:8, fontSize:10, color:"#374151", textAlign:"center" }}>ThunderRock Arizona · Yellow tape + No Smoking at all restricted zones</div>
    </div>
  );
}

// ─── BINGO ────────────────────────────────────────────────────────────────────
function BingoCard() {
  const [marked, setMarked] = useState(new Set());
  const toggle = (i) => { const n = new Set(marked); n.has(i) ? n.delete(i) : n.add(i); setMarked(n); };
  const hasBingo = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],[16,17,18,19],[20,21,22,23],
    [0,4,8,12,16,20],[1,5,9,13,17,21],[2,6,10,14,18,22],[3,7,11,15,19,23]]
    .some(line => line.every(i => marked.has(i) || i === 12));
  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0d1f0d,#111827)", border:"1px solid #4ade8033", borderRadius:12, padding:"14px 16px", marginBottom:14, textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#4ade80", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:4 }}>DATBOYDEBO Creator Bash · July 3rd</div>
        <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>NETWORKING BINGO</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>Complete your card · First BINGO wins merch or VIP wristband upgrade 🏆</div>
        {hasBingo && <div style={{ marginTop:10, background:"#052e16", border:"1px solid #4ade80", borderRadius:8, padding:"8px", fontSize:13, fontWeight:800, color:"#4ade80" }}>🎉 BINGO! Find a team member to claim your prize!</div>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5, marginBottom:10 }}>
        {BINGO_SQUARES.map((sq, i) => {
          const center = i === 12;
          const active = marked.has(i) || center;
          return (
            <div key={i} onClick={() => !center && toggle(i)}
              style={{ background:center?"#052e16":active?"#0d1a0d":"#111827", border:`1.5px solid ${center?"#4ade80":active?"#4ade8066":"#1f2937"}`, borderRadius:7, padding:"8px 6px", textAlign:"center", cursor:center?"default":"pointer", minHeight:52, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:10, color:active?"#4ade80":"#9ca3af", fontWeight:active?700:400, lineHeight:1.3 }}>
                {active && !center && <span style={{ display:"block", fontSize:13, marginBottom:1 }}>✓</span>}
                {sq}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => setMarked(new Set())} style={{ flex:1, background:"#1f2937", border:"1px solid #374151", borderRadius:8, padding:"8px", color:"#9ca3af", fontSize:12, cursor:"pointer" }}>Reset Card</button>
        <div style={{ flex:2, background:"#111827", border:"1px solid #1f2937", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#6b7280", textAlign:"center" }}>{marked.size} / {BINGO_SQUARES.length - 1} squares marked</div>
      </div>
    </div>
  );
}

const DRINK_MENU = {
  signature: [
    {
      name: "GOT NECK FRUIT PUNCH + VONDA",
      price: "$10",
      tagline: "Vodka fruit punch built for the pool.",
      desc: "Smooth, sweet, and strong.",
      ingredients: "Vodka + fruit punch + citrus finish",
      color: "#f87171",
      emoji: "🍹",
    },
    {
      name: "GOT NECK PART TWO",
      price: "$12",
      tagline: "Fruit punch upgraded with tequila.",
      desc: "Stronger pour. Same easy finish.",
      ingredients: "Tequila + fruit punch + lime",
      color: "#fb923c",
      emoji: "🔥",
    },
    {
      name: "DEEBO",
      price: "$12",
      tagline: "Bold, bright, and made to be seen.",
      desc: "Rum + blue curaçao + tropical mixer.",
      ingredients: "Rum blend + blue curaçao + pineapple splash",
      color: "#60a5fa",
      emoji: "🌊",
    },
  ],
  fast: [
    {
      name: "CAN COCKTAILS",
      price: "$5",
      desc: "Rotating selection of premixed cocktails and seltzers. Ask bartender for today's selection.",
      emoji: "🥤",
      color: "#a78bfa",
    },
    {
      name: "LIGHT OPTIONS",
      price: "$5",
      desc: "Vodka seltzers and canned classics.",
      emoji: "✨",
      color: "#4ade80",
    },
  ],
  hydration: [
    {
      name: "WATER",
      price: "$2",
      desc: "Stay cool and hydrated.",
      emoji: "💧",
      color: "#22d3ee",
    },
  ],
};

function DrinkMenu() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0508, #111827)", border: "1px solid #f8717133", borderRadius: 12, padding: "16px 18px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#f87171", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>DATBOYDEBO Creator Bash · July 3rd · ThunderRock AZ</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>SIGNATURE DRINKS</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>Crafted by Savage & Team · Pool Bar · Event Hours Only</div>
      </div>

      {/* Signature */}
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Signature Cocktails</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {DRINK_MENU.signature.map((d, i) => (
          <div key={i} style={{ background: "#111827", border: `1.5px solid ${d.color}44`, borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: d.color, borderRadius: "12px 0 0 12px" }} />
            <div style={{ paddingLeft: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{d.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.03em" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: d.color, fontWeight: 600, marginTop: 2 }}>{d.tagline}</div>
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: d.color, flexShrink: 0 }}>{d.price}</div>
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>{d.desc}</div>
              <div style={{ fontSize: 10, color: "#6b7280", background: "#0a0a0a", borderRadius: 6, padding: "4px 10px", display: "inline-block", letterSpacing: "0.03em" }}>{d.ingredients}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fast Serve */}
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Fast Serve Options</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
        {DRINK_MENU.fast.map((d, i) => (
          <div key={i} style={{ background: "#111827", border: `1.5px solid ${d.color}44`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 18 }}>{d.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: d.color }}>{d.price}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      {/* Hydration */}
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Hydration</div>
      <div style={{ marginBottom: 22 }}>
        {DRINK_MENU.hydration.map((d, i) => (
          <div key={i} style={{ background: "#111827", border: `1.5px solid ${d.color}44`, borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{d.emoji}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{d.name}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>{d.desc}</div>
              </div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: d.color }}>{d.price}</span>
          </div>
        ))}
      </div>

      {/* VIP Banner */}
      <div style={{ background: "linear-gradient(135deg, #1c1a05, #111827)", border: "1px solid #facc1566", borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 18 }}>👑</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#facc15", marginTop: 6, letterSpacing: "0.05em" }}>VIP EXPERIENCE</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, lineHeight: 1.6 }}>Unlimited signature drinks during event hours.</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Ask staff for wristband details.</div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {["🟡 VIP Table — $500","🟢 Unlimited — $150","🎟️ Standard — $50"].map((t, i) => (
            <span key={i} style={{ fontSize: 10, color: "#facc15", background: "#facc1515", border: "1px solid #facc1533", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 10, color: "#374151", textAlign: "center" }}>
        Bartending by Savage & Team · Premium liquor not included in unlimited wristband
      </div>
    </div>
  );
}

// ─── FINANCIALS ───────────────────────────────────────────────────────────────

const FINANCIALS = {
  totalSpent: 4000,
  totalRecovered: 800,
  revenueGoal: 23348,  // $15K profit + $8,348 COGS
  profitGoal: 15000,
  capacityGoal: 300,
};

const TICKET_TIERS = [
  {
    tier: "VIP Ticket",
    emoji: "👑",
    price: 150,
    available: 50,
    color: "#facc15",
    bg: "#1c1a05",
    perks: ["VIP access all zones","Gold wristband + lanyard","Unlimited drinks","Networking Bingo card","Swag bag"],
  },
  {
    tier: "General Admission",
    emoji: "🎟️",
    price: 50,
    available: 200,
    color: "#4ade80",
    bg: "#052e16",
    perks: ["Access to all GA zones","Green wristband","1 drink ticket included","Networking Bingo card"],
  },
  {
    tier: "Business Owner / Vendor Ticket",
    emoji: "🤝",
    price: 150,
    available: 50,
    color: "#60a5fa",
    bg: "#080f1f",
    perks: ["Vendor zone access","Cameraman access included","Additional guests require separate ticket","Listed on vendor roster"],
  },
  {
    tier: "Business Sponsor",
    emoji: "💼",
    price: 100,
    available: 10,
    color: "#a78bfa",
    bg: "#1a0d33",
    perks: ["Logo on step & repeat","Social media feature","Sponsor activation placement","Event recap branding"],
  },
  {
    tier: "Food Vendor",
    emoji: "🍽️",
    price: 150,
    available: 3,
    color: "#fb923c",
    bg: "#1f1208",
    perks: ["Designated vendor zone","High foot traffic","Tagged in event content","Power access included"],
  },
  {
    tier: "Merch — Event T-Shirts",
    emoji: "👕",
    price: 40,
    available: 20,
    color: "#22d3ee",
    bg: "#081a1f",
    perks: ["20 shirts printed at $15 each","$25 margin per shirt","QR pay + Square at merch table"],
  },
];

function SquareCheckItem({ label, detail }) {
  const [checked, setChecked] = useState(false);
  return (
    <div onClick={() => setChecked(!checked)} style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer", padding:"7px 0", borderBottom:"1px solid #1f293733" }}>
      <div style={{ width:17, height:17, borderRadius:4, border:`2px solid ${checked?"#60a5fa":"#374151"}`, background:checked?"#60a5fa":"transparent", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {checked && <span style={{ color:"#000", fontSize:10, fontWeight:900 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:checked?"#4b5563":"#e5e5e5", textDecoration:checked?"line-through":"none" }}>{label}</div>
        <div style={{ fontSize:11, color:"#6b7280" }}>{detail}</div>
      </div>
    </div>
  );
}

function Finance() {
  const [sold, setSold] = useState([0, 0, 0, 0, 0, 0]);

  const tierRevenue = TICKET_TIERS.map((t, i) => sold[i] * t.price);
  const totalRevenue = tierRevenue.reduce((a, b) => a + b, 0) + FINANCIALS.totalRecovered;
  const cogs = 6882;
  const grossProfit = totalRevenue - cogs;
  const goalPct = Math.min(100, Math.round((grossProfit / FINANCIALS.profitGoal) * 100));
  const gap = FINANCIALS.profitGoal - grossProfit;

  const maxRevenue = TICKET_TIERS.reduce((sum, t) => sum + (t.available || 0) * t.price, 0) + FINANCIALS.totalRecovered;
  const maxProfit = maxRevenue - cogs;

  return (
    <div>
      {/* Profit goal bar */}
      <div style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10, flexWrap:"wrap", gap:4 }}>
          <div>
            <div style={{ fontSize:11, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Profit Goal</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#4ade80", lineHeight:1.1 }}>${FINANCIALS.profitGoal.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#6b7280" }}>Current Profit</div>
            <div style={{ fontSize:20, fontWeight:800, color:grossProfit>=FINANCIALS.profitGoal?"#4ade80":grossProfit>0?"#facc15":"#f87171" }}>${grossProfit.toLocaleString()}</div>
          </div>
        </div>
        <div style={{ background:"#1f2937", borderRadius:4, height:8, overflow:"hidden", marginBottom:6 }}>
          <div style={{ height:"100%", width:`${Math.max(0,goalPct)}%`, background:goalPct>=100?"#4ade80":"linear-gradient(90deg,#facc15,#4ade80)", borderRadius:4, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
          <span style={{ color:"#6b7280" }}>{Math.max(0,goalPct)}% to profit goal</span>
          <span style={{ color:gap>0?"#f87171":"#4ade80" }}>{gap>0?`$${gap.toLocaleString()} gap remaining`:"🎉 Profit goal hit!"}</span>
        </div>
      </div>

      {/* Snapshot */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        {[
          { label:"Total Revenue", value:`$${totalRevenue.toLocaleString()}`, color:"#facc15" },
          { label:"Confirmed COGS", value:`-$${cogs.toLocaleString()}`, color:"#f87171" },
          { label:"Gross Profit", value:`${grossProfit>=0?"+":""}$${grossProfit.toLocaleString()}`, color:grossProfit>=0?"#4ade80":"#f87171" },
          { label:"Max If Sold Out", value:`+$${maxProfit.toLocaleString()}`, color:"#22d3ee" },
        ].map((p,i) => (
          <div key={i} style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{p.label}</div>
            <div style={{ fontSize:18, fontWeight:800, color:p.color }}>{p.value}</div>
          </div>
        ))}
      </div>

      {/* Ticket tiers */}
      <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#6b7280", fontWeight:700, marginBottom:10 }}>Revenue Streams — Sales Tracker</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        {TICKET_TIERS.map((t, i) => {
          const tierRev = sold[i] * t.price;
          const maxSold = t.available || 999;
          return (
            <div key={i} style={{ background:t.bg, border:`1.5px solid ${t.color}44`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ fontSize:16 }}>{t.emoji}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{t.tier}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:18, fontWeight:900, color:t.color }}>${t.price}</span>
                    <span style={{ fontSize:10, color:"#6b7280" }}>× {t.available} available = <span style={{ color:t.color, fontWeight:700 }}>${(t.available*t.price).toLocaleString()} max</span></span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:"#6b7280", marginBottom:2 }}>Sold Revenue</div>
                  <div style={{ fontSize:18, fontWeight:800, color:t.color }}>${tierRev.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                {t.perks.map((p,pi) => <span key={pi} style={{ fontSize:10, color:t.color, background:`${t.color}15`, border:`1px solid ${t.color}33`, borderRadius:20, padding:"2px 8px" }}>{p}</span>)}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:"#6b7280", minWidth:80 }}>Sold: {sold[i]} / {t.available}</span>
                <button onClick={() => setSold(s => s.map((v,idx)=>idx===i?Math.max(0,v-1):v))} style={{ width:28, height:28, borderRadius:6, background:"#1f2937", border:"1px solid #374151", color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                <div style={{ flex:1, background:"#1f2937", borderRadius:4, height:6, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(sold[i]/maxSold)*100}%`, background:t.color, borderRadius:4, transition:"width 0.2s" }} />
                </div>
                <button onClick={() => setSold(s => s.map((v,idx)=>idx===i?Math.min(maxSold,v+1):v))} style={{ width:28, height:28, borderRadius:6, background:"#1f2937", border:"1px solid #374151", color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Max revenue sold out breakdown */}
      <div style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>If Everything Sells Out</div>
        {[
          ["50 VIP Tickets × $150", 7500, "#facc15"],
          ["200 GA × $50", 10000, "#4ade80"],
          ["50 Business Owner × $150", 7500, "#60a5fa"],
          ["10 Business Sponsors × $100", 1000, "#a78bfa"],
          ["3 Food Vendors × $150", 450, "#fb923c"],
          ["20 T-Shirts × $40", 800, "#22d3ee"],
          ["Recovered", 800, "#4ade80"],
        ].map(([label, val, color], i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #1f2937" }}>
            <span style={{ fontSize:11, color:"#6b7280" }}>{label}</span>
            <span style={{ fontSize:12, fontWeight:700, color }}>${val.toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0 2px" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>Total Revenue</span>
          <span style={{ fontSize:14, fontWeight:900, color:"#facc15" }}>${maxRevenue.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 2px" }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>Minus COGS</span>
          <span style={{ fontSize:12, fontWeight:700, color:"#f87171" }}>-$6,882</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderTop:"1px solid #374151", marginTop:4 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Max Gross Profit</span>
          <span style={{ fontSize:16, fontWeight:900, color:maxProfit>=15000?"#4ade80":"#facc15" }}>${maxProfit.toLocaleString()}</span>
        </div>
        {maxProfit < 15000 && (
          <div style={{ marginTop:10, background:"#1c1a05", border:"1px solid #facc1544", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#facc15", lineHeight:1.7 }}>
            ⚠️ Max profit = <strong>${maxProfit.toLocaleString()}</strong> — <strong>${(15000-maxProfit).toLocaleString()}</strong> short of $15K goal. Close gap with bar sales or additional sponsors.
          </div>
        )}
        {maxProfit >= 15000 && (
          <div style={{ marginTop:10, background:"#052e16", border:"1px solid #4ade8044", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#4ade80", lineHeight:1.7 }}>
            ✅ If sold out, max profit of <strong>${maxProfit.toLocaleString()}</strong> exceeds $15K goal by <strong>${(maxProfit-15000).toLocaleString()}</strong>.
          </div>
        )}
        <div style={{ marginTop:10, background:"#111827", border:"1px solid #374151", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#9ca3af", lineHeight:1.8 }}>
          🎯 <strong style={{ color:"#fff" }}>Capacity goal: 300 tickets</strong> (50 VIP + 200 GA + 50 Business Owner)<br/>
          📣 Promotion at 1 post = ~15K views. Ramp up social + direct outreach to hit capacity.<br/>
          🎥 KP owns all media coord · Seven owns influencer/promoter outreach + flyers
        </div>
      </div>

      {/* Square checklist */}
      <div style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#60a5fa", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>🟦 Square Day-of Payment Setup</div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {[
            { label:"Square account created + bank linked", detail:"squareup.com — free to set up" },
            { label:"Item catalog built in Square", detail:"GA $50 · Unlimited $100 · VIP Section $500 · Sponsor $100 · Food Vendor $150 · Merch" },
            { label:"Square reader(s) ordered", detail:"Min 2 units — check-in gate + merch table · Ships free" },
            { label:"QR code generated for contactless pay", detail:"Self-checkout at merch + walk-on ticket sales" },
            { label:"Tap-to-pay tested on phone", detail:"Square app → iPhone/Android works as backup reader" },
            { label:"Operators assigned to readers", detail:"1 at check-in · 1 at merch table" },
            { label:"Payout schedule confirmed", detail:"Standard = next business day · Fast access = same day" },
          ].map((item,i) => <SquareCheckItem key={i} label={item.label} detail={item.detail} />)}
        </div>
        <div style={{ marginTop:10, fontSize:11, color:"#6b7280", lineHeight:1.7, borderTop:"1px solid #1f2937", paddingTop:10 }}>
          💡 <strong style={{ color:"#9ca3af" }}>Pro tip:</strong> Enable tipping at merch table. Set up VIP upsell button for walk-on upgrades at the door.
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedDone = JSON.parse(saved);
        return INITIAL_TASKS.map(t => ({ ...t, done: savedDone[t.id] ?? t.done }));
      }
    } catch(e) {}
    return INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState("tasks");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const doneMap = {};
    tasks.forEach(t => { doneMap[t.id] = t.done; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap)); } catch(e) {}
  }, [tasks]);

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const filtered = activeCategory === "All" ? tasks : tasks.filter(t => t.category === activeCategory);
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = Math.round((done / total) * 100);
  const daysLeft = getDaysUntilEvent();
  const highOpen = tasks.filter(t => t.priority === "high" && !t.done).length;

  const S = { fontFamily:"'Inter',system-ui,sans-serif", background:"#0a0a0a", minHeight:"100vh", color:"#e5e5e5" };

  return (
    <div style={S}>
      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#0a0a0a 0%,#111827 50%,#0a0a0a 100%)", borderBottom:"1px solid #1f2937", padding:"22px 18px 18px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.2em", color:"#6b7280", fontWeight:700, textTransform:"uppercase", marginBottom:5 }}>TLM Agency · Event Sprint</div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>DATBOYDEBO Creator Bash</h1>
              <div style={{ marginTop:3, color:"#9ca3af", fontSize:13 }}>July 3rd · ThunderRock Arizona · Ocotillo Mansion</div>
            </div>
            <div style={{ background:daysLeft<=10?"#2d0a0a":"#0d1f0d", border:`1px solid ${daysLeft<=10?"#7f1d1d":"#14532d"}`, borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:daysLeft<=10?"#f87171":"#4ade80", lineHeight:1 }}>{daysLeft}</div>
              <div style={{ fontSize:10, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2 }}>days out</div>
            </div>
          </div>
          <div style={{ marginTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>{done} of {total} tasks complete</span>
              <span style={{ fontSize:11, color:"#4ade80", fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ background:"#1f2937", borderRadius:4, height:5, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#4ade80,#22d3ee)", borderRadius:4, transition:"width 0.4s ease" }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
            {[["High priority open", highOpen, "#f87171"],["Done", done, "#4ade80"],["Activations", ACTIVATIONS.length, "#22d3ee"],["Contacts", CONTACTS.length, "#a78bfa"]].map(([l,v,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, background:"#111827", border:"1px solid #1f2937", borderRadius:20, padding:"3px 10px" }}>
                <span style={{ fontSize:12, fontWeight:800, color:c }}>{v}</span>
                <span style={{ fontSize:10, color:"#6b7280" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom:"1px solid #1f2937", background:"#0a0a0a", overflowX:"auto" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex" }}>
          {[["tasks","✅ Tasks"],["activations","🎯 Activations"],["sitemap","🗺️ Site Map"],["drinks","🍹 Drinks"],["finance","💰 Finance"],["bingo","🎱 Bingo"],["contacts","📞 Contacts"]].map(([k,l]) => (
            <button key={k} onClick={() => setActiveTab(k)} style={{ background:"none", border:"none", padding:"12px 16px", color:activeTab===k?"#fff":"#6b7280", fontSize:12, fontWeight:activeTab===k?700:500, cursor:"pointer", borderBottom:activeTab===k?"2px solid #4ade80":"2px solid transparent", whiteSpace:"nowrap" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"18px 18px 40px" }}>

        {/* TASKS */}
        {activeTab === "tasks" && (
          <>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12, background:"#111827", border:"1px solid #1f2937", borderRadius:8, padding:"10px 12px" }}>
              <span style={{ fontSize:10, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginRight:4 }}>Team:</span>
              {[["Host","#fb923c","DMs · POSH · Financials"],["La Monique","#f472b6","Sponsorships · Ops · Planning"],["KP","#a78bfa","Media · Content"],["Seven","#22d3ee","Influencers · Promoters · Flyers"]].map(([name,color,role]) => (
                <div key={name} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
                  <span style={{ fontSize:10, color:color, fontWeight:700 }}>{name}</span>
                  <span style={{ fontSize:10, color:"#4b5563" }}>· {role}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:5, marginBottom:16, flexWrap:"wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background:activeCategory===cat?"#1f2937":"transparent", border:`1px solid ${activeCategory===cat?"#374151":"#1f2937"}`, borderRadius:20, padding:"4px 12px", fontSize:11, color:activeCategory===cat?"#fff":"#6b7280", cursor:"pointer", fontWeight:activeCategory===cat?600:400 }}>{cat}</button>
              ))}
            </div>
            {(activeCategory==="All" ? ["Venue Walkthrough","Operations","Activations","Content & Sponsorship","Sponsors & Vendors","VIP & Swag","Food & Beverage","Security"] : [activeCategory]).map(cat => {
              const catTasks = filtered.filter(t => t.category === cat);
              if (!catTasks.length) return null;
              return (
                <div key={cat} style={{ marginBottom:24 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#6b7280", fontWeight:700, marginBottom:8, paddingBottom:6, borderBottom:"1px solid #1f2937" }}>
                    {cat} · {catTasks.filter(t=>t.done).length}/{catTasks.length}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {catTasks.map(task => {
                      const p = PRIORITY_CONFIG[task.priority];
                      const ownerColors = { "KP": "#a78bfa", "Seven": "#22d3ee", "Host": "#fb923c", "La Monique": "#f472b6" };
                      const ownerColor = ownerColors[task.owner] || "#6b7280";
                      return (
                        <div key={task.id} onClick={() => toggleTask(task.id)} style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"9px 11px", background:task.done?"#0d0d0d":"#111827", border:`1px solid ${task.done?"#111":"#1f2937"}`, borderRadius:7, cursor:"pointer" }}>
                          <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${task.done?"#4ade80":"#374151"}`, background:task.done?"#4ade80":"transparent", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {task.done && <span style={{ color:"#000", fontSize:10, fontWeight:900 }}>✓</span>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:12, fontWeight:500, color:task.done?"#4b5563":"#e5e5e5", textDecoration:task.done?"line-through":"none", lineHeight:1.4 }}>{task.task}</div>
                            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:3, flexWrap:"wrap" }}>
                              <span style={{ fontSize:10, color:"#6b7280" }}>Due {task.due}</span>
                              {task.owner && <span style={{ fontSize:9, fontWeight:700, color:ownerColor, background:ownerColor+"18", border:`1px solid ${ownerColor}33`, borderRadius:20, padding:"1px 7px", letterSpacing:"0.05em" }}>{task.owner}</span>}
                            </div>
                          </div>
                          <span style={{ fontSize:9, fontWeight:800, color:task.done?"#374151":p.color, flexShrink:0, marginTop:2 }}>{p.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ACTIVATIONS */}
        {activeTab === "activations" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {ACTIVATIONS.map((act,i) => {
              const s = STATUS_CONFIG[act.status];
              return (
                <div key={act.id} style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:12, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:"#1f2937", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{act.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, color:"#6b7280", fontWeight:600 }}>#{i+1}</span>
                      <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{act.name}</span>
                      <span style={{ fontSize:9, fontWeight:700, color:s.color, background:s.bg, border:`1px solid ${s.color}33`, borderRadius:20, padding:"2px 7px", textTransform:"uppercase" }}>{s.label}</span>
                    </div>
                    <div style={{ display:"flex", gap:14, marginTop:5 }}>
                      <span style={{ fontSize:11, color:"#9ca3af" }}>Vendor: {act.vendor}</span>
                      <span style={{ fontSize:11, color:"#9ca3af" }}>Cost: <span style={{ color:act.cost==="TBD"?"#facc15":"#4ade80", fontWeight:600 }}>{act.cost}</span></span>
                    </div>
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:5, lineHeight:1.6 }}>{act.notes}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "sitemap" && <SiteMap />}
        {activeTab === "drinks" && <DrinkMenu />}
        {activeTab === "finance" && <Finance />}
        {activeTab === "bingo" && <BingoCard />}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {CONTACTS.map((c,i) => (
              <div key={i} style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b7280", fontWeight:700, marginBottom:5 }}>{c.role}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:7 }}>{c.name}</div>
                {c.phone && <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><span>📞</span><span style={{ fontSize:13, color:"#22d3ee", fontWeight:500 }}>{c.phone}</span></div>}
                {c.email && <div style={{ display:"flex", alignItems:"center", gap:8 }}><span>✉️</span><span style={{ fontSize:12, color:"#9ca3af" }}>{c.email}</span></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
