import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function MatchNotes() {
    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Note Group 1 */}
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">2021/12/12 at 18:47</p>
                    <p className="text-sm">
                        Text as in the chat about this event
                        <br />
                        From participants in the event.
                    </p>
                </div>

                {/* Note Group 2 with Avatar */}
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">2021/12/12 at 18:48</p>
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing. Donec in
                            dui dapibus, blandit nibh eget,
                        </p>
                        <Image 
                            src="https://placehold.co/40x40.png" 
                            alt="User avatar" 
                            width={40} 
                            height={40} 
                            className="rounded-full" 
                            data-ai-hint="person avatar"
                        />
                    </div>
                </div>

                {/* Note Group 3 */}
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">2021/12/12 at 18:49</p>
                    <p className="text-sm">
                        Text as in the chat öskdjf ödöklsjdö kl
                        <br />
                        Kölsdfjlökd fölksd ölksdj ölskd fasökld
                        <br />
                        Jsdflksdjöksh
                    </p>
                </div>
            </div>

            <div className="p-4 border-t border-border">
                <div className="relative">
                    <Input 
                        placeholder="Hint text"
                        className="pr-12"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-500 hover:text-blue-600">
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
