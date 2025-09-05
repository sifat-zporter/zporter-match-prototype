// src/app/(app)/api-token/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";

const formSchema = z.object({
  apiToken: z.string().min(1, { message: "API Token cannot be empty." }),
});

export default function ApiTokenPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiToken: isClient ? localStorage.getItem("zporter-api-token") || "" : "",
    },
  });
  
  // Effect to update form default value once localStorage is available
  useEffect(() => {
      if (isClient) {
          form.reset({ apiToken: localStorage.getItem("zporter-api-token") || "" });
      }
  }, [isClient, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem("zporter-api-token", values.apiToken);
    toast({
      title: "API Token Saved",
      description: "The new API token has been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-headline font-bold">API Token Management</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 flex justify-center items-start pt-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
                <KeyRound className="w-8 h-8 text-primary"/>
                <div>
                    <CardTitle>Set API Token</CardTitle>
                    <CardDescription>
                    This token will be used for all requests to the Zporter backend API.
                    </CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {isClient ? (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="apiToken"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your API Token</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Enter your API token..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Save Token</Button>
                </form>
                </Form>
            ) : (
                <p>Loading...</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
