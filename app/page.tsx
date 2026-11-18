"use client";

import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Box,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Ellipsis,
  Eye,
  FileText,
  Filter,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Status =
  | "In transit"
  | "At pickup station"
  | "Delivered"
  | "Processing"
  | "Delayed";

type ShipmentEvent = {
  status: string;
  detail: string;
  location: string;
  time: string;
};

type Shipment = {
  id: string;
  sender: string;
  recipient: string;
  from: string;
  to: string;
  service: string;
  status: Status;
  date: string;
  amount: number;
  station: string;
  events: ShipmentEvent[];
};

type Station = {
  name: string;
  location: string;
  parcels: number;
  capacity: number;
  manager: string;
  status: "Open" | "Busy" | "Closed";
};

type Notice = {
  id: number;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  kind: "arrival" | "delay" | "delivery";
};

const initialShipments: Shipment[] = [
  {
    id: "NNC-2025-08421",
    sender: "Amara Okafor",
    recipient: "Daniel Mbeki",
    from: "Lagos",
    to: "Accra",
    service: "Express",
    status: "In transit",
    date: "Today, 10:42 AM",
    amount: 48.5,
    station: "Accra Central",
    events: [
      { status: "In transit", detail: "Departed Lagos hub", location: "Lagos, Nigeria", time: "Today, 10:42 AM" },
      { status: "Processed", detail: "Shipment scanned and sorted", location: "Lagos, Nigeria", time: "Today, 8:16 AM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Lagos, Nigeria", time: "Yesterday, 4:32 PM" },
    ],
  },
  {
    id: "NNC-2025-08420",
    sender: "Kofi Mensah",
    recipient: "Grace Adebayo",
    from: "Accra",
    to: "Lagos",
    service: "Standard",
    status: "At pickup station",
    date: "Today, 9:18 AM",
    amount: 32,
    station: "Lagos Island",
    events: [
      { status: "At pickup station", detail: "Ready for collection — recipient notified", location: "Lagos Island, Nigeria", time: "Today, 9:18 AM" },
      { status: "In transit", detail: "Arrived at Lagos destination hub", location: "Lagos, Nigeria", time: "Yesterday, 6:20 PM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Accra, Ghana", time: "Yesterday, 8:10 AM" },
    ],
  },
  {
    id: "NNC-2025-08419",
    sender: "Chika Nwosu",
    recipient: "Kwame Boateng",
    from: "Kumasi",
    to: "Accra",
    service: "Same day",
    status: "Delivered",
    date: "Today, 8:54 AM",
    amount: 18,
    station: "Accra Central",
    events: [
      { status: "Delivered", detail: "Handed to recipient — proof of delivery recorded", location: "Accra, Ghana", time: "Today, 8:54 AM" },
      { status: "In transit", detail: "Out for delivery", location: "Accra, Ghana", time: "Today, 7:12 AM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Kumasi, Ghana", time: "Yesterday, 5:32 PM" },
    ],
  },
  {
    id: "NNC-2025-08418",
    sender: "Zainab Bello",
    recipient: "Yaw Asante",
    from: "Lagos",
    to: "Kumasi",
    service: "Standard",
    status: "Processing",
    date: "Today, 8:30 AM",
    amount: 36,
    station: "Kumasi Market",
    events: [
      { status: "Processing", detail: "Shipment sorted at origin facility", location: "Lagos, Nigeria", time: "Today, 8:30 AM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Lagos, Nigeria", time: "Yesterday, 2:14 PM" },
    ],
  },
  {
    id: "NNC-2025-08417",
    sender: "Emeka Obi",
    recipient: "Akosua Darko",
    from: "Accra",
    to: "Lagos",
    service: "Express",
    status: "Delayed",
    date: "Yesterday, 6:45 PM",
    amount: 52,
    station: "Lagos Island",
    events: [
      { status: "Delayed", detail: "Weather disruption — new ETA tomorrow by 2 PM", location: "Cotonou, Benin", time: "Today, 7:05 AM" },
      { status: "In transit", detail: "Departed Accra hub", location: "Accra, Ghana", time: "Yesterday, 6:45 PM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Accra, Ghana", time: "Yesterday, 11:20 AM" },
    ],
  },
  {
    id: "NNC-2025-08416",
    sender: "Fatima Sani",
    recipient: "Peter Osei",
    from: "Kumasi",
    to: "Accra",
    service: "Standard",
    status: "At pickup station",
    date: "Yesterday, 4:12 PM",
    amount: 22,
    station: "Accra Central",
    events: [
      { status: "At pickup station", detail: "Ready for collection — recipient notified", location: "Accra Central, Ghana", time: "Yesterday, 4:12 PM" },
      { status: "In transit", detail: "Arrived at Accra destination hub", location: "Accra, Ghana", time: "Yesterday, 1:15 PM" },
      { status: "Shipment created", detail: "Package accepted at origin", location: "Kumasi, Ghana", time: "Yesterday, 9:02 AM" },
    ],
  },
];

const initialStations: Station[] = [
  { name: "Accra Central", location: "Osu, Accra", parcels: 48, capacity: 80, manager: "Nana Owusu", status: "Busy" },
  { name: "Lagos Island", location: "Victoria Island, Lagos", parcels: 32, capacity: 60, manager: "Tunde Akin", status: "Open" },
  { name: "Kumasi Market", location: "Adum, Kumasi", parcels: 26, capacity: 50, manager: "Abena Frimpong", status: "Open" },
  { name: "Tema Harbour", location: "Community 1, Tema", parcels: 17, capacity: 40, manager: "Kojo Asare", status: "Open" },
];

const initialNotices: Notice[] = [
  { id: 1, title: "3 parcels arrived at Accra Central", detail: "Station team has been notified to receive incoming items.", time: "8 min ago", unread: true, kind: "arrival" },
  { id: 2, title: "Delivery exception reported", detail: "NNC-2025-08417 · Weather disruption near Cotonou.", time: "24 min ago", unread: true, kind: "delay" },
  { id: 3, title: "Shipment successfully delivered", detail: "NNC-2025-08419 · Proof of delivery is available.", time: "1 hour ago", unread: false, kind: "delivery" },
];

const statusOptions: Status[] = ["Processing", "In transit", "At pickup station", "Delivered", "Delayed"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(value);
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function IconBadge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "orange" | "red" | "purple" }) {
  return <span className={`icon-badge ${tone}`}>{children}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${className}`}><span className="status-dot" />{status}</span>;
}

function initialFor(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function Home() {
  const [activePage, setActivePage] = useState("Overview");
  const [shipments, setShipments] = useState(initialShipments);
  const [stations, setStations] = useState(initialStations);
  const [notices, setNotices] = useState(initialNotices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [modal, setModal] = useState<"shipment" | "station" | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<Shipment | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [period, setPeriod] = useState("Last 7 days");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("neno-courier-data");
        if (saved) {
          const data = JSON.parse(saved) as { shipments?: Shipment[]; stations?: Station[]; notices?: Notice[] };
          if (data.shipments) setShipments(data.shipments);
          if (data.stations) setStations(data.stations);
          if (data.notices) setNotices(data.notices);
        }
      } catch (error) {
        console.error("Could not load saved Neno Courier data.", error);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("neno-courier-data", JSON.stringify({ shipments, stations, notices }));
  }, [shipments, stations, notices, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const unreadCount = notices.filter((notice) => notice.unread).length;
  const filteredShipments = useMemo(() => shipments.filter((shipment) => {
    const matchesSearch = `${shipment.id} ${shipment.sender} ${shipment.recipient} ${shipment.from} ${shipment.to}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All status" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [shipments, search, statusFilter]);
  const pickupCount = shipments.filter((shipment) => shipment.status === "At pickup station").length;

  function navigate(page: string) {
    setActivePage(page);
    setMobileNavOpen(false);
    setSelectedShipment(null);
  }

  function showTracking(number = trackingNumber) {
    const found = shipments.find((shipment) => shipment.id.toLowerCase() === number.trim().toLowerCase());
    setTrackingNumber(number);
    setTrackingResult(found ?? null);
    setTrackingError(found ? "" : "We couldn't find a shipment with that waybill. Check the number and try again.");
    setActivePage("Track shipment");
    setModal(null);
    setSelectedShipment(null);
  }

  function updateShipmentStatus(id: string, nextStatus: Status) {
    const shipment = shipments.find((item) => item.id === id);
    if (!shipment || shipment.status === nextStatus) return;
    const detail = nextStatus === "At pickup station"
      ? "Arrived at destination station — notifications queued for recipient and transporter"
      : nextStatus === "Delivered"
        ? "Handed to recipient — proof of delivery recorded"
        : nextStatus === "Delayed"
          ? "Delivery exception reported — operations team notified"
          : `Shipment status updated to ${nextStatus.toLowerCase()}`;
    const event: ShipmentEvent = {
      status: nextStatus,
      detail,
      location: nextStatus === "At pickup station" || nextStatus === "Delivered" ? shipment.station : shipment.to,
      time: `Today, ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
    };
    setShipments((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus, events: [event, ...item.events] } : item));
    if (nextStatus === "At pickup station") {
      setNotices((current) => [{ id: Date.now(), title: "Parcel arrived at destination", detail: `${id} · In-app notifications queued for transporter and recipient.`, time: "Just now", unread: true, kind: "arrival" }, ...current]);
    } else if (nextStatus === "Delayed") {
      setNotices((current) => [{ id: Date.now(), title: "Delivery exception reported", detail: `${id} · Operations team has been notified.`, time: "Just now", unread: true, kind: "delay" }, ...current]);
    } else if (nextStatus === "Delivered") {
      setNotices((current) => [{ id: Date.now(), title: "Shipment successfully delivered", detail: `${id} · Proof of delivery is available.`, time: "Just now", unread: true, kind: "delivery" }, ...current]);
    }
    if (nextStatus === "Delivered" && shipment.status === "At pickup station") {
      setStations((current) => current.map((station) => station.name === shipment.station
        ? { ...station, parcels: Math.max(0, station.parcels - 1) }
        : station));
    }
    setSelectedShipment((current) => current?.id === id ? { ...current, status: nextStatus, events: [event, ...current.events] } : current);
    setToast(nextStatus === "At pickup station" ? "Station arrival saved · in-app notifications queued" : `Shipment marked ${nextStatus.toLowerCase()}`);
  }

  function addShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sender = String(form.get("sender")).trim();
    const recipient = String(form.get("recipient")).trim();
    const from = String(form.get("from")).trim();
    const to = String(form.get("to")).trim();
    const station = String(form.get("station")).trim();
    const year = new Date().getFullYear();
    let sequence = 8422 + Math.max(0, shipments.length - initialShipments.length);
    let id = `NNC-${year}-${String(sequence).padStart(5, "0")}`;
    while (shipments.some((shipment) => shipment.id === id)) {
      sequence += 1;
      id = `NNC-${year}-${String(sequence).padStart(5, "0")}`;
    }
    const shipment: Shipment = {
      id, sender, recipient, from, to, station,
      service: String(form.get("service")),
      status: "Processing",
      date: "Just now",
      amount: Number(form.get("amount")),
      events: [{ status: "Shipment created", detail: "Package accepted at origin", location: `${from}`, time: "Just now" }],
    };
    setShipments((current) => [shipment, ...current]);
    setModal(null);
    setActivePage("Shipments");
    setSearch("");
    setStatusFilter("All status");
    setToast(`Shipment created · Waybill ${id}`);
  }

  function addStation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("stationName")).trim();
    if (stations.some((station) => station.name.toLowerCase() === name.toLowerCase())) {
      setToast("A pickup station with that name already exists");
      return;
    }
    const station: Station = {
      name,
      location: String(form.get("stationLocation")).trim(),
      manager: String(form.get("stationManager")).trim(),
      capacity: Number(form.get("stationCapacity")),
      parcels: 0,
      status: "Open",
    };
    setStations((current) => [...current, station]);
    setModal(null);
    setToast(`${name} added to your pickup network`);
  }

  function markAllRead() {
    setNotices((current) => current.map((notice) => ({ ...notice, unread: false })));
    setToast("All notifications marked as read");
  }

  function exportShipments() {
    downloadJson("neno-shipments.json", shipments);
    setToast("Shipment export downloaded");
  }

  function exportAnalytics() {
    downloadJson("neno-analytics.json", {
      generatedAt: new Date().toISOString(),
      period,
      shipmentCount: shipments.length,
      deliveryCount: shipments.filter((shipment) => shipment.status === "Delivered").length,
      delayedCount: shipments.filter((shipment) => shipment.status === "Delayed").length,
      totalShipmentValue: shipments.reduce((sum, shipment) => sum + shipment.amount, 0),
      shipments,
    });
    setToast("Analytics report downloaded");
  }

  function renderShipmentTable(rows: Shipment[]) {
    return (
      <div className="table-scroll">
        <table className="shipment-table">
          <thead><tr><th>Waybill</th><th>Recipient</th><th>Route</th><th>Service</th><th>Status</th><th>Created</th><th>Amount</th><th /></tr></thead>
          <tbody>
            {rows.map((shipment) => (
              <tr key={shipment.id}>
                <td><button className="waybill-link" onClick={() => setSelectedShipment(shipment)}>{shipment.id}</button><span className="cell-caption">From {shipment.sender}</span></td>
                <td className="strong-cell">{shipment.recipient}</td>
                <td><span className="route-text">{shipment.from} <ArrowRight size={13} /> {shipment.to}</span></td>
                <td><span className="service-cell">{shipment.service}</span></td>
                <td><StatusBadge status={shipment.status} /></td>
                <td className="muted-cell">{shipment.date}</td>
                <td className="strong-cell">{formatCurrency(shipment.amount)}</td>
                <td><button className="icon-button table-more" aria-label={`View ${shipment.id}`} onClick={() => setSelectedShipment(shipment)}><MoreHorizontal size={18} /></button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="empty-row" colSpan={8}>No shipments match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }

  function renderOverview() {
    return (
      <>
        <div className="welcome-row">
          <div><p className="eyebrow">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p><h1>Good morning, Kofi <span>✦</span></h1><p className="page-intro">Here&apos;s what&apos;s happening across your logistics network today.</p></div>
          <div className="welcome-actions"><button className="button button-outline" onClick={exportAnalytics}><Download size={16} /> Export report</button><button className="button button-primary" onClick={() => setModal("shipment")}><Plus size={17} /> New shipment</button></div>
        </div>
        <section className="metrics-grid">
          <article className="metric-card"><div className="metric-top"><IconBadge><Package size={18} /></IconBadge><span className="trend positive"><ArrowUpRight size={14} /> 12.8%</span></div><p className="metric-label">Total shipments</p><div className="metric-value">{(1248 + shipments.length - initialShipments.length).toLocaleString()}<span className="metric-unit">this month</span></div><div className="metric-bottom"><span>vs. last month</span><span className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></span></div></article>
          <article className="metric-card"><div className="metric-top"><IconBadge tone="orange"><Truck size={18} /></IconBadge><span className="trend positive"><ArrowUpRight size={14} /> 8.2%</span></div><p className="metric-label">In transit</p><div className="metric-value">{shipments.filter((item) => item.status === "In transit").length + 183}<span className="metric-unit">packages</span></div><div className="metric-bottom"><span>Across 12 active routes</span><span className="metric-pulse"><i /> Live</span></div></article>
          <article className="metric-card"><div className="metric-top"><IconBadge tone="green"><Check size={18} /></IconBadge><span className="trend positive"><ArrowUpRight size={14} /> 4.6%</span></div><p className="metric-label">Delivered</p><div className="metric-value">926<span className="metric-unit">this month</span></div><div className="metric-bottom"><span>98.4% on-time rate</span><span className="goal-track"><i /></span></div></article>
          <article className="metric-card"><div className="metric-top"><IconBadge tone="purple"><Warehouse size={18} /></IconBadge><span className="trend neutral">Across network</span></div><p className="metric-label">At pickup stations</p><div className="metric-value">{pickupCount + 42}<span className="metric-unit">awaiting collection</span></div><div className="metric-bottom"><span>Average hold: 1.4 days</span><button className="text-button" onClick={() => navigate("Pickup stations")}>View stations <ArrowRight size={13} /></button></div></article>
        </section>

        <section className="dashboard-grid">
          <article className="panel volume-panel">
            <div className="panel-heading"><div><h2>Shipment volume</h2><p>Keep an eye on your delivery performance</p></div><button className="select-button" onClick={() => setPeriod(period === "Last 7 days" ? "Last 30 days" : "Last 7 days")}><CalendarDays size={15} />{period}<ChevronDown size={14} /></button></div>
            <div className="chart-summary"><div><span className="summary-label">Total shipments</span><strong>1,248</strong><span className="summary-change"><ArrowUpRight size={14} /> 12.8% <span>vs. previous period</span></span></div><div className="chart-legend"><span><i className="legend-blue" /> This period</span><span><i className="legend-light" /> Previous period</span></div></div>
            <div className="chart-area">
              <div className="chart-y-labels"><span>500</span><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div>
              <div className="chart-plot">
                <div className="chart-grid-lines"><i /><i /><i /><i /><i /><i /></div>
                <svg className="line-chart" viewBox="0 0 720 210" preserveAspectRatio="none" role="img" aria-label="Shipment volume increased over the last 7 days">
                  <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2855d9" stopOpacity=".17" /><stop offset="100%" stopColor="#2855d9" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 158 C40 151 52 120 98 133 S155 172 202 128 S259 117 306 137 S355 84 411 98 S467 143 514 85 S568 108 617 66 S675 85 720 28 L720 210 L0 210 Z" fill="url(#chartFill)" />
                  <path d="M0 158 C40 151 52 120 98 133 S155 172 202 128 S259 117 306 137 S355 84 411 98 S467 143 514 85 S568 108 617 66 S675 85 720 28" fill="none" stroke="#2855d9" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  <path d="M0 175 C45 160 55 170 98 160 S160 151 202 164 S260 140 306 157 S365 126 411 149 S465 155 514 131 S569 143 617 124 S675 136 720 111" fill="none" stroke="#c7d0e4" strokeWidth="2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
                  <circle cx="720" cy="28" r="5" fill="#2855d9" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="chart-x-labels"><span>Feb 12</span><span>Feb 13</span><span>Feb 14</span><span>Feb 15</span><span>Feb 16</span><span>Feb 17</span><span>Feb 18</span></div>
              </div>
            </div>
          </article>
          <article className="panel status-panel">
            <div className="panel-heading"><div><h2>Shipment status</h2><p>Live overview of your parcels</p></div><button className="icon-button" aria-label="More options"><Ellipsis size={20} /></button></div>
            <div className="donut-wrap"><div className="donut-chart"><div className="donut-center"><strong>1,248</strong><span>Total</span></div></div><div className="donut-side"><div><i className="dot dot-blue" /><span>Delivered</span><b>926</b></div><div><i className="dot dot-orange" /><span>In transit</span><b>183</b></div><div><i className="dot dot-purple" /><span>Processing</span><b>96</b></div><div><i className="dot dot-gray" /><span>Other</span><b>43</b></div></div></div>
            <div className="status-foot"><span><span className="small-green-dot" /> 98.4% delivery success rate</span><button className="text-button" onClick={() => navigate("Shipments")}>View all <ArrowRight size={13} /></button></div>
          </article>
        </section>
        <section className="panel recent-panel">
          <div className="panel-heading"><div><h2>Recent shipments</h2><p>A quick look at the latest activity across your network</p></div><button className="button button-outline button-small" onClick={() => navigate("Shipments")}>View all shipments <ArrowRight size={14} /></button></div>
          {renderShipmentTable(shipments.slice(0, 5))}
        </section>
        <section className="bottom-grid">
          <article className="panel station-summary">
            <div className="panel-heading"><div><h2>Pickup stations</h2><p>Parcel activity at your busiest locations</p></div><button className="text-button" onClick={() => navigate("Pickup stations")}>All stations <ArrowRight size={13} /></button></div>
            <div className="station-list">{stations.slice(0, 3).map((station) => <div className="station-row" key={station.name}><span className="station-pin"><MapPin size={16} /></span><div className="station-name"><strong>{station.name}</strong><span>{station.location}</span></div><div className="station-load"><div><span>{station.parcels} parcels</span><span>{Math.round(station.parcels / station.capacity * 100)}%</span></div><div className="load-track"><i style={{ width: `${station.parcels / station.capacity * 100}%` }} /></div></div></div>)}</div>
          </article>
          <article className="panel activity-panel">
            <div className="panel-heading"><div><h2>Recent activity</h2><p>The latest updates from your team</p></div><button className="icon-button" aria-label="More options"><Ellipsis size={20} /></button></div>
            <div className="activity-feed"><div className="activity-item"><span className="activity-icon green"><Check size={14} /></span><div><p><strong>Delivery completed</strong> for <button className="inline-link" onClick={() => setSelectedShipment(shipments[2])}>NNC-2025-08419</button></p><span>Accra, Ghana · 8:54 AM</span></div></div><div className="activity-item"><span className="activity-icon blue"><Package size={14} /></span><div><p><strong>3 parcels arrived</strong> at Accra Central station</p><span>Station update · 8:40 AM</span></div></div><div className="activity-item"><span className="activity-icon orange"><Truck size={14} /></span><div><p><strong>Route departed</strong> Lagos → Accra</p><span>Driver: Samuel Osei · 8:16 AM</span></div></div></div>
          </article>
        </section>
      </>
    );
  }

  function renderShipments() {
    return (
      <>
        <div className="welcome-row page-title-row"><div><p className="eyebrow">Operations / Shipments</p><h1>Shipments</h1><p className="page-intro">Create, track and manage every parcel in your network.</p></div><button className="button button-primary" onClick={() => setModal("shipment")}><Plus size={17} /> New shipment</button></div>
        <div className="metrics-grid compact-metrics"><article className="metric-card compact"><span className="metric-label">All shipments</span><strong>{shipments.length}</strong><span className="compact-caption">Across all routes</span></article><article className="metric-card compact"><span className="metric-label">In transit</span><strong>{shipments.filter((item) => item.status === "In transit").length}</strong><span className="compact-caption">Currently moving</span></article><article className="metric-card compact"><span className="metric-label">At pickup</span><strong>{pickupCount}</strong><span className="compact-caption">Awaiting collection</span></article><article className="metric-card compact"><span className="metric-label">Exceptions</span><strong className="orange-number">{shipments.filter((item) => item.status === "Delayed").length}</strong><span className="compact-caption">Need attention</span></article></div>
        <section className="panel full-table-panel">
          <div className="table-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search waybill, sender or recipient..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></div><div className="toolbar-actions"><label className="select-button filter-select"><Filter size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All status</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></label><button className="button button-outline button-small" onClick={exportShipments}><Download size={15} /> Export</button></div></div>
          <div className="table-note">{filteredShipments.length} shipments <span>·</span> Updated just now</div>
          {renderShipmentTable(filteredShipments)}
          <div className="table-pagination"><span>Showing <strong>{filteredShipments.length ? 1 : 0}–{filteredShipments.length}</strong> of <strong>{filteredShipments.length}</strong> results</span><div><button className="pagination-button" disabled><ChevronLeft size={15} /> Previous</button><button className="pagination-button" disabled>Next <ChevronRight size={15} /></button></div></div>
        </section>
      </>
    );
  }

  function renderStations() {
    return (
      <>
        <div className="welcome-row page-title-row"><div><p className="eyebrow">Operations / Network</p><h1>Pickup stations</h1><p className="page-intro">Manage parcel arrivals and collections across your network.</p></div><button className="button button-primary" onClick={() => setModal("station")}><Plus size={17} /> Add station</button></div>
        <section className="metrics-grid compact-metrics"><article className="metric-card compact"><span className="metric-label">Active stations</span><strong>{stations.length}</strong><span className="compact-caption">Across 2 countries</span></article><article className="metric-card compact"><span className="metric-label">Awaiting collection</span><strong>{pickupCount + 42}</strong><span className="compact-caption">Across all stations</span></article><article className="metric-card compact"><span className="metric-label">Collected today</span><strong>64</strong><span className="compact-caption">↑ 12% vs yesterday</span></article><article className="metric-card compact"><span className="metric-label">Network capacity</span><strong>68%</strong><span className="compact-caption">Healthy utilization</span></article></section>
        <section className="station-cards">{stations.map((station, index) => {
          const stationShipments = shipments.filter((shipment) => shipment.station === station.name);
          const arrivals = stationShipments.filter((shipment) => shipment.status === "At pickup station");
          return <article className="panel station-card" key={station.name}><div className="station-card-top"><span className="large-station-icon"><Warehouse size={20} /></span><button className="icon-button" aria-label={`More options for ${station.name}`} onClick={() => setToast(`${station.name} · ${station.manager}`)}><MoreHorizontal size={19} /></button></div><div className="station-card-title"><div><h2>{station.name}</h2><p><MapPin size={13} />{station.location}</p></div><select className={`station-status-select ${station.status.toLowerCase()}`} aria-label={`Set ${station.name} status`} value={station.status} onChange={(event) => setStations((current) => current.map((item) => item.name === station.name ? { ...item, status: event.target.value as Station["status"] } : item))}><option>Open</option><option>Busy</option><option>Closed</option></select></div><div className="station-manager"><span className="avatar avatar-small">{initialFor(station.manager)}</span><span>Managed by <strong>{station.manager}</strong></span></div><div className="station-capacity"><div><span>Station capacity</span><strong>{station.parcels} <small>/ {station.capacity}</small></strong></div><div className="load-track"><i style={{ width: `${station.parcels / station.capacity * 100}%` }} /></div></div><div className="station-card-stats"><div><span>Awaiting pickup</span><strong>{arrivals.length + [12, 8, 6, 4][index % 4]}</strong></div><div><span>Collected today</span><strong>{[24, 18, 14, 8][index % 4]}</strong></div></div><div className="station-card-footer"><span className="station-open"><i /> {station.status === "Closed" ? "Currently closed" : "Open until 8:00 PM"}</span><button className="text-button" onClick={() => { setSearch(station.name); setStatusFilter("At pickup station"); setActivePage("Shipments"); }}>View parcels <ArrowRight size={13} /></button></div></article>;
        })}</section>
        <section className="panel recent-panel station-arrivals"><div className="panel-heading"><div><h2>Ready for collection</h2><p>Update a parcel when the recipient picks it up.</p></div><button className="button button-outline button-small" onClick={() => { setStatusFilter("At pickup station"); navigate("Shipments"); }}>View all parcels <ArrowRight size={14} /></button></div><div className="table-scroll"><table className="shipment-table"><thead><tr><th>Waybill</th><th>Recipient</th><th>Pickup station</th><th>Arrived</th><th>Status</th><th>Action</th></tr></thead><tbody>{shipments.filter((shipment) => shipment.status === "At pickup station").map((shipment) => <tr key={shipment.id}><td><button className="waybill-link" onClick={() => setSelectedShipment(shipment)}>{shipment.id}</button></td><td className="strong-cell">{shipment.recipient}</td><td>{shipment.station}</td><td className="muted-cell">{shipment.date}</td><td><StatusBadge status={shipment.status} /></td><td><button className="button button-outline button-small collect-button" onClick={() => updateShipmentStatus(shipment.id, "Delivered")}><Check size={14} /> Mark collected</button></td></tr>)}{pickupCount === 0 && <tr><td className="empty-row" colSpan={6}>No parcels awaiting collection right now.</td></tr>}</tbody></table></div></section>
      </>
    );
  }

  function renderTracking() {
    return (
      <>
        <div className="tracking-hero"><span className="tracking-orb orb-one" /><span className="tracking-orb orb-two" /><div className="tracking-hero-content"><span className="tracking-kicker"><Activity size={14} /> REAL-TIME TRACKING</span><h1>Your delivery,<br />every step of the way.</h1><p>Enter your waybill number to see the latest updates on your shipment.</p><form className="tracking-search" onSubmit={(event) => { event.preventDefault(); showTracking(); }}><Package size={18} /><input aria-label="Waybill number" placeholder="Enter your waybill number" value={trackingNumber} onChange={(event) => { setTrackingNumber(event.target.value); setTrackingError(""); }} /><button className="button button-primary">Track parcel <ArrowRight size={16} /></button></form><span className="tracking-hint"><ShieldCheck size={14} /> Your shipment information is safe and secure</span></div><div className="tracking-illustration"><div className="route-dash" /><span className="map-pin pin-a"><MapPin size={21} /></span><span className="map-pin pin-b"><MapPin size={21} /></span><div className="parcel-illustration"><Box size={46} strokeWidth={1.4} /></div><span className="floating-label label-left">On the move <i /></span><span className="floating-label label-right"><Check size={13} /> Secure delivery</span></div></div>
        <section className={`tracking-result-wrap ${trackingResult || trackingError ? "has-result" : ""}`}>
          {trackingError && <div className="tracking-error"><CircleHelp size={18} /><div><strong>Shipment not found</strong><span>{trackingError}</span></div><button className="icon-button" onClick={() => setTrackingError("")}><X size={17} /></button></div>}
          {trackingResult && <article className="panel tracking-result"><div className="tracking-result-head"><div><span className="eyebrow">SHIPMENT DETAILS</span><h2>{trackingResult.id}</h2><p>{trackingResult.from} <ArrowRight size={13} /> {trackingResult.to} <span>·</span> {trackingResult.service}</p></div><StatusBadge status={trackingResult.status} /></div><div className="tracking-progress"><div className="progress-stages"><span className="completed"><i><Check size={12} /></i>Booked</span><span className={trackingResult.status !== "Processing" ? "completed" : ""}><i>{trackingResult.status === "Processing" ? "2" : <Check size={12} />}</i>In transit</span><span className={["At pickup station", "Delivered"].includes(trackingResult.status) ? "completed" : ""}><i>{["At pickup station", "Delivered"].includes(trackingResult.status) ? <Check size={12} /> : "3"}</i>At station</span><span className={trackingResult.status === "Delivered" ? "completed" : ""}><i>{trackingResult.status === "Delivered" ? <Check size={12} /> : "4"}</i>Delivered</span></div><div className="progress-line"><i style={{ width: trackingResult.status === "Delivered" ? "100%" : trackingResult.status === "At pickup station" ? "68%" : trackingResult.status === "In transit" ? "36%" : "8%" }} /></div></div><div className="tracking-columns"><div><h3>Tracking history</h3><div className="timeline">{trackingResult.events.map((event, index) => <div className={`timeline-event ${index === 0 ? "latest" : ""}`} key={`${event.status}-${event.time}`}><span className="timeline-dot">{index === 0 && <i />}</span><div><div className="timeline-event-heading"><strong>{event.status}</strong><span>{event.time}</span></div><p>{event.detail}</p><span className="timeline-location"><MapPin size={12} />{event.location}</span></div></div>)}</div></div><aside className="delivery-card"><span className="delivery-card-icon"><Package size={18} /></span><h3>Delivery information</h3><div><span>Recipient</span><strong>{trackingResult.recipient}</strong></div><div><span>Pickup location</span><strong>{trackingResult.station}</strong></div><div><span>Sender</span><strong>{trackingResult.sender}</strong></div></aside></div></article>}
          {!trackingResult && !trackingError && <div className="tracking-help"><span><Zap size={17} /></span><div><strong>Need a hand?</strong><p>Your waybill number can be found on your receipt or in your shipment confirmation.</p></div><button className="text-button" onClick={() => setToast("Support is available at support@nenocourier.com")}>Contact support <ArrowRight size={13} /></button></div>}
        </section>
        <div className="tracking-feature-row"><div><IconBadge><Activity size={17} /></IconBadge><span><strong>Live updates</strong><small>Know the moment anything changes</small></span></div><div><IconBadge tone="green"><ShieldCheck size={17} /></IconBadge><span><strong>Secure & reliable</strong><small>Your parcel is in safe hands</small></span></div><div><IconBadge tone="orange"><MapPin size={17} /></IconBadge><span><strong>Door to door</strong><small>Across 40+ cities in West Africa</small></span></div></div>
      </>
    );
  }

  function renderAnalytics() {
    const total = shipments.length;
    const delivered = shipments.filter((shipment) => shipment.status === "Delivered").length;
    const delayed = shipments.filter((shipment) => shipment.status === "Delayed").length;
    return (
      <>
        <div className="welcome-row page-title-row">
          <div><p className="eyebrow">Insights / Reports</p><h1>Analytics & reports</h1><p className="page-intro">Make smarter decisions with a clear view of your operations.</p></div>
          <div className="welcome-actions">
            <button className="select-button" onClick={() => setPeriod(period === "Last 7 days" ? "Last 30 days" : "Last 7 days")}><CalendarDays size={15} />{period}<ChevronDown size={14} /></button>
            <button className="button button-primary" onClick={exportAnalytics}><Download size={16} /> Export report</button>
          </div>
        </div>
        <section className="metrics-grid"><article className="metric-card"><div className="metric-top"><IconBadge><Package size={18} /></IconBadge><span className="trend positive"><ArrowUpRight size={14} /> 12.8%</span></div><p className="metric-label">Shipments processed</p><div className="metric-value">1,248<span className="metric-unit">this month</span></div><div className="metric-bottom"><span>vs. last month</span></div></article><article className="metric-card"><div className="metric-top"><IconBadge tone="green"><Check size={18} /></IconBadge><span className="trend positive"><ArrowUpRight size={14} /> 4.6%</span></div><p className="metric-label">On-time delivery</p><div className="metric-value">98.4<span className="metric-unit">%</span></div><div className="metric-bottom"><span>Target: 96%</span><span className="goal-track"><i /></span></div></article><article className="metric-card"><div className="metric-top"><IconBadge tone="orange"><Clock3 size={18} /></IconBadge><span className="trend positive"><ArrowDown size={14} /> 8.2%</span></div><p className="metric-label">Avg. delivery time</p><div className="metric-value">1.8<span className="metric-unit">days</span></div><div className="metric-bottom"><span>0.2 days faster</span></div></article><article className="metric-card"><div className="metric-top"><IconBadge tone="purple"><Activity size={18} /></IconBadge><span className="trend neutral">This month</span></div><p className="metric-label">Shipment exceptions</p><div className="metric-value">{delayed + 16}<span className="metric-unit">shipments</span></div><div className="metric-bottom"><span>{delayed} require attention</span></div></article></section>
        <section className="dashboard-grid analytics-grid"><article className="panel volume-panel"><div className="panel-heading"><div><h2>Delivery performance</h2><p>Shipment volume and on-time delivery</p></div><button className="select-button" onClick={() => setPeriod(period === "Last 7 days" ? "Last 30 days" : "Last 7 days")}><CalendarDays size={15} />{period}<ChevronDown size={14} /></button></div><div className="chart-summary"><div><span className="summary-label">Successful deliveries</span><strong>98.4%</strong><span className="summary-change"><ArrowUpRight size={14} /> 4.6% <span>vs. previous period</span></span></div></div><div className="chart-area analytics-chart"><div className="chart-y-labels"><span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span></div><div className="chart-plot"><div className="chart-grid-lines"><i /><i /><i /><i /><i /><i /></div><svg className="line-chart" viewBox="0 0 720 210" preserveAspectRatio="none"><path d="M0 102 C42 96 53 73 102 81 S160 92 206 70 S263 79 310 67 S362 94 412 60 S466 72 516 48 S570 73 620 41 S676 48 720 23" fill="none" stroke="#2855d9" strokeWidth="3" vectorEffect="non-scaling-stroke" /><path d="M0 134 C42 129 54 122 102 126 S160 138 206 115 S264 124 310 102 S364 116 412 91 S468 112 516 83 S571 99 620 75 S676 83 720 60" fill="none" stroke="#31a77a" strokeWidth="2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x-labels"><span>Feb 12</span><span>Feb 13</span><span>Feb 14</span><span>Feb 15</span><span>Feb 16</span><span>Feb 17</span><span>Feb 18</span></div></div></div><div className="analytics-legend"><span><i className="legend-blue" /> Shipments</span><span><i className="legend-green" /> On-time delivery</span></div></article><article className="panel route-panel"><div className="panel-heading"><div><h2>Top routes</h2><p>Highest volume corridors</p></div><button className="icon-button" aria-label="More options"><Ellipsis size={20} /></button></div>{[["Lagos", "Accra", "384", "92%"], ["Accra", "Kumasi", "246", "88%"], ["Lagos", "Kumasi", "192", "76%"], ["Accra", "Tema", "148", "64%"]].map((route, index) => <div className="route-performance" key={route[0] + route[1]}><div className="route-rank">0{index + 1}</div><div className="route-detail"><div><strong>{route[0]} <ArrowRight size={12} /> {route[1]}</strong><span>{route[2]} shipments</span></div><div className="load-track"><i style={{ width: route[3] }} /></div></div><strong className="route-percent">{route[3]}</strong></div>)}</article></section>
        <section className="panel recent-panel"><div className="panel-heading"><div><h2>Shipment summary</h2><p>Based on your current operational data</p></div><span className="analytics-period">{period}</span></div><div className="report-summary-grid"><div><span>Total active records</span><strong>{total}</strong><small>Shipments in this workspace</small></div><div><span>Delivered shipments</span><strong>{delivered}</strong><small>Successfully completed</small></div><div><span>Service revenue</span><strong>{formatCurrency(shipments.reduce((sum, item) => sum + item.amount, 0))}</strong><small>From listed shipments</small></div><div><span>Exceptions</span><strong className="orange-number">{delayed}</strong><small>Need operations follow-up</small></div></div></section>
      </>
    );
  }

  function renderNotifications() {
    return (
      <>
        <div className="welcome-row page-title-row"><div><p className="eyebrow">Workspace / Updates</p><h1>Notifications</h1><p className="page-intro">Stay on top of shipment activity and things that need your attention.</p></div><button className="button button-outline" onClick={markAllRead}><CheckCheck size={16} /> Mark all as read</button></div>
        <section className="panel notifications-panel"><div className="notifications-head"><span>Today <i>{notices.length}</i></span><button className="text-button" onClick={markAllRead}>Clear unread <ArrowRight size={13} /></button></div>{notices.map((notice) => <article className={`notification-row ${notice.unread ? "unread" : ""}`} key={notice.id}><IconBadge tone={notice.kind === "arrival" ? "blue" : notice.kind === "delay" ? "orange" : "green"}>{notice.kind === "arrival" ? <Package size={17} /> : notice.kind === "delay" ? <Clock3 size={17} /> : <Check size={17} />}</IconBadge><div className="notification-content"><strong>{notice.title}</strong><p>{notice.detail}</p><span>{notice.time}</span></div>{notice.unread && <i className="unread-dot" />}</article>)}{notices.length === 0 && <div className="empty-notices"><Bell size={24} /><strong>You&apos;re all caught up</strong><span>New updates will appear here.</span></div>}</section>
      </>
    );
  }

  function renderSettings() {
    return (
      <>
        <div className="welcome-row page-title-row"><div><p className="eyebrow">Workspace / Preferences</p><h1>Settings</h1><p className="page-intro">Manage your workspace preferences and team access.</p></div></div>
        <div className="settings-layout"><aside className="panel settings-menu"><button className="settings-link selected"><Settings size={16} /> General</button><button className="settings-link"><Users size={16} /> Team & roles</button><button className="settings-link"><Bell size={16} /> Notifications</button><button className="settings-link"><ShieldCheck size={16} /> Security</button></aside><section className="panel settings-content"><div className="settings-section-head"><h2>Workspace profile</h2><p>Update your company information and regional preferences.</p></div><div className="company-profile"><div className="company-mark">n</div><div><strong>Neno Courier</strong><span>Business workspace · Created Jan 2023</span></div><button className="button button-outline button-small" onClick={() => setToast("Company profile settings saved.")}>Edit profile</button></div><div className="settings-field"><label>Workspace name</label><input value="Neno Courier" readOnly /></div><div className="settings-two-fields"><div className="settings-field"><label>Default region</label><select defaultValue="West Africa"><option>West Africa</option><option>East Africa</option></select></div><div className="settings-field"><label>Currency</label><select defaultValue="GHS · Ghanaian Cedi"><option>GHS · Ghanaian Cedi</option><option>NGN · Nigerian Naira</option><option>USD · US Dollar</option></select></div></div><div className="settings-divider" /><div className="settings-section-head"><h2>Team members</h2><p>People with access to this operations workspace.</p></div>{[["Kofi Mensah", "kofi@nenocourier.com", "Admin"], ["Nana Owusu", "nana@nenocourier.com", "Station agent"], ["Samuel Osei", "samuel@nenocourier.com", "Transporter"]].map((person) => <div className="team-row" key={person[1]}><span className="avatar">{initialFor(person[0])}</span><div><strong>{person[0]}</strong><span>{person[1]}</span></div><span className="role-pill">{person[2]}</span></div>)}</section></div>
      </>
    );
  }

  function renderPage() {
    if (selectedShipment) {
      const shipment = shipments.find((item) => item.id === selectedShipment.id) ?? selectedShipment;
      return <section className="panel detail-panel"><button className="back-link" onClick={() => setSelectedShipment(null)}><ChevronLeft size={16} /> Back to {activePage === "Overview" ? "overview" : "shipments"}</button><div className="detail-heading"><div><span className="eyebrow">SHIPMENT DETAILS</span><h1>{shipment.id}</h1><p>Created {shipment.date}</p></div><StatusBadge status={shipment.status} /></div><div className="detail-route"><div><span>FROM</span><strong>{shipment.from}</strong><small>{shipment.sender}</small></div><div className="route-line"><i /><ArrowRight size={16} /><i /></div><div><span>TO</span><strong>{shipment.to}</strong><small>{shipment.recipient}</small></div></div><div className="detail-summary"><div><span>Service</span><strong>{shipment.service}</strong></div><div><span>Amount</span><strong>{formatCurrency(shipment.amount)}</strong></div><div><span>Pickup station</span><strong>{shipment.station}</strong></div><div><span>Waybill</span><strong>{shipment.id}</strong></div></div><div className="detail-actions"><button className="button button-outline" onClick={() => showTracking(shipment.id)}><Eye size={16} /> Public tracking view</button><label className="select-button"><Activity size={15} /><select aria-label="Update shipment status" value={shipment.status} onChange={(event) => updateShipmentStatus(shipment.id, event.target.value as Status)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></label></div><div className="detail-history"><h2>Shipment history</h2><div className="timeline">{shipment.events.map((event, index) => <div className={`timeline-event ${index === 0 ? "latest" : ""}`} key={`${event.status}-${event.time}`}><span className="timeline-dot">{index === 0 && <i />}</span><div><div className="timeline-event-heading"><strong>{event.status}</strong><span>{event.time}</span></div><p>{event.detail}</p><span className="timeline-location"><MapPin size={12} />{event.location}</span></div></div>)}</div></div></section>;
    }
    switch (activePage) {
      case "Shipments": return renderShipments();
      case "Pickup stations": return renderStations();
      case "Track shipment": return renderTracking();
      case "Analytics": return renderAnalytics();
      case "Notifications": return renderNotifications();
      case "Settings": return renderSettings();
      default: return renderOverview();
    }
  }

  const navGroups = [
    { label: "WORKSPACE", items: [{ label: "Overview", icon: Activity }, { label: "Shipments", icon: Package, count: String(shipments.length) }, { label: "Pickup stations", icon: Warehouse }, { label: "Track shipment", icon: MapPin }] },
    { label: "INSIGHTS", items: [{ label: "Analytics", icon: FileText }, { label: "Notifications", icon: Bell, count: unreadCount ? String(unreadCount) : undefined }] },
    { label: "PREFERENCES", items: [{ label: "Settings", icon: Settings }] },
  ];

  return (
    <div className={`app-shell ${mobileNavOpen ? "nav-open" : ""}`}>
      {mobileNavOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-symbol"><span /><span /><span /><span /></div><div><strong>neno<span>.</span></strong><small>COURIER & LOGISTICS</small></div><button className="sidebar-collapse" aria-label="Collapse navigation"><Menu size={17} /></button></div>
        <button className="workspace-switch"><span className="workspace-icon">N</span><span><strong>Neno Courier</strong><small>Business workspace</small></span><ChevronDown size={15} /></button>
        <nav className="primary-nav">{navGroups.map((group) => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map((item) => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${activePage === item.label && !selectedShipment ? "active" : ""}`} onClick={() => navigate(item.label)}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.count && <i className={item.label === "Notifications" ? "nav-count notification-count" : "nav-count"}>{item.count}</i>}</button>; })}</div>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-spark"><Zap size={15} fill="currentColor" /></span><strong>Need a hand?</strong><p>Our team is here to help you keep things moving.</p><button onClick={() => setToast("Reach our team at support@nenocourier.com")}>Visit help center <ArrowRight size={13} /></button></div><button className="user-profile"><span className="avatar user-avatar">KM</span><span><strong>Kofi Mensah</strong><small>Administrator</small></span><MoreHorizontal size={19} /></button></div>
      </aside>
      <main className="main-column">
        <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{selectedShipment ? "Shipment details" : activePage}</strong></div></div><div className="topbar-actions"><div className="global-search"><Search size={16} /><input placeholder="Search anything..." value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value) setActivePage("Shipments"); }} /><kbd>⌘ K</kbd></div><span className="topbar-divider" /><button className="icon-button topbar-help" aria-label="Help" onClick={() => setToast("Our support team is ready at support@nenocourier.com")}><CircleHelp size={18} /></button><div className="notice-wrapper"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNoticeOpen(!noticeOpen)}><Bell size={18} />{unreadCount > 0 && <i />}</button>{noticeOpen && <div className="notice-popover"><div className="notice-popover-head"><strong>Notifications</strong><button onClick={markAllRead}>Mark all read</button></div>{notices.slice(0, 3).map((notice) => <button className="notice-popover-row" key={notice.id} onClick={() => { navigate("Notifications"); setNoticeOpen(false); }}><span className={`notice-mini-icon ${notice.kind}`}><Bell size={14} /></span><span><strong>{notice.title}</strong><small>{notice.time}</small></span>{notice.unread && <i />}</button>)}<button className="notice-view-all" onClick={() => { navigate("Notifications"); setNoticeOpen(false); }}>View all notifications <ArrowRight size={13} /></button></div>}</div><span className="topbar-divider" /><button className="topbar-user" onClick={() => navigate("Settings")}><span className="avatar topbar-avatar">KM</span><ChevronDown size={14} /></button></div></header>
        <div className={`page-content ${activePage === "Track shipment" ? "tracking-page-content" : ""}`}>{renderPage()}<footer className="app-footer"><span>© {new Date().getFullYear()} Neno Courier</span><span><i /> All systems operational</span><button onClick={() => setToast("Neno Courier Operations · Version 1.0.0")}>v1.0.0</button></footer></div>
      </main>
      {modal === "shipment" && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-shipment-title">
            <div className="modal-heading">
              <div><span className="eyebrow">NEW SHIPMENT</span><h2 id="create-shipment-title">Create a shipment</h2><p>Enter sender and delivery details to generate a waybill.</p></div>
              <button className="icon-button" aria-label="Close" onClick={() => setModal(null)}><X size={19} /></button>
            </div>
            <form onSubmit={addShipment}>
              <div className="form-grid">
                <label>Sender name<input name="sender" required placeholder="e.g. Ama Mensah" /></label>
                <label>Recipient name<input name="recipient" required placeholder="e.g. Kofi Asare" /></label>
                <label>Origin city<input name="from" required placeholder="e.g. Accra" /></label>
                <label>Destination city<input name="to" required placeholder="e.g. Lagos" /></label>
                <label>Pickup station<select name="station" required defaultValue=""><option value="" disabled>Select station</option>{stations.map((station) => <option key={station.name} disabled={station.status === "Closed"}>{station.name}{station.status === "Closed" ? " · Closed" : ""}</option>)}</select></label>
                <label>Service type<select name="service" defaultValue="Standard"><option>Standard</option><option>Express</option><option>Same day</option></select></label>
                <label className="full-field">Shipping amount (GHS)<input name="amount" type="number" min="1" step="0.5" required placeholder="e.g. 35" /></label>
              </div>
              <div className="modal-info"><ShieldCheck size={16} /><span>A unique waybill number will be generated automatically.</span></div>
              <div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Create shipment</button></div>
            </form>
          </section>
        </div>
      )}
      {modal === "station" && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-station-title"><div className="modal-heading"><div><span className="eyebrow">NETWORK MANAGEMENT</span><h2 id="create-station-title">Add pickup station</h2><p>Set up a collection point for your delivery network.</p></div><button className="icon-button" aria-label="Close" onClick={() => setModal(null)}><X size={19} /></button></div><form onSubmit={addStation}><div className="form-grid"><label>Station name<input name="stationName" required placeholder="e.g. East Legon Hub" /></label><label>Location<input name="stationLocation" required placeholder="City, neighborhood" /></label><label>Station manager<input name="stationManager" required placeholder="Full name" /></label><label>Parcel capacity<input name="stationCapacity" type="number" min="1" required placeholder="e.g. 60" /></label></div><div className="modal-info"><Warehouse size={16} /><span>The station will be added to your active pickup network.</span></div><div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Add station</button></div></form></section></div>}
      {toast && <div className="toast-message"><span><Check size={15} /></span>{toast}<button aria-label="Dismiss message" onClick={() => setToast("")}><X size={15} /></button></div>}
    </div>
  );
}
