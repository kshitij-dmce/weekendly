import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { theme } from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import { activitiesData } from './data/activities';
import { AppWrapper, Container, ContentArea } from './styles/Layout';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WeekendPlanner from './components/planner/WeekendPlanner';
import ActivitiesLibrary from './components/activities/ActivitiesLibrary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppContextProvider } from './context/AppContext';
import IntroOverlay from './components/onboarding/IntroOverlay';

const App = () => {
  // State Management
  const [selectedDay, setSelectedDay] = useState('saturday');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage('weekendly-first-visit', true);
  const [showIntro, setShowIntro] = useState(isFirstVisit);
  const [scheduleData, setScheduleData] = useLocalStorage('weekendly-schedule', {
    saturday: [],
    sunday: []
  });
  const [theme, setTheme] = useLocalStorage('weekendly-theme', 'default');
  
  // Mobile detection for DnD backend
  const dndBackend = isMobile ? TouchBackend : HTML5Backend;
  
  // Close intro overlay after first visit
  const handleCloseIntro = () => {
    setShowIntro(false);
    setIsFirstVisit(false);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DndProvider backend={dndBackend}>
        <AppContextProvider>
          <AppWrapper>
            <Header toggleSidebar={toggleSidebar} />
            <Container>
              <Sidebar 
                isOpen={sidebarOpen} 
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                theme={theme}
                setTheme={setTheme}
              />
              <ContentArea isSidebarOpen={sidebarOpen}>
                <WeekendPlanner 
                  selectedDay={selectedDay}
                  scheduleData={scheduleData}
                  setScheduleData={setScheduleData}
                />
                <ActivitiesLibrary 
                  activities={activitiesData}
                  selectedDay={selectedDay}
                  scheduleData={scheduleData}
                  setScheduleData={setScheduleData}
                />
              </ContentArea>
            </Container>
            
            {showIntro && (
              <IntroOverlay onClose={handleCloseIntro} />
            )}
          </AppWrapper>
        </AppContextProvider>
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;