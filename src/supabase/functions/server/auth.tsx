// Authentication helpers for Vendoura
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

export interface AuthUser {
  id: string;
  email: string;
  role: 'founder' | 'admin';
}

// Verify access token and return user
export async function verifyAuth(authHeader: string | null): Promise<AuthUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'founder'
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

// Admin-only verification
export async function verifyAdmin(authHeader: string | null): Promise<AuthUser | null> {
  const user = await verifyAuth(authHeader);
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}
