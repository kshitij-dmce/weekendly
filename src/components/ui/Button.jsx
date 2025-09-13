import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../theme/theme';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.typography.fontFamily};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  border: none;
  outline: none;
  
  ${props => props.variant === 'primary' && css`
    background-color: ${theme.colors.primary.main};
    color: ${theme.colors.neutral.white};
    
    &:hover {
      background-color: ${theme.colors.primary.dark};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: ${theme.colors.secondary.main};
    color: ${theme.colors.neutral.white};
    
    &:hover {
      background-color: ${theme.colors.secondary.dark};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: ${theme.colors.primary.main};
    border: 2px solid ${theme.colors.primary.main};
    
    &:hover {
      background-color: ${theme.colors.primary.light}20;
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: ${theme.colors.primary.main};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    
    &:hover {
      background-color: ${theme.colors.primary.light}10;
    }
  `}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.size === 'small' && css`
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: 0.8rem;
  `}
  
  ${props => props.size === 'large' && css`
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: 1rem;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'start',
  disabled = false,
  onClick,
  ...rest
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && iconPosition === 'start' && <span className="button-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'end' && <span className="button-icon">{icon}</span>}
    </StyledButton>
  );
};

export default Button;