"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Family name must be at least 2 characters.",
  }),
});

type ChangeFamilyFormProps = {
  familyId: string;
  name: string;
  onSuccess: () => void;
};

export default function ChangeFamilyForm({
  familyId,
  name,
  onSuccess,
}: ChangeFamilyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  // const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/family/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId: familyId,
          name: values.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update family");
      }

      // Call onSuccess callback after successful update
      onSuccess();
    } catch (error) {
      console.error("Error updating family", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder={name} {...field} />
              </FormControl>
              <FormDescription>Change your family name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
