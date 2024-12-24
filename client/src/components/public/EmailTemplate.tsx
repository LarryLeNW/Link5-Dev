import React from "react";

interface EmailTemplateProps {
    firstName: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ firstName }) => (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
        <h1>Welcome, {firstName}!</h1>
        <p>We're excited to have you join us.</p>
        <p>Feel free to reach out if you have any questions.</p>
    </div>
);

export default EmailTemplate;
