"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";

const SignoutButton = () => {
  return (
    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
      <span>Se deconnecter</span>
    </DropdownMenuItem>
  );
};

export default SignoutButton;
