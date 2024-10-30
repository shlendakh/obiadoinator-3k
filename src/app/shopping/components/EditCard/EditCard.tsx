"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemCategory, ShoppingItem } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Params = {
  params: ShoppingItem;
  categoryMap: ItemCategory[];
  onSuccess: (updatedProduct?: ShoppingItem) => void;
};

const formSchema = z.object({
  productname: z.string().min(2, "Minimum two characters"),
  quantity: z.coerce
    .number()
    .nonnegative("Quantity must be a zero or positive number"),
  unit: z.string(),
  categoryId: z.string().nonempty("Category is required"),
});

export default function EditCard({ params, categoryMap, onSuccess }: Params) {
  const { id, customProductName, quantity, unit, categoryId } = params;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productname: customProductName || "",
      quantity: quantity || 0,
      unit: unit || "",
      categoryId: categoryId || undefined, // Używamy undefined zamiast null
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/shopping/product?productId=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productname: values.productname,
          quantity: values.quantity,
          unit: values.unit,
          categoryId: values.categoryId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await res.json();
      onSuccess(updatedProduct.productInfo);
    } catch (error) {
      console.error("Error updating product", error);
    }
  }

  return (
    <div className="mt-5">
      <Form {...form} key={id}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Field: Name */}
          <FormField
            control={form.control}
            name="productname"
            key="productname" // Dodajemy key dla FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Change the product name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field: Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            key="quantity" // Dodajemy key dla FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Specify the quantity</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field: Unit */}
          <FormField
            control={form.control}
            name="unit"
            key="unit" // Dodajemy key dla FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter unit (e.g., kg, pcs)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Specify the unit of measurement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field: Category */}
          <FormField
            control={form.control}
            name="categoryId"
            key="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryMap.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Choose a category for the product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button className="h-[50px]" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
