import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FootballPitchIcon } from "@/components/icons";
import { UserCircle } from "lucide-react";

const PlayerList = ({ title, players }: { title: string, players: string[] }) => (
  <div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {players.map(player => (
        <li key={player} className="flex items-center gap-2">
          <UserCircle className="w-4 h-4" />
          {player}
        </li>
      ))}
    </ul>
  </div>
);

export function MatchLineups() {
  const homeStarters = ["GK: A. Becker", "DF: T. Alexander-Arnold", "DF: V. van Dijk", "MF: Fabinho", "FW: M. Salah"];
  const awayStarters = ["GK: E. Mendy", "DF: R. James", "DF: T. Silva", "MF: N. Kanté", "FW: R. Lukaku"];
  const substitutes = ["Player 1", "Player 2", "Player 3"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lineups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-center font-bold font-headline text-lg mb-4">Starting XI</h3>
          <div className="relative text-foreground/80">
            <FootballPitchIcon className="w-full h-auto" />
            {/* Mock player positions - in a real app these would be dynamic */}
            <div className="absolute top-[45%] left-[8%]" title={homeStarters[0]}>GK</div>
            <div className="absolute top-[20%] left-[20%]" title={homeStarters[1]}>DF</div>
            <div className="absolute top-[70%] left-[20%]" title={homeStarters[2]}>DF</div>
            <div className="absolute top-[45%] left-[35%]" title={homeStarters[3]}>MF</div>
            <div className="absolute top-[45%] left-[48%]" title={homeStarters[4]}>FW</div>
            
            <div className="absolute top-[45%] right-[8%]" title={awayStarters[0]}>GK</div>
            <div className="absolute top-[20%] right-[20%]" title={awayStarters[1]}>DF</div>
            <div className="absolute top-[70%] right-[20%]" title={awayStarters[2]}>DF</div>
            <div className="absolute top-[45%] right-[35%]" title={awayStarters[3]}>MF</div>
            <div className="absolute top-[45%] right-[48%]" title={awayStarters[4]}>FW</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PlayerList title="Substitutes (Home)" players={substitutes} />
          <PlayerList title="Substitutes (Away)" players={substitutes} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
            <h4 className="font-semibold mb-2">Coach</h4>
             <p className="text-sm text-muted-foreground flex items-center gap-2"><UserCircle className="w-4 h-4" /> J. Klopp</p>
           </div>
           <div>
            <h4 className="font-semibold mb-2">Coach</h4>
             <p className="text-sm text-muted-foreground flex items-center gap-2"><UserCircle className="w-4 h-4" /> T. Tuchel</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
