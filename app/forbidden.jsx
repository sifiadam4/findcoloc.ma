import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Lock } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="rounded-full bg-red-100 p-6">
        <Lock className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Accès refusé</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Se connecter</Button>
        </Link>
      </div>
    </div>
  );
}
