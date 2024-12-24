import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const { to, cc, bcc, message } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // Set to true for port 465, otherwise false
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_EMAIL_TO,
            to,                                    
            cc,                                    
            bcc,                                   
            subject: message.subject || 'No Subject', 
            text: message.text,        
            html: message.html,                  
        });

        return NextResponse.json({ message: 'Email sent successfully', info }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}