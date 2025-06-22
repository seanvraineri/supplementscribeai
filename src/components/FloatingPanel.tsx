'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

const FloatingPanel: React.FC<Props> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Using a more elegant ease-out curve
      viewport={{ once: true, amount: 0.1 }} // Trigger animation when 10% of the element is visible
    >
      {children}
    </motion.div>
  )
}

export default FloatingPanel
