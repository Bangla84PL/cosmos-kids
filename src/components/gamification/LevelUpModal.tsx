'use client';

import { calculateLevel, getRankName } from '@/lib/gamification/xp';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldXp: number;
  newXp: number;
  childName: string;
}

export default function LevelUpModal({ isOpen, onClose, oldXp, newXp, childName }: LevelUpModalProps) {
  const oldLevel = calculateLevel(oldXp);
  const newLevel = calculateLevel(newXp);
  const didLevelUp = newLevel > oldLevel;
  const newRank = getRankName(newLevel);

  if (!isOpen || !didLevelUp) {
    return null;
  }

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 max-w-md w-full">
        <button onClick={onClose} className="float-right text-gray-500">✕</button>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Level Up!</h2>
          <p className="text-xl mb-4">
            Congratulations, {childName}!
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-400">{oldLevel}</div>
              <div className="text-sm">Previous</div>
            </div>
            <div className="text-3xl">→</div>
            <div>
              <div className="text-5xl font-bold text-green-500">{newLevel}</div>
              <div className="text-sm">New Level!</div>
            </div>
          </div>
          <div className="mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
              {newRank}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Keep Learning!
          </button>
        </div>
      </div>
    </div>
  );
}
