
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function ChooseMatchToLogPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
                </Button>
                <h1 className="text-xl font-semibold">Choose or Create new Match</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground px-2">Friendly</p>
                    <Link href="/matches/1/log" className="block w-full text-left">
                        <div className="bg-card p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                           <div className="flex items-start">
                                <div className="flex flex-col items-center justify-center w-12 text-sm text-muted-foreground">
                                    <span>17/12</span>
                                    <span className="font-medium text-foreground">10:00</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2 text-sm pl-2">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-base">Maj BP-U15</span>
                                        <span className="font-bold text-base ml-auto">1</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-bold text-base">FC Barcelona - U15</span>
                                        <span className="font-bold text-base ml-auto">1</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground self-center ml-2" />
                           </div>
                           <div className="text-xs text-muted-foreground mt-2 pl-14">
                               <p>#nicjon680305</p>
                               <p>Norrvikens IP, 1</p>
                           </div>
                        </div>
                    </Link>
                </div>
            </main>
            <footer className="p-4 border-t border-border">
                <Button className="w-full" asChild>
                    <Link href="/matches/log/create">Create new Match to Log</Link>
                </Button>
            </footer>
        </div>
    );
}
