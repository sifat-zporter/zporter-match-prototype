import { CreateMatchTabs } from "@/components/create-match-tabs";

export default function CreateMatchPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-headline font-bold">Create Match</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <CreateMatchTabs />
        </div>
      </main>
    </div>
  );
}
