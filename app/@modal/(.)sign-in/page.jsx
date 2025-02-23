"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import SigninButton from "@/components/auth/signin-button";

const Page = () => {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl">🏡</h1>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Welcome to FindColoc
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>
        <SigninButton />
      </DialogContent>
    </Dialog>
  );
};

export default Page;
