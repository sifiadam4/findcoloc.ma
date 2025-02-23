"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/global/phone-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullname: z.string().nonempty("Full name is required"),
  date_of_birth: z.coerce.date(),
  gender: z.string().nonempty("Gender is required"),
  phone_number: z.string().nonempty("Phone number is required"),
  city: z.string().optional(),
  university: z.string().optional(),
});

const StepOne = ({ onNext, data }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: data.fullname || "",
      date_of_birth: data.date_of_birth || new Date(),
      gender: data.gender || "",
      phone_number: data.phone_number || "",
      city: data.city || "",
      university: data.university || "",
    },
  });

  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/* fullname */}
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* date of birth */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-4 w-full">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* phone number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* city */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>
                City (Where they are looking for a roommate)
              </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* university */}
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>University/College Name</FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};

export default StepOne;
