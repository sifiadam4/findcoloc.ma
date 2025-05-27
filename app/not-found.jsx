import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-9xl font-bold text-muted">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        Page non trouvée
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
        <Link href="/creer-offre">
          <Button variant="outline">Créer une offre</Button>
        </Link>
      </div>
    </div>
  );
}
