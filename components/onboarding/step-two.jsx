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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  genderPreference: z.enum(["male", "female", "noPreference"], {
    required_error: "Please select a gender preference",
  }),
  smokingPreference: z.enum(["smoker", "nonSmoker", "noPreference"], {
    required_error: "Please select a smoking preference",
  }),
  petPreference: z.enum(["petFriendly", "noPets", "noPreference"], {
    required_error: "Please select a pet preference",
  }),
  lifestylePreference: z.enum(["social", "quiet", "balanced"], {
    required_error: "Please select a lifestyle preference",
  }),
  cleanlinessLevel: z.enum(["veryClean", "moderatelyClean", "relaxed"], {
    required_error: "Please select a cleanliness level",
  }),
  // partyHabitsPreference: z.enum(["partyAnimal", "occasional", "noPreference"], {
  //   required_error: "Please select a party habits preference",
  // }),
  // guestsPreference: z.enum(["frequent", "occasional", "noPreference"], {
  //   required_error: "Please select a guests preference",
  // }),
});

const StepTwo = ({ onSubmit, onPrev, data }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genderPreference: data.genderPreference || undefined,
      smokingPreference: data.smokingPreference || undefined,
      petPreference: data.petPreference || undefined,
      lifestylePreference: data.lifestylePreference || undefined,
      cleanlinessLevel: data.cleanlinessLevel || undefined,
      // partyHabitsPreference: data.partyHabitsPreference || undefined,
      // guestsPreference: data.guestsPreference || undefined
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="genderPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender Preference</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {["male", "female", "noPreference"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={field.value === option ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === option &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => field.onChange(option)}
                    >
                      {option === "male"
                        ? "Male"
                        : option === "female"
                        ? "Female"
                        : "No Preference"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smokingPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Smoking Preference</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {["smoker", "nonSmoker", "noPreference"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={field.value === option ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === option &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => field.onChange(option)}
                    >
                      {option === "smoker"
                        ? "Smoker"
                        : option === "nonSmoker"
                        ? "Non-Smoker"
                        : "No Preference"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="petPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Pet Preference</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {["petFriendly", "noPets", "noPreference"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={field.value === option ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === option &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => field.onChange(option)}
                    >
                      {option === "petFriendly"
                        ? "Pet-Friendly"
                        : option === "noPets"
                        ? "No Pets"
                        : "No Preference"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lifestylePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lifestyle Preference</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {["social", "quiet", "balanced"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={field.value === option ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === option &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => field.onChange(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cleanlinessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cleanliness Level</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {["veryClean", "moderatelyClean", "relaxed"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={field.value === option ? "default" : "outline"}
                      className={cn(
                        "flex-1",
                        field.value === option &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => field.onChange(option)}
                    >
                      {option === "veryClean"
                        ? "Very Clean"
                        : option === "moderatelyClean"
                        ? "Moderately Clean"
                        : "Relaxed"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button onClick={onPrev} variant="secondary">
            Prev
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default StepTwo;
