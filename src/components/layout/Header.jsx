import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BiMenu, BiX, BiMoon, BiSun, BiUser, BiHelpCircle } from 'react-icons/bi';
import { theme } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import ThemeToggle from '../ui/ThemeToggle';
import OnboardingModal from '../onboarding/OnboardingModal';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.neutral.white};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LogoIcon = styled.div`
  font-size: 1.8rem;
  color: ${theme.colors.primary.main};
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral.darkest};
  margin: 0;
  
  span {
    color: ${theme.colors.primary.main};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.neutral.dark};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.neutral.white};
  z-index: 200;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const MobileMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  flex: 1;
`;

const MobileMenuFooter = styled.div`
  margin-top: auto;
  padding-top: ${theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const Header = ({ toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useAppContext();
  
  // Close mobile menu on resize if window width becomes larger than mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  return (
    <>
      <HeaderContainer>
        <Logo>
          <LogoIcon>🗓️</LogoIcon>
          <LogoText>
            Weekend<span>ly</span>
          </LogoText>
        </Logo>
        
        <HeaderActions>
          <IconButton 
            icon={<BiHelpCircle />}
            onClick={() => setIsHelpModalOpen(true)}
            tooltip="Help & Tips"
          />
          
          <ThemeToggle 
            isDark={darkMode}
            onChange={toggleDarkMode}
          />
          
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <BiMenu />
          </MobileMenuButton>
          
          <Button 
            variant="primary"
            icon={<BiUser />}
            size="small"
            style={{ display: 'none' }} // Hidden for now (user account feature)
          >
            Sign In
          </Button>
        </HeaderActions>
      </HeaderContainer>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <MobileMenuHeader>
              <Logo>
                <LogoIcon>🗓️</LogoIcon>
                <LogoText>
                  Weekend<span>ly</span>
                </LogoText>
              </Logo>
              
              <IconButton 
                icon={<BiX size={24} />}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              />
            </MobileMenuHeader>
            
            <MobileMenuContent>
              <Button 
                variant="primary"
                size="large"
                fullWidth
                onClick={() => {
                  toggleSidebar();
                  setIsMobileMenuOpen(false);
                }}
              >
                Saturday Planner
              </Button>
              
              <Button 
                variant="secondary"
                size="large"
                fullWidth
                onClick={() => {
                  toggleSidebar();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sunday Planner
              </Button>
              
              <Button 
                variant="outline"
                size="large"
                fullWidth
                icon={<BiHelpCircle />}
                onClick={() => {
                  setIsHelpModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Help & Tips
              </Button>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing.lg }}>
                <ThemeToggle 
                  isDark={darkMode}
                  onChange={toggleDarkMode}
                  showLabel
                />
              </div>
            </MobileMenuContent>
            
            <MobileMenuFooter>
              <p style={{ color: theme.colors.neutral.dark, fontSize: '0.9rem' }}>
                © 2025 Weekendly
              </p>
            </MobileMenuFooter>
          </MobileMenu>
        )}
      </AnimatePresence>
      
      {/* Help Modal */}
      <OnboardingModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
};

export default Header;