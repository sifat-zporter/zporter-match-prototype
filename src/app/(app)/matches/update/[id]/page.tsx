
// This is the Server Component Page that wraps the client component.
import UpdateMatchView from './UpdateMatchView';

export default function UpdateMatchPage({ params }: { params: { id: string } }) {
  return <UpdateMatchView matchId={params.id} />;
}
