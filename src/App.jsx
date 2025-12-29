import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './pages/MainContent';
import AboutSection from './pages/AboutSection';
import Achievements from './pages/Achievements';
import GithubProgress from './pages/GithubProgress';
import Projects from './pages/Projects';
import Chat from './components/PublicChat';
import Contact from './components/Contact';
import Notification from './components/Notification';
import "./App.css";

import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, onDisconnect, runTransaction, increment, set, serverTimestamp } from "firebase/database";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC4X_F67ci5dG2KAw5VpV2yXwXAJHwnKbU",
  authDomain: "visitor-counter-web.firebaseapp.com",
  databaseURL: "https://visitor-counter-web-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "visitor-counter-web",
  storageBucket: "visitor-counter-web.firebasestorage.app",
  messagingSenderId: "864397864528",
  appId: "1:864397864528:web:447116cf62d00bfb8beb55",
  measurementId: "G-SEMKZNHK7P"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
export { db };

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [visitors, setVisitors] = useState(0);
  const hasJoined = useRef(false);

  useEffect(() => {
    const connectedRef = ref(db, ".info/connected");
    const counterRef = ref(db, 'online_users');

    // Fungsi Mengirim Data ke Firebase
    const sendLocationToFirebase = async (lat, lng, city, idType) => {
      const userId = `${idType}_${Math.random().toString(36).substr(2, 6)}`;
      const locationRef = ref(db, `online_users_details/${userId}`);

      await set(locationRef, {
        city: city || "Unknown Location",
        lat: Number(lat),
        lng: Number(lng),
        timestamp: serverTimestamp()
      });

      onDisconnect(locationRef).remove();
      sessionStorage.setItem("geo_sent", "true");
    };

    // Cadangan: Ambil lokasi via IP jika GPS ditolak
    const fetchLocationByIP = async () => {
      try {
        const API_KEY = "eb40ea5f56874ee4b2cd557f22a4b601";
        const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`);
        const data = await res.json();
        sendLocationToFirebase(data.latitude, data.longitude, data.city, "ip");
      } catch (err) { console.error("IP Geo Error:", err); }
    };

    // Logika Utama: Geolocation Akurasi Tinggi
    const updateUserLocation = () => {
      if (sessionStorage.getItem("geo_sent")) return;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Reverse Geocoding: Mencari nama Kota/Kecamatan asli dari GPS
            let cityName = "Area Terdeteksi";
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || "Lokasi Spesifik";
            } catch (e) { console.error("Reverse Geo Error:", e); }

            sendLocationToFirebase(latitude, longitude, cityName, "gps");
          },
          (error) => {
            console.warn("Akses GPS ditolak, beralih ke estimasi IP...");
            fetchLocationByIP();
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        fetchLocationByIP();
      }
    };

    const unsubscribeConnect = onValue(connectedRef, (snap) => {
      if (snap.val() === true && !hasJoined.current) {
        runTransaction(counterRef, (count) => (count || 0) + 1);
        onDisconnect(counterRef).set(increment(-1));
        updateUserLocation();
        hasJoined.current = true;
      }
    });

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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} visitorCount={visitors} />

      <div className="main-viewport">
        <div className="live-status-widget">
          <span className="dot-animation"></span>
          <span className="visitor-text">{visitors} Online Now</span>
        </div>

        {activeTab === 'Home' && <MainContent />}
        {activeTab === 'About' && <AboutSection />}
        {activeTab === 'Achievements' && <Achievements />}
        {activeTab === 'Progres' && <GithubProgress />}
        {activeTab === 'Projects' && <Projects />}
        {activeTab === 'Chat' && <Chat />}
        {activeTab === 'Contact' && <Contact />}
      </div>
    </div>
  );
}

export default App;