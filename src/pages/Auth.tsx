import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const isResetPassword = location.pathname === '/auth/reset-password';

  console.log("Auth page: Current location state:", location.state);
  console.log("Auth page: Redirecting to:", from);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Check if user is admin
          const { data: adminProfile, error: adminError } = await supabase
            .from('admin_profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (adminError) {
            console.error("Error checking admin status:", adminError);
          }

          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: session.user.id,
              email: session.user.email,
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error("Error updating profile:", profileError);
          }

          // Redirect based on user role
          if (adminProfile?.is_admin) {
            console.log("Admin user detected, redirecting to admin dashboard");
            navigate("/admin");
          } else {
            console.log("Regular user, redirecting to:", from);
            navigate(from);
          }
          
          toast.success("Signed in successfully!");
        } catch (error) {
          console.error("Error in auth flow:", error);
          toast.error("An error occurred during sign in");
          navigate(from);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast.info("Signed out successfully");
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery event detected");
        toast.info("Please enter your new password below");
      } else if (event === 'USER_UPDATED') {
        console.log("User profile updated");
        toast.success("Profile updated successfully");
        navigate('/account');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, from]);

  const handleAuthError = (error: Error) => {
    console.error("Auth error:", error);
    if (error.message.includes('password')) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one number and one special character"
      );
    } else if (error.message.includes('email')) {
      toast.error("Please enter a valid email address");
    } else {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isResetPassword ? 'Reset your password' : 'Sign in to your account'}
        </h2>
        {!isResetPassword && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <span className="font-medium text-primary hover:text-primary/90">
              create a new account
            </span>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FDB813',
                    brandAccent: '#FDB813',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={window.location.origin + '/account'}
            localization={{
              variables: {
                sign_up: {
                  password_label: 'Password (min 8 characters, include numbers and special characters)',
                  email_label: 'Email address',
                  button_label: 'Create account',
                },
                sign_in: {
                  password_label: 'Your password',
                  email_label: 'Your email address',
                  button_label: 'Sign in',
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;