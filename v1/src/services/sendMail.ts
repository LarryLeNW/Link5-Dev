import nodemailer from 'nodemailer';

interface EmailPayload {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async (emailPayload: EmailPayload) => {
    const { to, subject, text, html } = emailPayload;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or another email provider like "Yahoo", "Outlook"
        auth: {
            user: "larrylenw@gmail.com", // Sender email address
            pass: "ccaa xlkm ohir vror", // Sender email password or app password
        },
    });

    // Define email options
    const mailOptions = {
        from: "blog global", // Sender email address
        to, // Recipient email address
        subject, // Email subject
        text, // Plain text body (optional)
        html, // HTML body (optional)
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
