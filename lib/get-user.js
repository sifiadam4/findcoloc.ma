import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getUser() {
    const session = await auth();
    if(!session?.user){
        console.log("User is not logged in");
        redirect("/");

    }
    return session?.user;
}
