import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ActivityCard from '../planner/ActivityCard';
import SearchBar from '../ui/SearchBar';
import FilterTabs from '../ui/FilterTabs';
import EmptyState from '../ui/EmptyState';
import { theme } from '../../theme/theme';

const LibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;

const LibraryHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral.darkest};
  margin-bottom: ${theme.spacing.md};
`;

const SearchAndFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const LibraryFooter = styled.div`
  margin-top: ${theme.spacing.lg};
  display: flex;
  justify-content: center;
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${theme.colors.primary.main};
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    color: ${theme.colors.primary.dark};
    text-decoration: underline;
  }
`;

// Activity categories
const categories = [
  { id: 'all', label: 'All Activities' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'food', label: 'Food & Drinks' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'social', label: 'Social' },
  { id: 'productive', label: 'Productive' },
];

const ActivitiesLibrary = ({ activities, selectedDay, scheduleData, setScheduleData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [visibleActivities, setVisibleActivities] = useState(8);
  
  // Filter activities based on search and category
  useEffect(() => {
    let filtered = [...activities];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) || 
        activity.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredActivities(filtered);
  }, [activities, searchQuery, selectedCategory]);
  
  // Load more activities
  const handleLoadMore = () => {
    setVisibleActivities(prev => prev + 8);
  };
  
  // Check if an activity is already in the schedule
  const isActivityInSchedule = (activityId) => {
    return scheduleData[selectedDay].some(
      activity => activity.originalId === activityId
    );
  };

  return (
    <LibraryContainer>
      <LibraryHeader>
        <Title>Activity Library</Title>
        <SearchAndFilters>
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
          />
          <FilterTabs 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </SearchAndFilters>
      </LibraryHeader>
      
      {filteredActivities.length > 0 ? (
        <>
          <ActivitiesGrid>
            {filteredActivities.slice(0, visibleActivities).map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ActivityCard 
                  activity={activity}
                  inSchedule={false}
                  isInUse={isActivityInSchedule(activity.id)}
                  day={selectedDay}
                />
              </motion.div>
            ))}
          </ActivitiesGrid>
          
          {visibleActivities < filteredActivities.length && (
            <LibraryFooter>
              <LoadMoreButton onClick={handleLoadMore}>
                Load More Activities
              </LoadMoreButton>
            </LibraryFooter>
          )}
        </>
      ) : (
        <EmptyState 
          message="No activities found matching your search"
          icon="🔍"
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      )}
    </LibraryContainer>
  );
};

export default ActivitiesLibrary;