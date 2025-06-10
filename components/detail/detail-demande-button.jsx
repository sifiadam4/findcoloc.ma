"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Loader2 } from "lucide-react";
import { ApplyToColocation } from "@/actions/application";
import { set } from "date-fns";

const DemandeButton = ({ offerId, ...props }) => {
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await ApplyToColocation(offerId, message);
      if (result.success === false) {
        setError(result.message);
        return;
      }
      setIsDialogOpen(false);
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsSubmitting(false);
      setError(null);
    }
  };
  return (
    <div>
      <Button
        onClick={() => setIsDialogOpen(true)}
        size="lg"
        className="bg-primary hover:bg-primary/90"
        {...props}
      >
        Je suis intéressé(e)
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Postuler pour cette colocation</DialogTitle>
            <DialogDescription>
              Présentez-vous et expliquez pourquoi vous êtes intéressé(e) par
              cette colocation.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mb-4 text-red-600">
              <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Bonjour, je m'appelle... Je suis intéressé(e) par votre colocation car..."
              className="min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours
                </>
              ) : (
                "Envoyer ma candidature"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemandeButton;
