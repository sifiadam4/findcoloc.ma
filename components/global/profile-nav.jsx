import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BoltIcon,
  House,
  Layers2Icon,
  User2,
  MapPin,
  Shield,
} from "lucide-react";
import SignoutButton from "@/components/auth/signout-button";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ProfileNav() {
  const session = await auth();

  // Get user admin status
  let isAdmin = false;
  if (session?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isAdmin: true },
      });
      isAdmin = user?.isAdmin || false;
    } catch (error) {
      console.error("Error fetching user admin status:", error);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={session?.user?.image} alt="Profile image" />
          <AvatarFallback>
            {session?.user?.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium capitalize">
            {session?.user?.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {session?.user?.email}
          </span>
        </DropdownMenuLabel>{" "}
        <DropdownMenuSeparator />{" "}
        <DropdownMenuGroup>
          {isAdmin && (
            <Link href="/admin">
              <DropdownMenuItem>
                <Shield size={16} className="opacity-60" aria-hidden="true" />
                <span>Administration</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/dashboard">
            <DropdownMenuItem>
              <House size={16} className="opacity-60" aria-hidden="true" />
              <span>Tableau de bord</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/mes-sejours">
            <DropdownMenuItem>
              <MapPin size={16} className="opacity-60" aria-hidden="true" />
              <span>Mes séjours</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/profile/${session?.user?.id}`}>
            <DropdownMenuItem>
              <User2 size={16} className="opacity-60" aria-hidden="true" />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
