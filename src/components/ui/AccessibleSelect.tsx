import React, { forwardRef } from 'react';
import '../../../src/styles/accessibleSelect.css';

export interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Required label text for accessibility */
  label: string;
  /** Optional ID for the select element. If not provided, one will be generated */
  id?: string;
  /** Optional description for additional context */
  description?: string;
  /** Whether to visually hide the label (still accessible to screen readers) */
  hideLabel?: boolean;
}

/**
 * AccessibleSelect - A fully accessible select component
 * 
 * This component ensures proper accessibility by:
 * - Providing a visible or visually-hidden label (still accessible to screen readers)
 * - Using proper ARIA attributes
 * - Including a title attribute
 * - Supporting keyboard navigation
 */
export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ 
    label, 
    id, 
    description, 
    hideLabel = false, 
    children, 
    className,
    ...props 
  }, ref) => {
    // Generate unique IDs for accessibility
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
    const descriptionId = description ? `${selectId}-desc` : undefined;
    
    return (
      <div className="accessible-select-container">
        <label
          htmlFor={selectId}
          className={hideLabel ? "sr-only" : "accessible-select-label"}
        >
          {label}
        </label>
        
        {description && (
          <div id={descriptionId} className="select-description">
            {description}
          </div>
        )}
        
        <select
          ref={ref}
          id={selectId}
          name={props.name || selectId}
          className={className}
          title={label}
          aria-label={label}
          aria-describedby={descriptionId}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

// Add display name for better debugging
AccessibleSelect.displayName = 'AccessibleSelect';