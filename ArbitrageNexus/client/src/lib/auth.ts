import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscription?: string;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  
  if (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    throw error;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!
        });
      }
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch additional user data from profiles
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, subscription_tier')
          .eq('id', session.user.id)
          .single();
          
        setUser({
          id: session.user.id,
          email: session.user.email!,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          subscription: profile?.subscription_tier
        });
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: `Signed in as ${session.user.email}`
          });
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "Successfully signed out of your account"
          });
        }
      }
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, loading };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(location)}`);
    }
  }, [user, loading, location]);
  
  return { user, loading };
}