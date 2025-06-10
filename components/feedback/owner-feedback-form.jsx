"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Star, Loader2 } from "lucide-react";
import { createFeedback } from "@/actions/review";
import toast from "react-hot-toast";

const ownerFeedbackSchema = z.object({
  tenantRating: z.number().min(1, "Veuillez donner une note").max(5),
  tenantComment: z.string().optional().or(z.literal("")),
});

function StarRating({ value, onChange, label }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              console.log("Star clicked:", star); // Debug log
              onChange(star);
            }}
            className="transition-colors hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-gray-600">
          {value === 1 && "Très mauvais"}
          {value === 2 && "Mauvais"}
          {value === 3 && "Moyen"}
          {value === 4 && "Bon"}
          {value === 5 && "Excellent"}
        </p>
      )}
    </div>
  );
}

export default function OwnerFeedbackForm({ sejour, targetUser }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantRating, setTenantRating] = useState(0);

  const form = useForm({
    resolver: zodResolver(ownerFeedbackSchema),
    defaultValues: {
      tenantRating: 0,
      tenantComment: "",
    },
  });

  // Update form values when star ratings change
  React.useEffect(() => {
    form.setValue("tenantRating", tenantRating);
  }, [tenantRating, form]);

  const onSubmit = async (data) => {
    if (tenantRating === 0) {
      toast.error("Veuillez donner une note à votre locataire");
      return;
    }

    if (!sejour?.id) {
      toast.error("Erreur: ID du séjour manquant");
      return;
    }

    if (!targetUser?.id) {
      toast.error("Erreur: ID du locataire manquant");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit tenant feedback only (owner can only rate tenant)
      const tenantResult = await createFeedback({
        rating: tenantRating,
        comment:
          data.tenantComment && data.tenantComment.trim() !== ""
            ? data.tenantComment
            : null,
        targetId: targetUser.id,
        sejourId: sejour.id,
        type: "tenant",
      });

      if (!tenantResult.success) {
        toast.error(
          tenantResult.error ||
            "Erreur lors de la soumission de votre avis sur le locataire"
        );
        setIsSubmitting(false);
        return;
      }

      toast.success("Merci pour votre avis !");
      router.push("/mes-sejours");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Erreur lors de la soumission de votre avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tenant Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Évaluez votre locataire</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <StarRating
              value={tenantRating}
              onChange={setTenantRating}
              label={`Comment évaluez-vous votre expérience avec ${targetUser.name} ?`}
            />
            <FormField
              control={form.control}
              name="tenantComment"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>
                    Commentaire sur le locataire (optionnel)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Partagez votre expérience avec ${targetUser.name}...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || tenantRating === 0}
            className="flex-1"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer mon avis
          </Button>
        </div>
      </form>
    </Form>
  );
}
