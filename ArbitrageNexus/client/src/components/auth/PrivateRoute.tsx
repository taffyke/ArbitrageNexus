import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path?: string;
}

export function PrivateRoute({ component: Component, ...rest }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // If still checking auth state, show a loading indicator
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }

  // If authenticated, render the component
  return <Component {...rest} />;
} 