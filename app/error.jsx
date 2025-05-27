"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-9xl font-bold text-muted">500</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        Une erreur est survenue
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Nous sommes désolés, une erreur s'est produite lors du traitement de
        votre demande.
      </p>
      <div className="mt-8 flex gap-4">
        <Button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <RefreshCcw className="h-4 w-4" />
          Réessayer
        </Button>
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
