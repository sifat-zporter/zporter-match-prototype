import { CreateMatchForm } from "@/components/create-match-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateMatchPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-headline font-bold">Create Match</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
            <CardDescription>Fill out the form to create a new match for your team.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateMatchForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
