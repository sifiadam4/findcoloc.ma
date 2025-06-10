"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Loader,
  CreditCard,
  IdCard as IdCardIcon,
} from "lucide-react";
import { getUserDetailsForAdmin } from "@/actions/user";
import { updateUserStatus } from "@/actions/admin";
import { toast } from "sonner";

const getStatusBadge = (status) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-100 text-green-800">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Vérifié
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      );
    case "suspended":
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Suspendu
        </Badge>
      );
    default:
      return <Badge variant="secondary">Inconnu</Badge>;
  }
};

const getOccupationLabel = (occupation) => {
  const labels = {
    student: "Étudiant",
    employee: "Employé",
    freelancer: "Freelance",
    entrepreneur: "Entrepreneur",
    other: "Autre",
  };
  return labels[occupation] || occupation;
};

export function UserVerificationDialog({
  userId,
  isOpen,
  onOpenChange,
  onStatusUpdate,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadUserDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const userData = await getUserDetailsForAdmin(userId);
      setUser(userData);
    } catch (error) {
      console.error("Error loading user details:", error);
      toast.error("Erreur lors du chargement des détails utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetails();
    }
  }, [isOpen, userId]);

  const handleStatusUpdate = async (newStatus) => {
    if (!user) return;

    try {
      setActionLoading(true);
      const result = await updateUserStatus(user.id, newStatus);

      if (result.success) {
        toast.success(
          `Utilisateur ${
            newStatus === "verified" ? "vérifié" : "suspendu"
          } avec succès`
        );
        setUser({ ...user, status: newStatus });
        onStatusUpdate?.();
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setActionLoading(false);
    }
  };

  const ImageModal = ({ src, alt, isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Vérification d'utilisateur
            </DialogTitle>
            <DialogDescription>
              Examinez les informations et documents d'identité de l'utilisateur
              avant la vérification.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* User Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.image || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {(user.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {user.name || "Nom non renseigné"}
                        </h3>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Inscrit le{" "}
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {user.phonenumber || "Non renseigné"}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {user.city || "Ville non renseignée"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="activity">Activité</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Informations personnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Nom complet
                        </label>
                        <p className="mt-1">{user.name || "Non renseigné"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Date de naissance
                        </label>
                        <p className="mt-1">
                          {user.dob
                            ? new Date(user.dob).toLocaleDateString("fr-FR")
                            : "Non renseignée"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Genre
                        </label>
                        <p className="mt-1">{user.gender || "Non renseigné"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Profession
                        </label>
                        <p className="mt-1">
                          {user.occupation
                            ? getOccupationLabel(user.occupation)
                            : "Non renseignée"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Biographie
                        </label>
                        <p className="mt-1 text-sm">
                          {user.bio || "Aucune biographie"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Préférences de logement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Budget minimum
                        </label>
                        <p className="mt-1">
                          {user.minBudget
                            ? `${user.minBudget} DH`
                            : "Non défini"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Budget maximum
                        </label>
                        <p className="mt-1">
                          {user.maxBudget
                            ? `${user.maxBudget} DH`
                            : "Non défini"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Préférence de genre
                        </label>
                        <p className="mt-1">
                          {user.genderPreference || "Aucune préférence"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Fumeur autorisé
                        </label>
                        <p className="mt-1">
                          {user.smokingAllowed ? "Oui" : "Non"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Animaux autorisés
                        </label>
                        <p className="mt-1">
                          {user.petsAllowed ? "Oui" : "Non"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Visiteurs autorisés
                        </label>
                        <p className="mt-1">
                          {user.visitorsAllowed ? "Oui" : "Non"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  {user.idCard || user.passport ? (
                    <div className="space-y-4">
                      {user.idCard && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <IdCardIcon className="h-4 w-4" />
                              Carte d'identité
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Recto
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.idCard.frontPath,
                                      alt: "Carte d'identité - Recto",
                                    })
                                  }
                                >
                                  <img
                                    src={user.idCard.frontPath}
                                    alt="Carte d'identité - Recto"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Verso
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.idCard.backPath,
                                      alt: "Carte d'identité - Verso",
                                    })
                                  }
                                >
                                  <img
                                    src={user.idCard.backPath}
                                    alt="Carte d'identité - Verso"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Selfie avec la pièce
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.idCard.selfiePath,
                                      alt: "Selfie avec carte d'identité",
                                    })
                                  }
                                >
                                  <img
                                    src={user.idCard.selfiePath}
                                    alt="Selfie avec carte d'identité"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {user.passport && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Passeport
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Page d'identité
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.passport.frontPath,
                                      alt: "Passeport - Page d'identité",
                                    })
                                  }
                                >
                                  <img
                                    src={user.passport.frontPath}
                                    alt="Passeport - Page d'identité"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Page arrière
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.passport.backPath,
                                      alt: "Passeport - Page arrière",
                                    })
                                  }
                                >
                                  <img
                                    src={user.passport.backPath}
                                    alt="Passeport - Page arrière"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                  Selfie avec le passeport
                                </label>
                                <div
                                  className="relative aspect-[3/2] border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: user.passport.selfiePath,
                                      alt: "Selfie avec passeport",
                                    })
                                  }
                                >
                                  <img
                                    src={user.passport.selfiePath}
                                    alt="Selfie avec passeport"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Aucun document d'identité
                        </h3>
                        <p className="text-muted-foreground">
                          L'utilisateur n'a pas encore soumis de documents
                          d'identité pour vérification.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {user._count.offers}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Offres publiées
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {user._count.applications}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Candidatures
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {user._count.reviewsGiven}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Avis donnés
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {user._count.reviewsReceived}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Avis reçus
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {user.offers && user.offers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Offres récentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {user.offers.slice(0, 5).map((offer) => (
                            <div
                              key={offer.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <h4 className="font-medium">{offer.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Créée le{" "}
                                  {new Date(offer.createdAt).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  offer.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {offer.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Impossible de charger les détails de l'utilisateur
              </p>
            </div>
          )}

          <DialogFooter className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            {user && user.status === "pending" && (
              <Button
                onClick={() => handleStatusUpdate("verified")}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Vérifier l'utilisateur
              </Button>
            )}
            {user && user.status === "verified" && (
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate("suspended")}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Suspendre
              </Button>
            )}
            {user && user.status === "suspended" && (
              <Button
                onClick={() => handleStatusUpdate("verified")}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Réactiver
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
