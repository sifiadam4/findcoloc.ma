import React from "react";
import { Home, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CandidatureStats = ({counts}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="text-2xl font-bold">{counts.all}</p>
          </div>
          <div className="rounded-full bg-gray-100 p-3">
            <Home className="h-6 w-6 text-gray-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">En attente</p>
            <p className="text-2xl font-bold">{counts.pending}</p>
          </div>
          <div className="rounded-full bg-amber-100 p-3">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Acceptées</p>
            <p className="text-2xl font-bold">{counts.accepted}</p>
          </div>
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Refusées</p>
            <p className="text-2xl font-bold">{counts.rejected}</p>
          </div>
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatureStats;
