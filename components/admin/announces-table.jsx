"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  X,
  Eye,
  MapPin,
  Euro,
  Search,
  MoreHorizontal,
  Loader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAdminOffers,
  updateOfferStatus,
  adminDeleteOffer,
} from "@/actions/admin";
import { toast } from "sonner";

const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
    case "active":
      return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
    case "pending":
      return <Badge variant="outline">En attente</Badge>;
    case "rejected":
    case "closed":
      return <Badge variant="destructive">Rejetée</Badge>;
    case "draft":
      return <Badge className="bg-amber-100 text-amber-800">Brouillon</Badge>;
    case "rented":
      return <Badge className="bg-blue-100 text-blue-800">Louée</Badge>;
    default:
      return <Badge variant="secondary">Inconnu</Badge>;
  }
};

export function AnnouncesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  // Load offers
  const loadOffers = async () => {
    try {
      setLoading(true); // Map UI filter values to actual database status values
      let actualStatusFilter = statusFilter;
      if (statusFilter === "approved") {
        actualStatusFilter = "active";
      } else if (statusFilter === "rejected") {
        actualStatusFilter = "closed";
      }
      // For draft and rented, the filter values match the database values

      const result = await getAdminOffers(
        searchTerm,
        actualStatusFilter,
        typeFilter
      );
      setOffers(result.offers);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  // Load offers on component mount and when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadOffers();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, typeFilter]);

  const filteredAnnounces = offers;

  const handleApprove = async (id) => {
    try {
      const result = await updateOfferStatus(id, "approved");
      if (result.success) {
        toast.success("Annonce approuvée avec succès");
        loadOffers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de l'approbation");
      }
    } catch (error) {
      console.error("Error approving offer:", error);
      toast.error("Erreur lors de l'approbation de l'annonce");
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await updateOfferStatus(id, "rejected");
      if (result.success) {
        toast.success("Annonce rejetée avec succès");
        loadOffers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error("Error rejecting offer:", error);
      toast.error("Erreur lors du rejet de l'annonce");
    }
  };

  const handleView = (id) => {
    // Navigate to offer details page
    window.open(`/colocation/${id}`, "_blank");
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      const result = await adminDeleteOffer(id);
      if (result.success) {
        toast.success("Annonce supprimée avec succès");
        loadOffers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Erreur lors de la suppression de l'annonce");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toutes les Annonces</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une annonce..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>{" "}
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
              <SelectItem value="rented">Louées</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>{" "}
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="apartment">Appartement</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="house">Maison</SelectItem>
              <SelectItem value="coliving">Coliving</SelectItem>
            </SelectContent>
          </Select>{" "}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement des annonces...</span>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnounces.map((announce) => (
                  <TableRow key={announce.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <img
                            src={
                              announce.images?.[0]?.url ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt={announce.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{announce.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {announce.city}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {announce.propertyType} •{" "}
                            {announce.imagesCount || 0} photos
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={announce.owner.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {announce.owner.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {announce.owner.name || "Utilisateur anonyme"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {announce.price}€/mois
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(announce.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(announce.submittedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(announce.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {announce.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(announce.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(announce.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(announce.id)}
                            >
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(announce.id)}
                              className="text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAnnounces.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune annonce trouvée avec ces critères.
              </div>
            )}
            {total > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                {filteredAnnounces.length} sur {total} annonces
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
