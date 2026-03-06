"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    },
    [supabase]
  );

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { error };
      }

      return { data };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      role: UserRole,
      fullName: string,
      phone?: string
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { error };
      }

      return { data };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signOut();

    if (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { error };
    }

    setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: null,
    });

    return {};
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      return {};
    },
    [supabase]
  );

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!state.user,
    isApproved: state.profile?.approved ?? false,
    role: state.profile?.role ?? null,
  };
}
