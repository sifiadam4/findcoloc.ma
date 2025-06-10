"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye, MapPin, Euro, FileText, Loader } from "lucide-react";
import { getPendingProperties, updateOfferStatus } from "@/actions/admin";
import { toast } from "sonner";

export function PendingProperties() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load pending properties
  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      const result = await getPendingProperties();
      console.log("Pending properties:", result);
      setPendingProperties(result || []);
    } catch (error) {
      console.error("Error loading pending properties:", error);
      toast.error("Erreur lors du chargement des propriétés en attente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const handleApprove = async (id) => {
    try {
      const result = await updateOfferStatus(id, "approved");
      if (result.success) {
        toast.success("Propriété approuvée avec succès");
        loadPendingProperties(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de l'approbation");
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error("Erreur lors de l'approbation de la propriété");
    }
  };
  const handleReject = async (id) => {
    try {
      const result = await updateOfferStatus(id, "rejected");
      if (result.success) {
        toast.success("Propriété rejetée avec succès");
        loadPendingProperties(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error("Error rejecting property:", error);
      toast.error("Erreur lors du rejet de la propriété");
    }
  };

  const handleView = (id) => {
    window.open(`/colocation/${id}`, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Annonces en Attente de Validation
        </CardTitle>
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : pendingProperties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune annonce en attente de validation
          </div>
        ) : (
          pendingProperties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src={
                      property.images?.[0] ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{property.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.address || property.location}{" "}
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {property.price}€/mois
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          property.user?.profilePicture || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {(property.user?.name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {property.user?.name}
                    </span>
                    <Badge variant="outline">
                      {property.images?.length || 0} photos
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(property.createdAt).toLocaleDateString("fr-FR")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(property.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(property.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(property.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
