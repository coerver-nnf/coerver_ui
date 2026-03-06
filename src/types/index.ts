export type UserRole = "player" | "coach" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  approved: boolean;
  is_approved: boolean; // Computed field, same as approved
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string;
  category_id: string | null;
  published: boolean;
  created_at: string;
  author?: Profile;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  approved: boolean;
  created_at: string;
  user?: Profile;
}

export interface Academy {
  id: string;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  schedule: string;
  pricing: string;
  description: string;
}

export interface Camp {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  pricing: string;
  description: string;
  capacity: number;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  curriculum: string;
  prerequisites: string | null;
  pricing: string;
}

export interface Inquiry {
  id: string;
  type: "academy" | "camp" | "course" | "club" | "individual" | "general";
  name: string;
  email: string;
  phone: string | null;
  message: string;
  program_id: string | null;
  created_at: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface PlayerProgress {
  user_id: string;
  content_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Booking {
  id: string;
  user_id: string;
  session_type: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  type: "video" | "pdf" | "document";
  file_url: string;
  order: number;
}

export interface CoachProgress {
  user_id: string;
  course_id: string;
  status: "enrolled" | "in_progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}
