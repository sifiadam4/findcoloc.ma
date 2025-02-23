'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";


const SignoutButton = () => {
  return <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>;
};

export default SignoutButton;
