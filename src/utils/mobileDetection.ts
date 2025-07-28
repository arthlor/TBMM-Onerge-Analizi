import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet };
};

export const getChartHeight = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return 300;
  if (isTablet) return 350;
  return 400;
};

export const getChartFontSize = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return 8;
  if (isTablet) return 9;
  return 10;
}; 