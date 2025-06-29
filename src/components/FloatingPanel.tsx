'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

const FloatingPanel: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`bg-dark-background relative z-10 ${className}`}
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </motion.div>
  )
}

export default FloatingPanel
