import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./pages/MainContent";
import AboutSection from "./pages/AboutSection";
import Achievements from "./pages/Achievements";
import GithubProgress from "./pages/GithubProgress";
import Projects from "./pages/Projects";
import Chat from "./components/PublicChat";
import Contact from "./components/Contact";
import Notification from "./components/Notification";
import Guestbook from "./components/Guestbook";
import Polls from "./components/Polls";
import HireMe from "./components/HireMe";
import "./App.css";

// Firebase Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  onValue,
  onDisconnect,
  runTransaction,
  increment,
  set,
  serverTimestamp,
} from "firebase/database";

// Konfigurasi Firebase (Portofolio-7def4)
const firebaseConfig = {
  apiKey: "AIzaSyCOvc0b1PFjdjRE4PBXaCkTkOBl0K1K0O8",
  authDomain: "portofolio-7def4.firebaseapp.com",
  databaseURL: "https://portofolio-7def4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portofolio-7def4",
  storageBucket: "portofolio-7def4.firebasestorage.app",
  messagingSenderId: "352134782984",
  appId: "1:352134782984:web:3d174429dd6efa6c1cb1bd",
  measurementId: "G-7X2Z4WC4NY",
};

// 1. Inisialisasi Firebase & Paksa ke Singapore Instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app, "https://portofolio-7def4-default-rtdb.asia-southeast1.firebasedatabase.app");
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export db agar komponen lain (Chat, Guestbook) sinkron
export { db };

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [visitors, setVisitors] = useState(0);
  const hasJoined = useRef(false);

  useEffect(() => {
    console.log("🚀 Firebase System Started...");

    const connectedRef = ref(db, ".info/connected");
    const counterRef = ref(db, "online_users");

    // Fungsi Kirim Detail Lokasi & IP
    const sendLocationToFirebase = async (lat, lng, city, idType) => {
      try {
        const userId = `${idType}_${Math.random().toString(36).substr(2, 6)}`;
        const locationRef = ref(db, `online_users_details/${userId}`);

        await set(locationRef, {
          city: city || "Unknown Location",
          lat: Number(lat) || 0,
          lng: Number(lng) || 0,
          method: idType,
          timestamp: serverTimestamp(),
        });

        // Hapus data detail otomatis saat user close tab
        onDisconnect(locationRef).remove();
        console.log(`✅ Success: Location via ${idType} sent to DB.`);
      } catch (err) {
        console.error("❌ Firebase Set Error:", err);
      }
    };

    // Ambil Lokasi via API IP (Cadangan & Paling Stabil)
    const fetchLocationByIP = async () => {
      console.log("📡 Fetching IP Location...");
      try {
        const res = await fetch(
          `https://api.ipgeolocation.io/ipgeo?apiKey=eb40ea5f56874ee4b2cd557f22a4b601`
        );
        const data = await res.json();
        if (data.latitude) {
          sendLocationToFirebase(data.latitude, data.longitude, data.city, "ip");
        }
      } catch (err) {
        console.error("❌ Geo IP API Error:", err);
      }
    };

    // Monitor Koneksi & Transaction Visitor
    const unsubscribeConnect = onValue(connectedRef, (snap) => {
      if (snap.val() === true && !hasJoined.current) {
        console.log("🌐 Connected to Firebase Singapore!");

        // Update Online Counter (+1)
        runTransaction(counterRef, (count) => (count || 0) + 1)
          .then(() => console.log("📈 Visitor Counter Incremented"))
          .catch((err) => console.error("❌ Transaction Fail:", err));

        // Auto Decrease Counter (-1) saat offline
        onDisconnect(counterRef).set(increment(-1));

        // Pemicu Pengiriman Lokasi
        fetchLocationByIP();
        hasJoined.current = true;
      }
    });

    // Real-time Listener untuk Update UI Jumlah Visitor
    const unsubscribeCounter = onValue(counterRef, (snapshot) => {
      setVisitors(snapshot.val() || 0);
    });

    return () => {
      unsubscribeConnect();
      unsubscribeCounter();
    };
  }, []);

  return (
    <div className="app-layout">
      <Notification />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitorCount={visitors}
      />

      <div className="main-viewport">
        {/* Widget Online Status */}
        <div className="live-status-widget">
          <span className="dot-animation"></span>
          <span className="visitor-text">{visitors} Online Now</span>
        </div>

        {/* Router Sederhana Berdasarkan State */}
        <div className="content-container">
          {activeTab === "Home" && <MainContent />}
          {activeTab === "About" && <AboutSection />}
          {activeTab === "Achievements" && <Achievements />}
          {activeTab === "Progres" && <GithubProgress />}
          {activeTab === "Projects" && <Projects />}
          {activeTab === "Chat" && <Chat />}
          {activeTab === "Contact" && <Contact />}
          {activeTab === "Guestbook" && <Guestbook />}
          {activeTab === "Polls" && <Polls />}
          {activeTab === "HireMe" && <HireMe />}
        </div>
      </div>
    </div>
  );
}

export default App;