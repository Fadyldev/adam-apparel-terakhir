import {
  Award,
  Briefcase,
  Flame,
  Layers,
  Shirt,
  Trophy,
  Scissors,
  Sparkles,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import type { IconKey } from '@/lib/schema';

export const CATALOG_ICONS: Record<IconKey, LucideIcon> = {
  shirt: Shirt,
  briefcase: Briefcase,
  award: Award,
  flame: Flame,
  trophy: Trophy,
  layers: Layers,
  jubah: Crown,
  koko: Shirt,
  gamis: Sparkles,
  khimar: Award,
  pdh: Briefcase,
  kaos: Shirt,
  jaket: Flame,
  custom: Scissors,
};
