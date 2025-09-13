import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/constants';
import ActivityCard from './ActivityCard';
import EmptyState from '../ui/EmptyState';
import TimeIndicator from './TimeIndicator';
import ShareModal from '../modals/ShareModal';
import Button from '../ui/Button';
import { BiExport, BiShare } from 'react-icons/bi';
import { exportAsImage } from '../../utils/exportUtils';
import { theme } from '../../theme/theme';

const PlannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.neutral.lightest};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;

const PlannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const DayTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.neutral.darkest};
  margin: 0;
  text-transform: capitalize;
  
  span {
    color: ${props => props.day === 'saturday' ? theme.colors.primary.main : theme.colors.secondary.main};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
  position: relative;
  padding: ${theme.spacing.md} 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 120px;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: ${props => 
      props.day === 'saturday' ? theme.colors.primary.light : theme.colors.secondary.light};
    border-radius: 4px;
    
    @media (max-width: ${theme.breakpoints.md}) {
      left: 90px;
    }
  }
`;

const TimeSlot = styled.div`
  display: flex;
  align-items: flex-start;
  min-height: 80px;
`;

const TimeLabel = styled.div`
  width: 100px;
  padding-right: ${theme.spacing.md};
  text-align: right;
  font-weight: 600;
  color: ${theme.colors.neutral.dark};
  padding-top: 8px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 80px;
    font-size: 0.9rem;
  }
`;

const DropZone = styled.div`
  flex: 1;
  min-height: 80px;
  padding-left: ${theme.spacing.xl};
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  position: relative;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding-left: ${theme.spacing.lg};
  }
`;

const TimeSlotIndicator = styled.div`
  position: absolute;
  left: -13px;
  top: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => 
    props.isEmpty ? theme.colors.neutral.medium : 
    props.day === 'saturday' ? theme.colors.primary.main : theme.colors.secondary.main};
  z-index: 1;
  
  @media (max-width: ${theme.breakpoints.md}) {
    left: -12px;
    width: 20px;
    height: 20px;
  }
`;

const timeSlots = [
  { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 8:00 PM' },
  { id: 'night', label: 'Night', time: '8:00 PM - 11:00 PM' },
];

const WeekendPlanner = ({ selectedDay, scheduleData, setScheduleData }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const plannerRef = React.useRef(null);
  
  // Handle activity drop into a time slot
  const handleDrop = (item, timeSlotId) => {
    if (item.type === ItemTypes.ACTIVITY) {
      const currentDayActivities = [...scheduleData[selectedDay]];
      const newActivity = {
        ...item.activity,
        id: `${item.activity.id}-${Date.now()}`, // Create unique ID
        timeSlot: timeSlotId
      };
      
      setScheduleData({
        ...scheduleData,
        [selectedDay]: [...currentDayActivities, newActivity]
      });
      
      return true; // Accept the drop
    }
    return false;
  };
  
  // Remove activity from schedule
  const removeActivity = (activityId) => {
    const updatedActivities = scheduleData[selectedDay].filter(
      activity => activity.id !== activityId
    );
    
    setScheduleData({
      ...scheduleData,
      [selectedDay]: updatedActivities
    });
  };
  
  // Share weekend plan
  const handleShare = () => {
    setShareModalOpen(true);
  };
  
  // Export as image
  const handleExport = () => {
    exportAsImage(plannerRef.current, `weekendly-${selectedDay}-plan`);
  };

  return (
    <PlannerContainer ref={plannerRef}>
      <PlannerHeader>
        <DayTitle day={selectedDay}>
          <span>{selectedDay}</span> Plan
        </DayTitle>
        <ActionButtons>
          <Button 
            variant="outline" 
            icon={<BiExport />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            icon={<BiShare />}
            onClick={handleShare}
          >
            Share
          </Button>
        </ActionButtons>
      </PlannerHeader>
      
      <Timeline day={selectedDay}>
        {timeSlots.map((slot) => {
          // Get activities for this time slot
          const slotActivities = scheduleData[selectedDay].filter(
            activity => activity.timeSlot === slot.id
          );
          
          // Setup drop target
          const [{ isOver, canDrop }, drop] = useDrop({
            accept: ItemTypes.ACTIVITY,
            drop: (item) => handleDrop(item, slot.id),
            collect: (monitor) => ({
              isOver: !!monitor.isOver(),
              canDrop: !!monitor.canDrop(),
            }),
          });
          
          return (
            <TimeSlot key={slot.id}>
              <TimeLabel>{slot.label}</TimeLabel>
              <DropZone ref={drop} style={{ 
                backgroundColor: isOver && canDrop ? `${theme.colors.primary.light}20` : 'transparent',
                transition: theme.transitions.default
              }}>
                <TimeSlotIndicator 
                  day={selectedDay} 
                  isEmpty={slotActivities.length === 0} 
                />
                
                {slotActivities.length > 0 ? (
                  <AnimatePresence>
                    {slotActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ActivityCard 
                          activity={activity}
                          onRemove={() => removeActivity(activity.id)}
                          inSchedule={true}
                          day={selectedDay}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  isOver ? null : (
                    <EmptyState 
                      message={`Drag activities here for ${slot.label} (${slot.time})`}
                      icon="👆"
                      size="small"
                    />
                  )
                )}
              </DropZone>
            </TimeSlot>
          );
        })}
        
        <TimeIndicator day={selectedDay} />
      </Timeline>
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        scheduleData={scheduleData}
        selectedDay={selectedDay}
      />
    </PlannerContainer>
  );
};

export default WeekendPlanner;