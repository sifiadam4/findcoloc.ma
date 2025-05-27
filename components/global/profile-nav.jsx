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

import { BoltIcon, House, Layers2Icon, User2 } from "lucide-react";
import SignoutButton from "@/components/auth/signout-button";
import Link from "next/link";

export default async function ProfileNav() {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Avatar className="size-9">
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
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem>
              <House size={16} className="opacity-60" aria-hidden="true" />
              <span>Tableau de bord</span>
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
