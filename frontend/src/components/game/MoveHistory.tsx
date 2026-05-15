import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { buildMovePairs } from '../../lib/moveNotation';

interface MoveHistoryProps {
  notations: string[];
  darkMode?: boolean;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ notations, darkMode = true }) => {
  const pairs = buildMovePairs(notations);

  return (
    <GlassCard className="p-4 max-h-40 overflow-y-auto">
      <h4 className={`text-sm font-bold mb-2 ${darkMode ? 'text-neon-purple' : 'text-gray-800'}`}>
        Move history
      </h4>
      {pairs.length === 0 ? (
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          No moves yet
        </p>
      ) : (
        <table className="w-full text-xs font-mono">
          <tbody>
            {pairs.map((line) => (
              <motion.tr
                key={line.num}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={darkMode ? 'text-gray-300' : 'text-gray-700'}
              >
                <td className="pr-2 text-neon-cyan/80 w-8">{line.num}.</td>
                <td className="pr-3 w-[42%]">{line.white ?? ''}</td>
                <td>{line.black ?? ''}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </GlassCard>
  );
};

export default MoveHistory;
