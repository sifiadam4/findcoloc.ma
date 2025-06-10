import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSejourHistory, getActiveSejoursByUser } from "@/actions/sejour";
import SejourCard from "@/components/sejour/sejour-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, History, Search } from "lucide-react";
import Link from "next/link";

async function SejourHistoryContent({ userId }) {
  const [historyResult, activeResult] = await Promise.all([
    getSejourHistory(userId),
    getActiveSejoursByUser(userId),
  ]);

  //   console.log("History Result:", historyResult);
  console.log("Active Result:", activeResult.asOwner);
  if (!historyResult.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-4">
              <Search className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-600">
              Erreur lors du chargement
            </h3>
            <p className="mt-2 text-gray-500">
              Une erreur s'est produite lors du chargement de vos séjours.
              Veuillez réessayer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allSejours = historyResult.sejours;
  const activeSejours = activeResult.success
    ? [...activeResult.asOwner, ...activeResult.asTenant]
    : [];
  const endedSejours = allSejours.filter((s) => s.status === "ended");

  return (
    <main className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl tracking-tighter font-bold text-foreground">
          Mes Séjours
        </h1>
        <p className="text-muted-foreground">
          Gérez vos séjours actifs et consultez votre historique
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="">
          <TabsTrigger value="active" className="flex items-center gap-2">
            Séjours actifs
            {activeSejours.length > 0 && (
              <Badge className="rounded-full w-5 h-5 flex items-center justify-center">
                {activeSejours.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            Historique
            {endedSejours.length > 0 && (
              <Badge className="rounded-full w-5 h-5 flex items-center justify-center">
                {endedSejours.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>{" "}
        <TabsContent value="active" className="space-y-4">
          {activeSejours.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucun séjour actif</h3>
                <p className="mt-2 text-gray-500">
                  Vous n'avez aucun séjour en cours. Parcourez les annonces pour
                  commencer votre recherche.
                </p>
                <Link href="/" className="mt-4">
                  <Button className="mt-4">Parcourir les annonces</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeSejours.map((sejour) => (
                <SejourCard
                  key={sejour.id}
                  sejour={sejour}
                  currentUserId={userId}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>{" "}
        <TabsContent value="history" className="space-y-4">
          {endedSejours.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucun séjour terminé</h3>
                <p className="mt-2 text-gray-500">
                  Votre historique est vide. Une fois vos séjours terminés, ils
                  apparaîtront ici.
                </p>
                <Link href="/" className="mt-4">
                  <Button className="mt-4">Parcourir les annonces</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {endedSejours.map((sejour) => (
                <SejourCard
                  key={sejour.id}
                  sejour={sejour}
                  currentUserId={userId}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default async function SejourHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <CalendarDays className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="text-lg font-medium">Chargement...</h3>
              <p className="mt-2 text-gray-500">
                Chargement de vos séjours en cours...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SejourHistoryContent userId={session.user.id} />
    </Suspense>
  );
}
