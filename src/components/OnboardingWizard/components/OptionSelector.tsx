import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './OptionSelector.module.css';

export interface Option {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  description?: string;
}

interface OptionSelectorProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3;
  size?: 'small' | 'medium' | 'large';
  showIcons?: boolean;
}

export function OptionSelector({
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  size = 'medium',
  showIcons = true
}: OptionSelectorProps) {
  const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);

  const handleClick = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div 
      className={`${styles.optionGrid} ${styles[`columns${columns}`]} ${styles[size]}`}
      role="group"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleClick(option.value)}
          className={`${styles.option} ${
            selectedValues.includes(option.value) ? styles.selected : ''
          }`}
          aria-pressed={selectedValues.includes(option.value)}
        >
          {showIcons && option.icon && (
            <div className={styles.iconWrapper}>
              {typeof option.icon === 'string' ? (
                <span className={styles.emoji}>{option.icon}</span>
              ) : (
                option.icon
              )}
            </div>
          )}
          <div className={styles.textContent}>
            <span className={styles.label}>
              <Translate id={option.label}>{option.label}</Translate>
            </span>
            {option.description && (
              <span className={styles.description}>
                <Translate id={option.description}>{option.description}</Translate>
              </span>
            )}
          </div>
          {multiple && (
            <div className={styles.checkbox}>
              <span className={styles.checkmark}>✓</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}