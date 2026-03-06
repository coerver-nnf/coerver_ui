export type ExerciseCategory =
  | "ball-mastery"
  | "1v1"
  | "receiving-turning"
  | "passing"
  | "finishing"
  | "speed";

export interface ExerciseCategoryInfo {
  id: ExerciseCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ExerciseSubcategoryInfo {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
}

export interface Exercise {
  id: string;
  category_id: ExerciseCategory;
  subcategory_id: string | null;
  title: string;
  description: string;
  video_url: string | null;
  thumbnail_url: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  equipment: string[];
  age_groups: string[];
  coaching_points: string[];
  variations: string[];
  order: number;
  created_at: string;
  subcategory?: ExerciseSubcategoryInfo | null;
}

export interface CoachExerciseAccess {
  coach_id: string;
  exercise_id: string;
  granted_at: string;
  granted_by: string;
}

export interface CoachCategoryAccess {
  coach_id: string;
  category_id: ExerciseCategory;
  granted_at: string;
  granted_by: string;
}

export const EXERCISE_CATEGORIES: ExerciseCategoryInfo[] = [
  {
    id: "ball-mastery",
    name: "Ball Mastery",
    description: "Potpuna kontrola lopte u svim situacijama kroz tisuće ponavljanja",
    icon: "ball",
    color: "from-coerver-green to-green-700",
  },
  {
    id: "1v1",
    name: "1v1 Potezi",
    description: "Repertoar poteza za nadmudriti bilo kojeg braniča",
    icon: "duel",
    color: "from-coerver-dark to-gray-800",
  },
  {
    id: "receiving-turning",
    name: "Primanje i Okretanje",
    description: "Tehnika primanja lopte i brzo okretanje prema golu",
    icon: "turn",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    id: "passing",
    name: "Dodavanje",
    description: "Preciznost i tehnika dodavanja na sve udaljenosti",
    icon: "pass",
    color: "from-coerver-green to-emerald-700",
  },
  {
    id: "finishing",
    name: "Završnica",
    description: "Preciznost i hladnokrvnost pred golom",
    icon: "goal",
    color: "from-gray-700 to-coerver-dark",
  },
  {
    id: "speed",
    name: "Brzina i Agilnost",
    description: "Eksplozivnost i promjena smjera specifična za nogomet",
    icon: "speed",
    color: "from-lime-600 to-green-700",
  },
];
