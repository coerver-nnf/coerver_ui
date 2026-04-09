import { Profile } from "./index";

export interface PartnerClub {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
  coach_count?: number;
}

export interface ClubCoach {
  id: string;
  club_id: string;
  coach_id: string;
  role: "member" | "head_coach";
  joined_at: string;
  added_by: string | null;
  coach?: Profile;
  club?: PartnerClub;
}

export interface ClubCategoryAccess {
  id: string;
  club_id: string;
  category_id: string;
  granted_at: string;
  granted_by: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ClubSubcategoryAccess {
  id: string;
  club_id: string;
  subcategory_id: string;
  granted_at: string;
  granted_by: string | null;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category_id: string;
  };
}

export interface ClubExerciseAccess {
  id: string;
  club_id: string;
  exercise_id: string;
  granted_at: string;
  granted_by: string | null;
  exercise?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CoachSubcategoryAccess {
  id: string;
  coach_id: string;
  subcategory_id: string;
  access_type: "grant" | "deny";
  granted_at: string;
  granted_by: string | null;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category_id: string;
  };
}

export type CreateClubInput = {
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  website?: string;
  status?: "active" | "inactive" | "pending";
};

export type UpdateClubInput = Partial<CreateClubInput> & {
  id: string;
};
