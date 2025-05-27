import {
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  Cat,
  Users,
  Home,
  Coins,
  CigaretteIcon as Smoking,
  PartyPopper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InfoTab({ user }) {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format datetime for last active
  const formatLastActive = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return formatDate(dateTimeString);
    }
  };

  const age = calculateAge(user.dob);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main info */}
      <div className="md:col-span-2 space-y-6">
        {user.bio && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">À propos</h2>
            <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Préférences de colocation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Smoking className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tabac</div>
                  <div className="font-medium">
                    {user.smokingAllowed ? "Autorisé" : "Interdit"}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Cat className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Animaux</div>
                  <div className="font-medium">
                    {user.petsAllowed ? "Acceptés" : "Non acceptés"}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Visiteurs</div>
                  <div className="font-medium">
                    {user.visitorsAllowed ? "Autorisés" : "Non autorisés"}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <PartyPopper className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fêtes</div>
                  <div className="font-medium">
                    {user.partyAllowed ? "Autorisées" : "Non autorisées"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {user.genderPreference && (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      Préférence de genre
                    </div>
                    <div className="font-medium">
                      {user.genderPreference === "any"
                        ? "Aucune préférence"
                        : user.genderPreference === "male"
                        ? "Homme"
                        : user.genderPreference === "female"
                        ? "Femme"
                        : user.genderPreference}
                    </div>
                  </div>
                </div>
              )}

              {(user.minBudget || user.maxBudget) && (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-medium">
                      {user.minBudget && user.maxBudget
                        ? `${user.minBudget} - ${user.maxBudget} MAD/mois`
                        : user.maxBudget
                        ? `Jusqu'à ${user.maxBudget} MAD/mois`
                        : user.minBudget
                        ? `À partir de ${user.minBudget} MAD/mois`
                        : "Non spécifié"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side info */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Informations personnelles
          </h2>
          <div className="space-y-4">
            {age && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Âge</div>
                  <div className="font-medium">{age} ans</div>
                </div>
              </div>
            )}

            {(user.jobTitle || user.company) && (
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Profession</div>
                  <div className="font-medium">
                    {user.jobTitle && user.company
                      ? `${user.jobTitle} chez ${user.company}`
                      : user.jobTitle || user.company}
                  </div>
                </div>
              </div>
            )}

            {user.occupation && (
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Occupation</div>
                  <div className="font-medium">
                    {user.occupation === "student"
                      ? "Étudiant"
                      : user.occupation === "employee"
                      ? "Employé"
                      : user.occupation === "freelancer"
                      ? "Freelance"
                      : user.occupation === "entrepreneur"
                      ? "Entrepreneur"
                      : user.occupation}
                  </div>
                </div>
              </div>
            )}

            {user.city && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Ville</div>
                  <div className="font-medium">{user.city}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Activité</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-sm text-gray-500">Membre depuis</div>
                <div className="font-medium">{formatDate(user.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="text-sm text-gray-500">
                  Dernière mise à jour
                </div>
                <div className="font-medium">
                  {formatLastActive(user.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
