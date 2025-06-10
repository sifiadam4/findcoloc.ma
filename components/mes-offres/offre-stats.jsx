import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const OffreStats = ({ counts }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="text-2xl font-bold">{counts.all}</p>
          </div>
          <div className="rounded-full bg-muted p-3">
            <Home className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">En attente</p>
            <p className="text-2xl font-bold">{counts.pending}</p>
          </div>
          <div className="rounded-full bg-orange-100 p-3">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Actives</p>
            <p className="text-2xl font-bold">{counts.active}</p>
          </div>
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Louées</p>
            <p className="text-2xl font-bold">{counts.rented}</p>
          </div>
          <div className="rounded-full bg-blue-100 p-3">
            <KeyRound className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Brouillons</p>
            <p className="text-2xl font-bold">{counts.draft}</p>
          </div>
          <div className="rounded-full bg-amber-100 p-3">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Fermées</p>
            <p className="text-2xl font-bold">{counts.closed}</p>
          </div>
          <div className="rounded-full bg-gray-100 p-3">
            <XCircle className="h-6 w-6 text-gray-500" />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default OffreStats;
