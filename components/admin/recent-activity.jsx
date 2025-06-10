"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CheckCircle,
  XCircle,
  UserPlus,
  FileText,
  Loader,
} from "lucide-react";
import { getRecentActivity } from "@/actions/admin";
import { toast } from "sonner";

const getActivityIcon = (type) => {
  switch (type) {
    case "offer_approved":
      return { icon: CheckCircle, color: "text-green-600" };
    case "offer_rejected":
      return { icon: XCircle, color: "text-red-600" };
    case "user_registered":
      return { icon: UserPlus, color: "text-blue-600" };
    case "offer_created":
      return { icon: FileText, color: "text-orange-600" };
    default:
      return { icon: Activity, color: "text-gray-600" };
  }
};

const getActivityText = (activity) => {
  switch (activity.type) {
    case "offer_approved":
      return `Annonce approuvée: ${activity.details?.title || "Annonce"}`;
    case "offer_rejected":
      return `Annonce rejetée: ${activity.details?.title || "Annonce"}`;
    case "user_registered":
      return "Nouvel utilisateur inscrit";
    case "offer_created":
      return `Nouvelle annonce soumise: ${
        activity.details?.title || "Annonce"
      }`;
    default:
      return activity.description || "Activité";
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const result = await getRecentActivity();
        setActivities(result.activities || []);
      } catch (error) {
        console.error("Error loading activities:", error);
        toast.error("Erreur lors du chargement des activités");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activité Récente
        </CardTitle>
      </CardHeader>{" "}
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Aucune activité récente
            </div>
          ) : (
            activities.map((activity) => {
              const { icon: IconComponent, color } = getActivityIcon(
                activity.type
              );
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-muted ${color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {activity.user?.name || "Utilisateur"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
