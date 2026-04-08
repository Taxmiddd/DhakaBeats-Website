"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CursorGradient() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag effect
  const springConfig = { damping: 50, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(234, 0, 0, 0.08), transparent 80%)`,
      } as any}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          "--x": smoothX.toString() + "px",
          "--y": smoothY.toString() + "px",
        } as any}
      />
    </motion.div>
  );
}
