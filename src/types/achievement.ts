export type AchievementCategory =
  | 'البداية'
  | 'الاستمرارية'
  | 'الإنجاز'
  | 'التحديات'
  | 'الكمال'
  | 'الاستكشاف';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number;
  currentProgress: number;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: string; // ISO date string
  isSecret?: boolean;
  hint?: string;
}

export interface AchievementStatsSummary {
  totalCount: number;
  unlockedCount: number;
  percentage: number;
  lastUnlocked: Achievement | null;
  featuredBadges: Achievement[];
}
