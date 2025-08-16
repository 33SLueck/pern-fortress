import React, { useState, useEffect } from 'react';

export interface ButtonProps {
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
 * Button Component
 *
 * @param props - Component props
 * @returns JSX Element
 */
export const Button: React.FC<ButtonProps> = ({
  title = 'Button',
  className = '',
  children,
  onClick,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Component mounted
    console.log('Button component mounted');

    return () => {
      // Cleanup
      console.log('Button component unmounted');
    };
  }, []);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };

  return (
    <div
      className={className ? 'button ' + className : 'button'}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <h2 className="button__title">{title}</h2>
      <div className="button__content">
        {children || (
          <p>
            This is the Button component. Status:{' '}
            {isActive ? 'Active' : 'Inactive'}
          </p>
        )}
      </div>
      <div className="button__status">
        <span>Click to toggle: {isActive ? '✅' : '⭕'}</span>
      </div>
    </div>
  );
};

export default Button;
