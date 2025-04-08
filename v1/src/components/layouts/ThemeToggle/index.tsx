'use client';

import Image from 'next/image';
import styles from './themeToggle.module.css';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeToggle must be used within a ThemeContextProvider');
  }

  const { toggle, theme } = context;

  return (
    <div
      className={styles.container}
      onClick={toggle}
      style={{
        backgroundColor: theme === 'dark' ? 'white' : '#0f172a',
      }}
    >
      <Image src="/moon.png" alt="Moon icon" width={14} height={14} />
      <div
        className={styles.ball}
        style={
          theme === 'dark'
            ? { left: 1, background: '#0f172a' }
            : { right: 1, background: 'white' }
        }
      ></div>
      <Image src="/sun.png" alt="Sun icon" width={14} height={14} />
    </div>
  );
};

export default ThemeToggle;
