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

type CreateFamilyFormProps = {
  onSuccess: () => void;
};

export default function CreatingFamilyForm({
  onSuccess,
}: CreateFamilyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/family/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create family");
      }

      // Redirect to family settings page after successful creation
      onSuccess();
    } catch (error) {
      console.error("Error creating family", error);
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
                <Input type="text" placeholder="My lovely family" {...field} />
              </FormControl>
              <FormDescription>
                This will be the name of your family (you can change it later
                :&gt;)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
