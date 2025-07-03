import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import { AppProvider, useAppContext } from "./context/AppContext";
// App wrapper component to access context
function AppContent() {
  const { user } = useAppContext();
  const [showProfile, setShowProfile] = useState(false);
  // If no user, show auth page
  if (!user) {
    return <Auth />;
  }
  // If showing profile, render profile page
  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }
  // Otherwise show main page
  return <MainPage onProfileClick={() => setShowProfile(true)} />;
}
export function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
