import React from 'react';
import { motion } from 'framer-motion';

/**
 * Particle Background Component
 * Creates an animated particle system in the background for immersive gaming feel
 */
const ParticleBackground: React.FC = () => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-gaming-dark via-gaming-darker to-black">
            {/* Gradient overlays */}
            <div className="absolute inset-0 opacity-30 mix-blend-screen">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan rounded-full blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-pink rounded-full blur-3xl opacity-20" />
            </div>

            {/* Animated particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-neon-cyan"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        opacity: 0.5,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(0deg,transparent_24%,rgba(0,217,255,0.05)_25%,rgba(0,217,255,0.05)_26%,transparent_27%,transparent_74%,rgba(0,217,255,0.05)_75%,rgba(0,217,255,0.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,217,255,0.05)_25%,rgba(0,217,255,0.05)_26%,transparent_27%,transparent_74%,rgba(0,217,255,0.05)_75%,rgba(0,217,255,0.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
        </div>
    );
};

export default ParticleBackground;
