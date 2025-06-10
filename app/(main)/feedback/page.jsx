import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSejourById } from "@/actions/sejour";
import FeedbackForm from "@/components/feedback/feedback-form";
import OwnerFeedbackForm from "@/components/feedback/owner-feedback-form";
import TenantFeedbackForm from "@/components/feedback/tenant-feedback-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function FeedbackContent({ sejourId }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getSejourById(sejourId);

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">
              Séjour introuvable ou accès non autorisé.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { sejour } = result;
  const isOwner = sejour.ownerId === session.user.id;
  const isTenant = sejour.tenantId === session.user.id;

  if (!isOwner && !isTenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">
              Vous n'êtes pas autorisé à laisser un avis pour ce séjour.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has already given feedback
  const hasFeedback = isOwner
    ? sejour.ownerFeedbackGiven
    : sejour.tenantFeedbackGiven;

  if (hasFeedback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-green-600">
              Vous avez déjà laissé un avis pour ce séjour. Merci !
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Partagez votre expérience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Détails du séjour</h3>
            <p>
              <strong>Propriété :</strong> {sejour.offer.title}
            </p>
            <p>
              <strong>Adresse :</strong> {sejour.offer.address},{" "}
              {sejour.offer.city}
            </p>
            <p>
              <strong>Période :</strong>{" "}
              {new Date(sejour.startDate).toLocaleDateString("fr-FR")} -{" "}
              {sejour.endDate
                ? new Date(sejour.endDate).toLocaleDateString("fr-FR")
                : "En cours"}
            </p>
            {isOwner && (
              <p>
                <strong>Colocataire :</strong> {sejour.tenant.name}
              </p>
            )}
            {isTenant && (
              <p>
                <strong>Propriétaire :</strong> {sejour.owner.name}
              </p>
            )}
          </div>{" "}
          {/* Use role-specific feedback forms */}
          {isOwner ? (
            <OwnerFeedbackForm sejour={sejour} targetUser={sejour.tenant} />
          ) : (
            <TenantFeedbackForm sejour={sejour} targetUser={sejour.owner} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default async function FeedbackPage({ searchParams }) {
  const sejourId = searchParams?.sejourId;

  if (!sejourId) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p>Chargement...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <FeedbackContent sejourId={sejourId} />
    </Suspense>
  );
}
