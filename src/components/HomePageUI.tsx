'use client';

import { motion } from 'framer-motion';

export const AnimatedGradientBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-white">
    <motion.div
      className="absolute inset-0"
      animate={{
        backgroundImage: [
          "radial-gradient(circle at 10% 20%, rgba(136, 240, 201, 0.15), rgba(250, 250, 250, 0) 30%)",
          "radial-gradient(circle at 80% 30%, rgba(111, 196, 241, 0.15), rgba(250, 250, 250, 0) 35%)",
          "radial-gradient(circle at 50% 80%, rgba(136, 240, 201, 0.1), rgba(250, 250, 250, 0) 40%)",
          "radial-gradient(circle at 10% 20%, rgba(136, 240, 201, 0.15), rgba(250, 250, 250, 0) 30%)",
        ],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  </div>
);

export const FloatingPacket = () => (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center -z-10"
      style={{ perspective: 800 }}
    >
      <motion.div
        animate={{ rotateY: [0, 360], rotateX: [0, 20, 0] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="w-[300px] h-[400px] md:w-[400px] md:h-[550px] relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-white/50 shadow-2xl shadow-black/10 backdrop-blur-md border border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#88F0C9]/30 to-[#6FC4F1]/30" />
          <div className="p-8 h-full flex flex-col">
            <h3 className="text-xl font-bold text-brand-black/80">SupplementScribe</h3>
            <p className="text-sm text-brand-black/60">Your Daily Dose</p>
            <div className="flex-1" />
            <p className="font-mono text-xs text-brand-black/50">JOHN DOE / PLAN ID: 771-B1</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
); 