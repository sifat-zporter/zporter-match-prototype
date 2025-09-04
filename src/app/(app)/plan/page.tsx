import { PlanTabMockup } from "@/components/plan-tab-mockup";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function PlanTabPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Plan Tab Mockup</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <PlanTabMockup />
      </main>
    </div>
  );
}
