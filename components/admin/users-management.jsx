"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Loader,
  Eye,
} from "lucide-react";
import { getPendingUsers, getUsers, updateUserStatus } from "@/actions/admin";
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

export function UsersManagement() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load recent users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await getPendingUsers(); // Get 6 most recent users
      console.log("Recent users:", result);
      setUsers(result || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const handleQuickAction = async (userId, action) => {
    try {
      const result = await updateUserStatus(userId, action);
      if (result.success) {
        toast.success(
          `Utilisateur ${
            action === "verified" ? "vérifié" : "suspendu"
          } avec succès`
        );
        loadUsers(); // Reload data
      } else {
        toast.error(result.error || "Erreur lors de l'action");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Erreur lors de l'action");
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleStatusUpdate = () => {
    loadUsers(); // Reload users after status update
  };

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs
        </CardTitle>
        {/* <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {(user.name || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Inscrit le{" "}
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                      <span>{user.role || "Utilisateur"}</span>
                      <span>{user._count?.offers || 0} propriété(s)</span>
                    </div>
                  </div>
                </div>{" "}
                <div className="flex items-center gap-2">
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
                      onClick={() => handleQuickAction(user.id, "verified")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Vérifier
                    </Button>
                  )}
                  {user.status === "verified" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(user.id, "suspended")}
                    >
                      Suspendre
                    </Button>
                  )}
                  {user.status === "suspended" && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickAction(user.id, "verified")}
                    >
                      Réactiver
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <UserVerificationDialog
        userId={selectedUserId}
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onStatusUpdate={handleStatusUpdate}
      />
    </Card>
  );
}
