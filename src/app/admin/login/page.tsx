import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  // Directly redirect to the unified TutorAstra login page (/login)
  // as requested by client to ensure the old card never appears after logout.
  redirect('/login');
}
