// This file is now correctly split into a Server Component Page
// and a Client Component View to handle Next.js 15's async params.
import { use } from 'react';
import UpdateMatchView from './UpdateMatchView';

// This is the Server Component Page.
// It correctly handles the `params` promise.
export default function UpdateMatchPage({ params }: { params: Promise<{ id: string }> }) {
  // We MUST use `React.use()` to unwrap the promise as per Next.js 15+ standards.
  const resolvedParams = use(params);
  
  return <UpdateMatchView matchId={resolvedParams.id} />;
}
