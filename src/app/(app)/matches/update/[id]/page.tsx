
// This is the Server Component Page that wraps the client component.
import UpdateMatchView from './UpdateMatchView';

// Making the page component async allows us to correctly handle the params promise.
export default async function UpdateMatchPage({ params }: { params: { id: string } }) {
  // Now we can safely access params.id and pass it to the client component.
  return <UpdateMatchView matchId={params.id} />;
}
