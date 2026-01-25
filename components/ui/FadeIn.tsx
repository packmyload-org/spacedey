"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  amount?: number | "some" | "all";
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  amount = 0.2, // Trigger when 20% of the element is visible
  className,
  style,
  ...props
}: FadeInProps) {
  const getVariants = () => {
    const hidden: any = { opacity: 0 };
    const visible: any = { opacity: 1 };

    switch (direction) {
      case "up":
        hidden.y = 40;
        visible.y = 0;
        break;
      case "down":
        hidden.y = -40;
        visible.y = 0;
        break;
      case "left":
        hidden.x = 40;
        visible.x = 0;
        break;
      case "right":
        hidden.x = -40;
        visible.x = 0;
        break;
      case "none":
      default:
        break;
    }

    return {
      hidden,
      visible: {
        ...visible,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={getVariants()}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
