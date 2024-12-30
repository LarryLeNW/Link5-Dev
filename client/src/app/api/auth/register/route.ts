 import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface RegisterRequestBody {
  email: string;
  password: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const body: RegisterRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required!" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists!" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully!", user: newUser }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
