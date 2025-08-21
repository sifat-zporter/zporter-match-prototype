
"use client"

import type { Cup } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import { CupMatchCard } from "./cup-match-card";

interface CupMatchesListProps {
  cups: Cup[];
}

export function CupMatchesList({ cups }: CupMatchesListProps) {
  const followingCups = cups.slice(0, 2);
  const mostPopularCups = cups.slice(2);

  return (
    <div className="space-y-4">
      {followingCups.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
          <Accordion type="multiple" defaultValue={followingCups.map(c => c.id)} className="w-full space-y-2">
            {followingCups.map((cup) => (
              <AccordionItem key={cup.id} value={cup.id} className="border-none">
                 <AccordionTrigger className="p-2 bg-card rounded-t-lg hover:no-underline hover:bg-accent data-[state=closed]:rounded-b-lg">
                    <div className="flex items-center gap-2 w-full">
                        <Image src={cup.logoUrl} alt={cup.name} width={24} height={24} className="rounded-full" data-ai-hint="league logo" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <h3 className="font-semibold text-sm">{cup.name}</h3>
                        <p className="text-xs text-muted-foreground ml-auto">{cup.metadata}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="bg-card rounded-b-lg p-0">
                  <div className="space-y-1 p-2">
                    {cup.matches.map((match) => (
                      <CupMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

       {mostPopularCups.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Most Popular</h2>
          <Accordion type="multiple" defaultValue={[mostPopularCups[0].id]} className="w-full space-y-2">
            {mostPopularCups.map((cup) => (
              <AccordionItem key={cup.id} value={cup.id} className="border-none">
                 <AccordionTrigger className="p-2 bg-card rounded-lg hover:no-underline hover:bg-accent">
                    <div className="flex items-center gap-2 w-full">
                        <Image src={cup.logoUrl} alt={cup.name} width={24} height={24} className="rounded-full" data-ai-hint="league logo" />
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">{cup.name}</h3>
                        <p className="text-xs text-muted-foreground ml-auto">{cup.metadata}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="bg-card rounded-b-lg p-0">
                  <div className="space-y-1 p-2">
                    {cup.matches.map((match) => (
                      <CupMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {cups.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No cup matches for this day.</p>
          </div>
      )}
    </div>
  );
}
