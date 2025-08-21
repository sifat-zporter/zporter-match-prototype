import type { Player } from "@/lib/data";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PlayerListItemProps {
  player: Player;
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  return (
    <Link href="#" className="block">
      <div className="flex items-center p-2 rounded-md hover:bg-accent">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm w-4 text-center">{player.number}</span>
          <Image src={player.avatarUrl} alt={player.name} width={48} height={48} className="rounded-md" data-ai-hint="player avatar" />
          <div className="grid grid-cols-2 items-center text-xs gap-x-3 gap-y-1">
            <p className="font-semibold col-span-2 text-sm">{player.name}</p>
            <p className="text-muted-foreground">{player.zporterId}</p>
            <p className="text-foreground">{player.role}</p>
            <p className="text-muted-foreground">{player.location}</p>
            <p className="text-foreground">{player.team}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
      </div>
    </Link>
  );
}
