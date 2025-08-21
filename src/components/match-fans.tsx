import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { players } from "@/lib/data";
import { PlayerListItem } from "./player-list-item";
import { Button } from "./ui/button";
import { Plus, ArrowUpDown, ListFilter } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function MatchFans() {
  const onlineFans = players; // Using mock player data for fans

  return (
    <div className="relative h-full">
      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
          <TabsTrigger value="online" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Online</TabsTrigger>
          <TabsTrigger value="live" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Live</TabsTrigger>
          <TabsTrigger value="arena" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">@Arena</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="pt-4">
          <div className="flex justify-between items-center px-4 mb-2">
            <p className="text-sm font-semibold text-primary">{onlineFans.length} Members</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
              <ListFilter className="w-4 h-4" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-1 p-2">
              {onlineFans.map((fan) => (
                <PlayerListItem key={fan.id} player={fan} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
         <TabsContent value="live">
           <p className="text-muted-foreground text-center p-8">Live fan interactions will appear here.</p>
        </TabsContent>
         <TabsContent value="arena">
           <p className="text-muted-foreground text-center p-8">Fans at the arena will be shown here.</p>
        </TabsContent>
      </Tabs>
       <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
}
