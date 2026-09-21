const properties = [
  { id: 1, name: "Urban Nest PG", location: "Koramangala, Bengaluru", type: "PG / Hostel", rooms: 48, available: 7, price: 12500, rating: "4.8", tone: "" },
  { id: 2, name: "The Slate Co-Living", location: "Hitech City, Hyderabad", type: "Co-Living", rooms: 72, available: 12, price: 18000, rating: "4.7", tone: "purple" },
  { id: 3, name: "Palm Grove Residences", location: "Andheri West, Mumbai", type: "Flats", rooms: 24, available: 3, price: 26500, rating: "4.9", tone: "orange" },
  { id: 4, name: "The Foundry Studios", location: "Indiranagar, Bengaluru", type: "Studio", rooms: 31, available: 5, price: 22000, rating: "4.6", tone: "purple" },
  { id: 5, name: "Lakeview House", location: "Salt Lake, Kolkata", type: "Rental", rooms: 18, available: 4, price: 14500, rating: "4.5", tone: "orange" },
  { id: 6, name: "Aster Living", location: "Viman Nagar, Pune", type: "Co-Living", rooms: 55, available: 9, price: 15500, rating: "4.8", tone: "" }
];

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7M8 10h.01M12 10h.01M16 10h.01"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5l8-3 8 3v16M2 21h20M8 8h1M15 8h1M8 12h1M15 12h1M8 16h1M15 16h1M11 21v-4h2v4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5"/></svg>'
};

const state = {
  view: "overview",
  filter: "All properties",
  search: "",
  user: JSON.parse(localStorage.getItem("anyrenting-user") || "null"),
  bookings: JSON.parse(localStorage.getItem("anyrenting-bookings") || "[]"),
  modal: null
};

const initialView = new URLSearchParams(location.search).get("view");
if (["overview", "properties", "bookings", "leads"].includes(initialView)) state.view = initialView;

function setView(view) {
  state.view = view;
  render();
}

function saveState() {
  localStorage.setItem("anyrenting-user", JSON.stringify(state.user));
  localStorage.setItem("anyrenting-bookings", JSON.stringify(state.bookings));
}

function toast(message) {
  const region = document.querySelector("#toast-region");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  region.appendChild(item);
  setTimeout(() => item.remove(), 3400);
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function openModal(kind, data = null) {
  state.modal = { kind, data };
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

function filteredProperties() {
  const query = state.search.toLowerCase();
  return properties.filter((property) => {
    const matchesFilter = state.filter === "All properties" || property.type === state.filter;
    const matchesQuery = !query || `${property.name} ${property.location} ${property.type}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
}

function logo() {
  return `<span class="brand-mark">${icons.home}</span>`;
}

function sidebar() {
  const links = [
    ["overview", icons.home, "Overview"],
    ["properties", icons.grid, "Properties"],
    ["bookings", icons.calendar, "Bookings"],
    ["leads", icons.users, "Leads"]
  ];
  return `<aside class="sidebar">
    <a class="brand" href="#" onclick="setView('overview'); return false;">${logo()}<span>AnyRenting</span></a>
    <div class="nav-label">Workspace</div>
    <nav class="nav">${links.map(([id, icon, label]) => `<button class="nav-button ${state.view === id ? "active" : ""}" onclick="setView('${id}')">${icon}<span>${label}</span></button>`).join("")}</nav>
    <div class="sidebar-bottom">
      <div class="help-card"><span class="eyebrow">Need a hand?</span><p>Get your rental operation running smoothly with our team.</p><a class="small-link" href="mailto:hello@anyrenting.com">Talk to us ${icons.arrow}</a></div>
    </div>
  </aside>`;
}

function topbar() {
  const name = state.user?.name || "Guest owner";
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return `<header class="topbar">
    <a class="mobile-brand" href="#" onclick="setView('overview'); return false;">${logo()}<span>AnyRenting</span></a>
    <div class="breadcrumb">Workspace <span>/</span> <strong>${state.view[0].toUpperCase() + state.view.slice(1)}</strong></div>
    <div class="top-actions">
      <button class="icon-button" aria-label="Notifications" onclick="toast('You are all caught up')">${icons.bell}<i class="notification-dot"></i></button>
      ${state.user ? `<div class="profile"><div class="avatar">${initials}</div><div class="profile-copy"><strong>${name}</strong><span>Property owner</span></div></div><button class="icon-button" aria-label="Log out" onclick="logout()">${icons.logout}</button>` : `<button class="btn btn-secondary btn-small" onclick="openModal('login')">Log in</button>`}
    </div>
  </header>`;
}

function overview() {
  const bookings = state.bookings.length ? state.bookings : [
    { property: "Urban Nest PG", guest: "Rahul Mehta", date: "Today, 4:30 PM", status: "confirmed" },
    { property: "The Slate Co-Living", guest: "Aisha Khan", date: "Tomorrow, 11:00 AM", status: "pending" },
    { property: "Palm Grove Residences", guest: "Vikram Shah", date: "24 Sep, 2:00 PM", status: "confirmed" }
  ];
  return `<section class="page">
    <div class="page-intro"><div><span class="eyebrow">Monday, 21 September 2026</span><h1>Good morning, <span class="accent">${state.user?.name?.split(" ")[0] || "owner"}.</span></h1><p>Here is what is happening across your rental portfolio today.</p></div><button class="btn btn-primary" onclick="openModal('add-property')">+ Add property</button></div>
    <div class="stat-grid">
      <article class="stat-card"><span class="stat-label">Monthly collection</span><div class="stat-value">${money(84520)}</div><span class="trend">↑ 18.4% this month</span></article>
      <article class="stat-card"><span class="stat-label">Active tenants</span><div class="stat-value">482</div><span class="trend">↑ 6.2% vs last month</span></article>
      <article class="stat-card"><span class="stat-label">Vacant beds</span><div class="stat-value">37</div><span class="trend neutral">Across 12 properties</span></article>
      <article class="stat-card"><span class="stat-label">Open leads</span><div class="stat-value">126</div><span class="trend">↑ 14 new this week</span></article>
    </div>
    <div class="dashboard-grid">
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">Performance</span><h3>Monthly collection</h3></div><select class="select" aria-label="Chart period"><option>Last 7 months</option><option>This year</option></select></div><div class="panel-body"><div class="bar-chart">${[58, 74, 62, 87, 78, 96, 100].map((height, index) => `<div class="bar-wrap"><div class="bar" style="height:${height}%"></div><span class="bar-label">${["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][index]}</span></div>`).join("")}</div></article>
      <article class="panel"><div class="panel-head"><div><span class="eyebrow">Latest updates</span><h3>Recent activity</h3></div><button class="small-link" onclick="setView('bookings')">View all</button></div><div class="panel-body"><div class="activity-list">${[
        ["Rent received", "Rahul paid rent", "₹950", icons.calendar],
        ["New lead", "Arjun · Interested", "Today", icons.users],
        ["Booking request", "Aisha requested a visit", "New", icons.building],
        ["Rent received", "Priya paid rent", "₹1,200", icons.calendar]
      ].map(([title, copy, amount, icon]) => `<div class="activity"><span class="activity-icon">${icon}</span><div class="activity-copy"><strong>${title}</strong><span>${copy}</span></div><span class="activity-amount">${amount}</span></div>`).join("")}</div></div></article>
    </div>
    <article class="panel" style="margin-top:20px"><div class="panel-head"><div><span class="eyebrow">Your calendar</span><h3>Upcoming bookings</h3></div><button class="small-link" onclick="setView('bookings')">Manage bookings</button></div><div class="panel-body"><div class="booking-list">${bookings.slice(0, 3).map((booking) => `<div class="booking-row"><div><strong>${booking.guest || "New guest"} · ${booking.property}</strong><span>${booking.date}</span></div><span class="status ${booking.status}">${booking.status}</span></div>`).join("")}</div></div></article>
  </section>`;
}

function propertyCard(property) {
  return `<article class="listing-card"><div class="listing-image ${property.tone}"><span class="tag">Available now</span><span class="listing-icon">${icons.building}</span></div><div class="listing-body"><h3>${property.name}</h3><div class="location">${property.location}</div><div class="listing-meta"><span>${property.rooms} rooms</span><span>★ ${property.rating} rating</span></div><div class="price-row"><span class="price">${money(property.price)} <small>/ month</small></span><button class="btn btn-primary btn-small" onclick="openModal('booking', ${property.id})">Request visit</button></div></div></article>`;
}

function propertiesView() {
  return `<section class="page"><div class="page-intro"><div><span class="eyebrow">Portfolio</span><h1>Your <span class="accent">properties.</span></h1><p>Keep every listing, room and availability detail in one place.</p></div><button class="btn btn-primary" onclick="openModal('add-property')">+ Add property</button></div><div class="listing-toolbar"><label class="searchbox">${icons.search}<input value="${state.search}" oninput="state.search=this.value; render()" placeholder="Search properties, locations..." /></label><select class="select" onchange="state.filter=this.value; render()" aria-label="Filter properties"><option>All properties</option><option>PG / Hostel</option><option>Co-Living</option><option>Flats</option><option>Studio</option><option>Rental</option></select></div><div class="listing-grid">${filteredProperties().length ? filteredProperties().map(propertyCard).join("") : `<div class="empty">No properties match your search. Try a different location or category.</div>`}</div></section>`;
}

function bookingsView() {
  const bookings = state.bookings.length ? state.bookings : [
    { property: "Urban Nest PG", guest: "Rahul Mehta", date: "Today, 4:30 PM", status: "confirmed" },
    { property: "The Slate Co-Living", guest: "Aisha Khan", date: "Tomorrow, 11:00 AM", status: "pending" },
    { property: "Palm Grove Residences", guest: "Vikram Shah", date: "24 Sep, 2:00 PM", status: "confirmed" }
  ];
  return `<section class="page"><div class="page-intro"><div><span class="eyebrow">Lead pipeline</span><h1>Bookings & <span class="accent">visits.</span></h1><p>Track every interested renter from first enquiry to confirmed move-in.</p></div><button class="btn btn-primary" onclick="openModal('booking', 1)">+ New booking</button></div><div class="stat-grid"><article class="stat-card"><span class="stat-label">This week</span><div class="stat-value">${bookings.length}</div><span class="trend">Upcoming visits</span></article><article class="stat-card"><span class="stat-label">Conversion rate</span><div class="stat-value">32%</div><span class="trend">↑ 4.8% this month</span></article><article class="stat-card"><span class="stat-label">Pending follow-ups</span><div class="stat-value">18</div><span class="trend neutral">Needs attention</span></article><article class="stat-card"><span class="stat-label">Tokens collected</span><div class="stat-value">₹24.6k</div><span class="trend">This month</span></article></div><article class="panel"><div class="panel-head"><div><span class="eyebrow">All enquiries</span><h3>Booking pipeline</h3></div><button class="btn btn-secondary btn-small" onclick="toast('Export is ready in the next platform release')">Export CSV</button></div><div class="panel-body"><div class="booking-list">${bookings.map((booking, index) => `<div class="booking-row"><div><strong>${booking.guest || "New guest"} · ${booking.property}</strong><span>${booking.date} · ${index % 2 ? "WhatsApp lead" : "Website enquiry"}</span></div><div style="display:flex;align-items:center;gap:12px"><span class="status ${booking.status}">${booking.status}</span><button class="btn btn-ghost btn-small" onclick="toast('Follow-up marked complete')">Follow up</button></div></div>`).join("")}</div></div></article></section>`;
}

function leadsView() {
  return `<section class="page"><div class="page-intro"><div><span class="eyebrow">Lead CRM</span><h1>Turn interest into <span class="accent">bookings.</span></h1><p>Organise enquiries, schedule property visits and keep follow-ups on track.</p></div><button class="btn btn-primary" onclick="openModal('booking', 2)">+ Add lead</button></div><div class="dashboard-grid"><article class="panel"><div class="panel-head"><div><span class="eyebrow">Pipeline</span><h3>Lead stages</h3></div><span class="tag">126 open</span></div><div class="panel-body"><div class="activity-list">${[["New enquiry", "38 leads", "cyan"], ["Contacted", "26 leads", "purple"], ["Visit scheduled", "18 leads", "yellow"], ["Token payment", "9 leads", "green"]].map(([title, value, color]) => `<div class="booking-row"><div><strong>${title}</strong><span>Updated today</span></div><span class="status ${color === "green" ? "confirmed" : "pending"}">${value}</span></div>`).join("")}</div></article><article class="panel"><div class="panel-head"><div><span class="eyebrow">Quick action</span><h3>Share a listing</h3></div></div><div class="panel-body"><p class="modal-note">Create a shareable property link for WhatsApp, your website or a QR code on your property board.</p><button class="btn btn-cyan" onclick="navigator.clipboard?.writeText(location.origin + '/?property=1'); toast('Listing link copied')">Copy property link ${icons.arrow}</button></div></article></div></section>`;
}

function modal() {
  if (!state.modal) return "";
  if (state.modal.kind === "login") return `<div class="modal-backdrop" onclick="if(event.target===this) closeModal()"><div class="modal"><div class="modal-head"><div><span class="eyebrow">Welcome back</span><h2>Log in to AnyRenting</h2></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><p class="modal-note">Use any name and email for this demo workspace. Production auth can be connected when the backend is ready.</p><form class="form-grid" onsubmit="login(event)"><div class="field"><label>Your name</label><input name="name" placeholder="e.g. Ganpati Raj" required /></div><div class="field"><label>Email address</label><input name="email" type="email" placeholder="you@example.com" required /></div><div class="field"><label>Password</label><input name="password" type="password" placeholder="••••••••" required minlength="6" /></div><div class="form-actions"><button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary">Continue to workspace ${icons.arrow}</button></div></form></div></div></div>`;
  if (state.modal.kind === "booking") {
    const property = properties.find((item) => item.id === state.modal.data) || properties[0];
    return `<div class="modal-backdrop" onclick="if(event.target===this) closeModal()"><div class="modal"><div class="modal-head"><div><span class="eyebrow">New enquiry</span><h2>Request a property visit</h2></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><p class="modal-note">Send a visit request for <strong>${property.name}</strong> in ${property.location}.</p><form class="form-grid" onsubmit="createBooking(event, '${property.name}')"><div class="field"><label>Guest name</label><input name="guest" placeholder="Full name" required /></div><div class="field"><label>Phone number</label><input name="phone" type="tel" placeholder="+91 98765 43210" required /></div><div class="field"><label>Preferred visit date</label><input name="date" type="date" required /></div><div class="field"><label>Message <span style="color:var(--muted-2)">(optional)</span></label><textarea name="message" placeholder="Tell the owner what you are looking for"></textarea></div><div class="form-actions"><button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary">Send request ${icons.arrow}</button></div></form></div></div></div>`;
  }
  return `<div class="modal-backdrop" onclick="if(event.target===this) closeModal()"><div class="modal"><div class="modal-head"><div><span class="eyebrow">Portfolio</span><h2>Add a property</h2></div><button class="modal-close" onclick="closeModal()">×</button></div><div class="modal-body"><p class="modal-note">This demo stores your entry locally. Connect your database to make properties available across devices.</p><form class="form-grid" onsubmit="addProperty(event)"><div class="field"><label>Property name</label><input name="name" placeholder="e.g. Central Park Homes" required /></div><div class="field"><label>Location</label><input name="location" placeholder="City and neighbourhood" required /></div><div class="field"><label>Property type</label><select name="type"><option>PG / Hostel</option><option>Co-Living</option><option>Flats</option><option>Studio</option><option>Rental</option></select></div><div class="form-actions"><button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary">Save property</button></div></form></div></div></div>`;
}

function appView() {
  let content = overview();
  if (state.view === "properties") content = propertiesView();
  if (state.view === "bookings") content = bookingsView();
  if (state.view === "leads") content = leadsView();
  return `<div class="app-shell">${sidebar()}<main class="main">${topbar()}${content}</main></div>${modal()}`;
}

function render() {
  document.querySelector("#app").innerHTML = appView();
}

function login(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.user = { name: form.get("name"), email: form.get("email") };
  saveState();
  closeModal();
  toast(`Welcome to AnyRenting, ${state.user.name.split(" ")[0]}!`);
}

function logout() {
  state.user = null;
  saveState();
  toast("You have been logged out");
  render();
}

function createBooking(event, property) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.bookings.unshift({ property, guest: form.get("guest"), date: form.get("date"), status: "pending" });
  saveState();
  closeModal();
  toast("Booking request added to your pipeline");
  setView("bookings");
}

function addProperty(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const property = { id: Date.now(), name: form.get("name"), location: form.get("location"), type: form.get("type"), rooms: 0, available: 0, price: 0, rating: "New", tone: "" };
  properties.unshift(property);
  closeModal();
  toast(`${property.name} added to your portfolio`);
  setView("properties");
}

window.setView = setView;
window.openModal = openModal;
window.closeModal = closeModal;
window.login = login;
window.logout = logout;
window.createBooking = createBooking;
window.addProperty = addProperty;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

render();