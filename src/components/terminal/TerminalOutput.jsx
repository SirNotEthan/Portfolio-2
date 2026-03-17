import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function TerminalOutput({
  children,
  delay = 600,
  animate = true,
  className = ''
}) {
  const [show, setShow] = useState(!animate);
  const ref = useRef(null);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setShow(true), delay);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate, delay]);

  return (
    <div ref={ref} className={className}>
      {show ? (
        <MotionDiv
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </MotionDiv>
      ) : (
        <div className="h-8" />
      )}
    </div>
  );
}
