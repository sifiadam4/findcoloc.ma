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
  Search,
  Shield,
  ShieldCheck,
  AlertTriangle,
  MoreHorizontal,
  Mail,
  Phone,
  Loader,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUsers, updateUserStatus, deleteUser } from "@/actions/admin";
import { UserVerificationDialog } from "@/components/admin/user-verification-dialog";
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

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsers(searchTerm, statusFilter);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadUsers();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  const handleVerifyUser = async (id) => {
    try {
      const result = await updateUserStatus(id, "verified");
      if (result.success) {
        toast.success("Utilisateur vérifié avec succès");
        loadUsers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de la vérification");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Erreur lors de la vérification de l'utilisateur");
    }
  };

  const handleSuspendUser = async (id) => {
    try {
      const result = await updateUserStatus(id, "suspended");
      if (result.success) {
        toast.success("Utilisateur suspendu avec succès");
        loadUsers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de la suspension");
      }
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Erreur lors de la suspension de l'utilisateur");
    }
  };

  const handleReactivateUser = async (id) => {
    try {
      const result = await updateUserStatus(id, "verified");
      if (result.success) {
        toast.success("Utilisateur réactivé avec succès");
        loadUsers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de la réactivation");
      }
    } catch (error) {
      console.error("Error reactivating user:", error);
      toast.error("Erreur lors de la réactivation de l'utilisateur");
    }
  };
  const handleDeleteUser = async (id) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      const result = await deleteUser(id);
      if (result.success) {
        toast.success("Utilisateur supprimé avec succès");
        loadUsers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleStatusUpdate = () => {
    loadUsers(); // Reload users when status is updated
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tous les Utilisateurs ({total})</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="verified">Vérifiés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="suspended">Suspendus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Propriétés</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {(user.name || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {/* <div className="text-sm text-muted-foreground">
                          Dernière activité:{" "}
                          {user.lastActiveAt
                            ? new Date(user.lastActiveAt).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Jamais"}
                        </div> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role || "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {user._count?.offers || 0}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      propriété{(user._count?.offers || 0) > 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      {user.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleVerifyUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Vérifier
                        </Button>
                      )}
                      {user.status === "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          Suspendre
                        </Button>
                      )}
                      {user.status === "suspended" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReactivateUser(user.id)}
                        >
                          Réactiver
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <UserVerificationDialog
        userId={selectedUserId}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        onStatusUpdate={handleStatusUpdate}
      />
    </Card>
  );
}
