
import { CreateMatchLogForm } from "@/components/create-match-log-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateMatchLogPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/matches/log/select"><ChevronLeft className="w-5 h-5" /></Link>
                </Button>
                <h1 className="text-xl font-semibold">Create New Match to Log</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <CreateMatchLogForm />
            </main>
        </div>
    );
}
