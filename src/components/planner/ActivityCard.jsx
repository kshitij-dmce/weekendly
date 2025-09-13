import React from 'react';
import styled, { css } from 'styled-components';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { ItemTypes } from '../../utils/constants';
import { BiTrash, BiCopy, BiTime, BiTag } from 'react-icons/bi';
import { theme } from '../../theme/theme';
import IconButton from '../ui/IconButton';

const Card = styled.div`
  position: relative;
  width: 100%;
  background-color: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: ${theme.transitions.default};
  cursor: ${props => (props.isInUse || props.inSchedule) ? 'default' : 'grab'};
  opacity: ${props => props.isInUse ? 0.7 : 1};
  
  ${props => props.isDragging && css`
    opacity: 0.5;
    box-shadow: none;
  `}
  
  ${props => !props.isInUse && !props.inSchedule && css`
    &:hover {
      transform: translateY(-5px);
      box-shadow: ${theme.shadows.md};
    }
  `}
  
  ${props => props.inSchedule && css`
    border-left: 4px solid ${
      props.day === 'saturday' ? theme.colors.primary.main : theme.colors.secondary.main
    };
  `}
`;

const ColorBanner = styled.div`
  height: 4px;
  background-color: ${props => {
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
`;

const CardContent = styled.div`
  padding: ${theme.spacing.md};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.neutral.darkest};
  margin: 0;
  padding-right: ${theme.spacing.md};
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.neutral.dark};
  margin: ${theme.spacing.xs} 0 ${theme.spacing.md} 0;
  line-height: 1.4;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: 0.8rem;
  color: ${theme.colors.neutral.dark};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background-color: ${theme.colors.neutral.lightest};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
`;

const IconWrapper = styled.span`
  color: ${props => props.color || theme.colors.primary.main};
  display: flex;
  align-items: center;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  display: flex;
  gap: ${theme.spacing.xs};
`;

const InUseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.neutral.darkest}10;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const InUseText = styled.span`
  background-color: ${theme.colors.neutral.white}CC;
  color: ${theme.colors.neutral.dark};
  font-size: 0.8rem;
  font-weight: 600;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
`;

const ActivityCard = ({ 
  activity, 
  onRemove, 
  inSchedule = false, 
  isInUse = false,
  day = 'saturday'
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { 
      type: ItemTypes.ACTIVITY, 
      activity: {
        ...activity,
        originalId: activity.id // Keep track of original ID
      }
    },
    canDrag: !isInUse && !inSchedule,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  
  // Calculate card duration (for schedule cards)
  const getDuration = () => {
    return activity.duration || '1-2 hours';
  };
  
  return (
    <Card 
      ref={inSchedule ? null : drag}
      isDragging={isDragging}
      isInUse={isInUse}
      inSchedule={inSchedule}
      day={day}
    >
      <ColorBanner category={activity.category} />
      <CardContent>
        <CardHeader>
          <Title>{activity.title}</Title>
        </CardHeader>
        
        <Description>
          {activity.description}
        </Description>
        
        <MetaInfo>
          <MetaItem>
            <IconWrapper>
              <BiTime />
            </IconWrapper>
            {getDuration()}
          </MetaItem>
          
          <MetaItem>
            <IconWrapper color={
              activity.category === 'outdoors' ? theme.colors.accent.green : 
              activity.category === 'food' ? theme.colors.accent.yellow : 
              activity.category === 'entertainment' ? theme.colors.accent.purple : 
              activity.category === 'relaxation' ? theme.colors.primary.light :
              activity.category === 'social' ? theme.colors.secondary.light :
              theme.colors.primary.dark
            }>
              <BiTag />
            </IconWrapper>
            {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
          </MetaItem>
          
          {activity.mood && (
            <MetaItem>
              {activity.mood === 'energetic' ? '⚡️' : 
               activity.mood === 'relaxed' ? '😌' : 
               activity.mood === 'social' ? '👯‍♂️' : 
               activity.mood === 'creative' ? '🎨' : '😊'}
              {activity.mood.charAt(0).toUpperCase() + activity.mood.slice(1)}
            </MetaItem>
          )}
        </MetaInfo>
      </CardContent>
      
      {inSchedule && onRemove && (
        <ActionButtons>
          <IconButton 
            icon={<BiTrash />}
            variant="danger"
            onClick={onRemove}
            tooltip="Remove activity"
          />
        </ActionButtons>
      )}
      
      {isInUse && (
        <InUseOverlay>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <InUseText>Already in schedule</InUseText>
          </motion.div>
        </InUseOverlay>
      )}
    </Card>
  );
};

export default ActivityCard;