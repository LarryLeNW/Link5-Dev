import { getSession, signIn } from "next-auth/react";

export const handleDefaultLogin = async (email: string, password: string) => {
  try {
    let result = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    const session = await getSession();
    return { ...result, user: {role : "user" , ...session?.user }};
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};


export const handleRegister  = async (data : any ) => {
  const res = await fetch(`http://localhost:3000/api/auth/register`, {
         method: "POST",
         body: JSON.stringify(data),
         headers: {
             "Content-Type": "application/json",
         },
     })
     return await res.json()
};
