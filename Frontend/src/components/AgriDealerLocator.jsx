import React, { useState } from "react";
import "./AgriDealerLocator.css";
import {
  IconMapPin,
  IconCheck,
  IconShield,
  IconWhatsApp,
  IconSearch,
  IconSparkles,
} from "./Icons";

const DEALERS_DATA = [
  {
    id: 1,
    name: "Kisan Seva Kendra & Agro Chemicals",
    type: "Govt. Authorized Kendra",
    distance: "2.4 km",
    rating: 4.8,
    phone: "+919876543210",
    address: "Plot 14, Main Mandi Road, Sector 3",
    stock: [
      { item: "Mancozeb 75% WP (1 Kg)", price: "₹480", inStock: true },
      { item: "Copper Oxychloride 50% (500g)", price: "₹340", inStock: true },
      { item: "Dimethomorph 50% (100g)", price: "₹620", inStock: true },
    ],
    badges: ["Verified Dealer", "Govt. Subsidized"],
  },
  {
    id: 2,
    name: "Bio-Harvest Organic Farm Inputs",
    type: "Certified Organic Store",
    distance: "4.1 km",
    rating: 4.9,
    phone: "+919812345678",
    address: "Green Valley Agro Hub, Near Highway 48",
    stock: [
      { item: "Trichoderma Viride Bio-Fungicide (1L)", price: "₹290", inStock: true },
      { item: "Pseudomonas Fluorescens (1L)", price: "₹310", inStock: true },
      { item: "Neem Oil 10,000 PPM (1L)", price: "₹450", inStock: true },
    ],
    badges: ["100% Organic Certified", "Eco-Friendly"],
  },
  {
    id: 3,
    name: "National Agricultural Drone & Spray Services",
    type: "Equipment & Drone Hub",
    distance: "6.8 km",
    rating: 4.7,
    phone: "+919845678901",
    address: "Aviation Hangar 2, Rural Agri Park",
    stock: [
      { item: "DJI Agras T40 Drone Spray Rental", price: "₹450 / Acre", inStock: true },
      { item: "16L Battery Knapsack Sprayer", price: "₹2,800", inStock: true },
      { item: "Anti-Drift Spray Nozzles (Set of 4)", price: "₹380", inStock: true },
    ],
    badges: ["Custom Hiring Center", "Instant Booking"],
  },
];

const AgriDealerLocator = ({ defaultCrop = "Potato" }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDealers = DEALERS_DATA.filter((dealer) => {
    const matchesType =
      filterType === "all" ||
      (filterType === "chemical" && dealer.type.includes("Authorized")) ||
      (filterType === "organic" && dealer.type.includes("Organic")) ||
      (filterType === "equipment" && dealer.type.includes("Equipment"));

    const matchesSearch =
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.stock.some((s) => s.item.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = (dealer) => {
    const text = encodeURIComponent(
      `Hello ${dealer.name}, I found your store on AgroPath AI Plant Doctor. Do you have current stock for potato blight fungicides / bio-control products?`
    );
    window.open(`https://wa.me/${dealer.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const handleDirections = (dealer) => {
    const query = encodeURIComponent(`${dealer.name}, ${dealer.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="agri-dealer-card">
      <div className="dealer-header-row">
        <div className="dealer-title-col">
          <div className="dealer-badge">
            <IconMapPin size={14} />
            <span>Local Supply Network</span>
          </div>
          <h3 className="dealer-main-title">
            Nearby Verified Agrochemical &amp; Organic Dealers
          </h3>
          <p className="dealer-sub-desc">
            Directly connect with authorized Krishi Kendras, certified organic bio-fertilizer stores, and drone hiring centers near your farm.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="dealer-toolbar">
        <div className="dealer-search-box">
          <IconSearch size={16} />
          <input
            type="text"
            placeholder="Search chemical name (e.g. Mancozeb, Trichoderma, Sprayer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dealer-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All Supplies
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === "chemical" ? "active" : ""}`}
            onClick={() => setFilterType("chemical")}
          >
            Chemical Fungicides
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === "organic" ? "active" : ""}`}
            onClick={() => setFilterType("organic")}
          >
            Organic Bio-Control
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === "equipment" ? "active" : ""}`}
            onClick={() => setFilterType("equipment")}
          >
            Drone &amp; Sprayers
          </button>
        </div>
      </div>

      {/* Dealers Cards Grid */}
      <div className="dealers-grid">
        {filteredDealers.map((dealer) => (
          <div key={dealer.id} className="dealer-item-card">
            <div className="dic-header">
              <div className="d-title-block">
                <span className="d-type-label">{dealer.type}</span>
                <h4 className="d-name">{dealer.name}</h4>
                <span className="d-dist">📍 {dealer.distance} away • {dealer.address}</span>
              </div>
              <div className="d-rating">
                ★ {dealer.rating}
              </div>
            </div>

            <div className="d-badges-row">
              {dealer.badges.map((b, i) => (
                <span key={i} className="d-badge-pill">✓ {b}</span>
              ))}
            </div>

            <div className="d-stock-box">
              <span className="d-stock-title">Available Products &amp; Real-time Pricing:</span>
              <ul className="d-stock-list">
                {dealer.stock.map((st, i) => (
                  <li key={i} className="d-stock-item">
                    <span className="ds-name">{st.item}</span>
                    <span className="ds-price">{st.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-actions-row">
              <button
                type="button"
                className="d-wa-btn"
                onClick={() => handleWhatsApp(dealer)}
              >
                <IconWhatsApp size={16} />
                <span>WhatsApp Order</span>
              </button>

              <button
                type="button"
                className="d-map-btn"
                onClick={() => handleDirections(dealer)}
              >
                <IconMapPin size={16} />
                <span>Directions</span>
              </button>

              <button
                type="button"
                className="d-call-btn"
                onClick={() => handleCall(dealer.phone)}
              >
                Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriDealerLocator;
