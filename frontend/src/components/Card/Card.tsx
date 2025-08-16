import React, { useState, useEffect } from 'react';

export interface CardProps {
  /**
   * The title to display
   */
  title?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Child components
   */
  children?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Card Component
 *
 * @param props - Component props
 * @returns JSX Element
 */
export const Card: React.FC<CardProps> = ({
  title = 'Card',
  className = '',
  children,
  onClick,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Component mounted
    console.log('Card component mounted');

    return () => {
      // Cleanup
      console.log('Card component unmounted');
    };
  }, []);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };

  return (
    <div
      className={className ? 'card ' + className : 'card'}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <h2 className="card__title">{title}</h2>
      <div className="card__content">
        {children || (
          <p>
            This is the Card component. Status:{' '}
            {isActive ? 'Active' : 'Inactive'}
          </p>
        )}
      </div>
      <div className="card__status">
        <span>Click to toggle: {isActive ? '✅' : '⭕'}</span>
      </div>
    </div>
  );
};

export default Card;
