// src/components/match-format-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { MatchFormat, CreateMatchFormatDto } from "@/lib/models";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  playerCount: z.coerce.number().int().positive({ message: "Player count must be a positive number." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

interface MatchFormatFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateMatchFormatDto) => void;
  initialData?: MatchFormat | null;
}

export function MatchFormatForm({ isOpen, onClose, onSubmit, initialData }: MatchFormatFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      playerCount: 11,
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        playerCount: 11,
        description: "",
        isActive: true,
      });
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };
  
  const title = initialData ? "Edit Match Format" : "Create Match Format";
  const description = initialData ? "Update the details of the existing format." : "Add a new format to be used in matches.";


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 11v11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the format..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
