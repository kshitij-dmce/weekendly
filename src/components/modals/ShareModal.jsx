import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiCopy, BiDownload, BiShareAlt } from 'react-icons/bi';
import { FaInstagram, FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import { theme } from '../../theme/theme';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.neutral.light};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral.darkest};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const PreviewContainer = styled.div`
  background-color: ${theme.colors.neutral.lightest};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const PlanPreview = styled.div`
  background-color: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.lg};
`;

const PreviewTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.neutral.darkest};
  margin: 0 0 ${theme.spacing.md} 0;
  text-align: center;
  
  span {
    color: ${props => props.day === 'saturday' ? theme.colors.primary.main : theme.colors.secondary.main};
    text-transform: capitalize;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const TimeSlotGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const TimeSlotHeader = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.day === 'saturday' ? theme.colors.primary.main : theme.colors.secondary.main};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${props => props.day === 'saturday' ? theme.colors.primary.light : theme.colors.secondary.light};
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background-color: ${theme.colors.neutral.lightest};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  
  &::before {
    content: '•';
    color: ${props => {
      switch(props.category) {
        case 'outdoors': return theme.colors.accent.green;
        case 'food': return theme.colors.accent.yellow;
        case 'entertainment': return theme.colors.accent.purple;
        case 'relaxation': return theme.colors.primary.light;
        case 'social': return theme.colors.secondary.light;
        case 'productive': return theme.colors.primary.dark;
        default: return theme.colors.primary.main;
      }
    }};
    font-size: 1.5rem;
  }
`;

const ActivityTitle = styled.span`
  font-weight: 600;
  color: ${theme.colors.neutral.darkest};
`;

const ShareOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ShareTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.neutral.darkest};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.bgColor};
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.md};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background-color: ${theme.colors.neutral.lightest};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const LinkText = styled.input`
  flex: 1;
  border: none;
  background-color: transparent;
  padding: ${theme.spacing.sm};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.dark};
  
  &:focus {
    outline: none;
  }
`;

const Footer = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.neutral.dark};
  text-align: center;
  margin-top: ${theme.spacing.lg};
`;

const timeSlots = [
  { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM', icon: '🌆' },
  { id: 'night', label: 'Night', time: '8:00 PM - 11:00 PM', icon: '🌙' },
];

const ShareModal = ({ isOpen, onClose, scheduleData, selectedDay }) => {
  const [isCopied, setIsCopied] = useState(false);
  const previewRef = useRef(null);
  
  // Generate a sample share link
  const shareLink = `https://weekendly.vercel.app/share/${selectedDay}-${Date.now().toString(36)}`;
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };
  
  // Handle download as image
  const handleDownload = () => {
    if (previewRef.current) {
      toPng(previewRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `weekendly-${selectedDay}-plan.png`;
          link.href = dataUrl;
          link.click();
        });
    }
  };
  
  // Filter activities by time slot
  const getActivitiesByTimeSlot = (timeSlotId) => {
    return scheduleData[selectedDay].filter(activity => activity.timeSlot === timeSlotId);
  };
  
  // Check if time slot has activities
  const hasActivities = (timeSlotId) => {
    return getActivitiesByTimeSlot(timeSlotId).length > 0;
  };
  
  // Format date for the preview
  const getFormattedDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Share Your Weekend Plan</ModalTitle>
              <IconButton 
                icon={<BiX size={24} />}
                onClick={onClose}
                aria-label="Close modal"
              />
            </ModalHeader>
            
            <ModalBody>
              <PreviewContainer>
                <PlanPreview ref={previewRef}>
                  <PreviewTitle day={selectedDay}>
                    My <span>{selectedDay}</span> Plan
                  </PreviewTitle>
                  
                  <ActivityList>
                    {timeSlots.map((slot) => (
                      hasActivities(slot.id) && (
                        <TimeSlotGroup key={slot.id}>
                          <TimeSlotHeader day={selectedDay}>
                            {slot.icon} {slot.label} ({slot.time})
                          </TimeSlotHeader>
                          
                          {getActivitiesByTimeSlot(slot.id).map((activity) => (
                            <ActivityItem 
                              key={activity.id}
                              category={activity.category}
                            >
                              <ActivityTitle>{activity.title}</ActivityTitle>
                            </ActivityItem>
                          ))}
                        </TimeSlotGroup>
                      )
                    ))}
                  </ActivityList>
                  
                  <Footer>
                    Created with Weekendly • {getFormattedDate()}
                  </Footer>
                </PlanPreview>
              </PreviewContainer>
              
              <ShareOptions>
                <div>
                  <ShareTitle>Share with Link</ShareTitle>
                  <LinkContainer>
                    <LinkText 
                      value={shareLink}
                      readOnly
                      onClick={(e) => e.target.select()}
                    />
                    <Button
                      variant="outline"
                      size="small"
                      icon={<BiCopy />}
                      onClick={handleCopyLink}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </LinkContainer>
                </div>
                
                <div>
                  <ShareTitle>Share on Social Media</ShareTitle>
                  <SocialButtons>
                    <SocialButton bgColor="#1DA1F2">
                      <FaTwitter />
                    </SocialButton>
                    <SocialButton bgColor="#3b5998">
                      <FaFacebook />
                    </SocialButton>
                    <SocialButton bgColor="#E1306C">
                      <FaInstagram />
                    </SocialButton>
                    <SocialButton bgColor="#25D366">
                      <FaWhatsapp />
                    </SocialButton>
                  </SocialButtons>
                </div>
                
                <ActionButtons>
                  <Button
                    variant="outline"
                    icon={<BiDownload />}
                    fullWidth
                    onClick={handleDownload}
                  >
                    Download as Image
                  </Button>
                  <Button
                    variant="primary"
                    icon={<BiShareAlt />}
                    fullWidth
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `My ${selectedDay} Weekend Plan`,
                          text: `Check out my weekend plan created with Weekendly!`,
                          url: shareLink,
                        });
                      }
                    }}
                  >
                    Share Plan
                  </Button>
                </ActionButtons>
              </ShareOptions>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;