
"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Heart, MessageCircle, Bookmark, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Separator } from "./ui/separator";

const NumberInput = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="relative bg-card border border-input rounded-md w-24 h-12 flex items-center justify-center">
      <span className="text-xl font-semibold">{value}</span>
      <div className="absolute right-2 flex flex-col items-center">
        <button onClick={() => setValue(v => v + 1)} className="h-5 w-5"><ChevronUp className="w-4 h-4 text-muted-foreground" /></button>
        <button onClick={() => setValue(v => Math.max(0, v - 1))} className="h-5 w-5"><ChevronDown className="w-4 h-4 text-muted-foreground" /></button>
      </div>
    </div>
  );
};


const NewsCard = ({ title, content, imageUrl, category }: { title: string, content: string, imageUrl: string, category: string }) => (
  <Card className="overflow-hidden">
    <div className="relative">
      <Image src={imageUrl} alt={title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint="football player" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-xs text-white/80 uppercase">{category}</p>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
    </div>
    <CardContent className="p-4">
      <p className="text-muted-foreground text-sm mb-4">{content}</p>
      <div className="flex items-center gap-4 text-muted-foreground">
        <Button variant="ghost" size="icon" className="h-8 w-8"><Heart className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><MessageCircle className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto"><Bookmark className="w-5 h-5" /></Button>
      </div>
    </CardContent>
  </Card>
);

export function MatchFeed() {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    return (
        <div className="space-y-6 py-4">
            <Card>
                <CardContent className="p-4 space-y-6">
                    {/* Who will win? */}
                    <div className="space-y-3 text-center">
                        <h4 className="font-semibold text-sm">Who will win?</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant={activeButton === 'home' ? 'default' : 'outline'} onClick={() => setActiveButton('home')}>Home</Button>
                            <Button variant={activeButton === 'draw' ? 'default' : 'outline'} onClick={() => setActiveButton('draw')}>Draw</Button>
                            <Button variant={activeButton === 'away' ? 'default' : 'outline'} onClick={() => setActiveButton('away')}>Away</Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Match result */}
                    <div className="space-y-3 text-center">
                        <h4 className="font-semibold text-sm">What will the match result be?</h4>
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Home</p>
                                <NumberInput />
                            </div>
                            <span className="text-2xl font-bold mt-4">:</span>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Away</p>
                                <NumberInput />
                            </div>
                        </div>
                    </div>
                    
                    <Separator />

                    {/* Predicted line ups */}
                    <div className="space-y-3 text-center">
                        <h4 className="font-semibold text-sm">What's your predicted line ups?</h4>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs text-muted-foreground mb-1">Home</p>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="442">4-4-2</SelectItem>
                                        <SelectItem value="433">4-3-3</SelectItem>
                                        <SelectItem value="352">3-5-2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Away</p>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="442">4-4-2</SelectItem>
                                        <SelectItem value="433">4-3-3</SelectItem>
                                        <SelectItem value="352">3-5-2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <Separator />

                    {/* Ztar of the Match */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-center">Who will be the Ztar of the Match?</h4>
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Home</label>
                            <div className="flex items-center gap-2">
                                <Select>
                                    <SelectTrigger className="flex-1"><SelectValue placeholder="Choose player" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="player1">Player 1</SelectItem>
                                        <SelectItem value="player2">Player 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button size="icon" className="rounded-full flex-shrink-0 w-10 h-10"><Plus /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Away</label>
                             <Select>
                                <SelectTrigger><SelectValue placeholder="Choose player" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="player3">Player 3</SelectItem>
                                    <SelectItem value="player4">Player 4</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <NewsCard 
                    category="Latest News"
                    title="Home Team Pre Match Article"
                    content="Home Team Pre Match Article jlkdöj öslkd ölskdj öalskj ölskdj öalsj öalkj aölskdj ölaskj dlaskj öalskadj ölskadj ölsdj ölskj föalkadjlödj aöld jk"
                    imageUrl="https://placehold.co/600x400.png"
                />
                <NewsCard 
                    category="Latest News"
                    title="Home team latest feed update"
                    content="Home team feed update jlkdöj öslkd ölskdj öalskj ölskdj öalsj öalkj aölskdj ölaskj dlaskj öalskadj ölskadj ölsdj ölskj föalkadjlödj aöld jk"
                    imageUrl="https://placehold.co/600x400.png"
                />
            </div>
        </div>
    )
}
