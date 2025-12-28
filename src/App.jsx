import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './pages/MainContent';
import AboutSection from './pages/AboutSection';
import Achievements from './pages/Achievements';
import GithubProgress from './pages/GithubProgress';
import Projects from './pages/Projects';
import Chat from './components/PublicChat';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    // "app-layout" harus menjadi Flex Container
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Area konten di samping sidebar */}
      <div className="main-viewport">
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