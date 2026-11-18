
package com.hms.hmsbackend.service;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.Patient;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendPatientCredentials(
            Patient patient,
            Appointment appointment,
            String password
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "MediCare Plus");
            helper.setTo(patient.getEmail());
            helper.setSubject(
                    "Appointment Confirmed | MediCare Plus"
            );

            String patientName = escapeHtml(patient.getName());
            String email = escapeHtml(patient.getEmail());
            String token = escapeHtml(appointment.getToken());
            String department = escapeHtml(appointment.getDepartment());
            String date = escapeHtml(appointment.getDate());
            String slot = escapeHtml(appointment.getSlot());
            String safePassword = escapeHtml(password);

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <body style="margin:0;padding:0;background-color:#f4f7fb;
                    font-family:Arial,Helvetica,sans-serif;color:#263445;">

                    <table width="100%%" cellpadding="0" cellspacing="0"
                    style="padding:30px 10px;background-color:#f4f7fb;">
                    <tr>
                    <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0"
                    style="max-width:600px;background:#ffffff;
                    border-radius:12px;overflow:hidden;">

                    <!-- Hospital Header -->
                    <tr>
                    <td style="background:#123b68;padding:28px 30px;
                    text-align:center;color:white;">

                    <h1 style="margin:0;font-size:25px;
                    letter-spacing:0.5px;">
                    MediCare Plus
                    </h1>

                    <p style="margin:8px 0 0;font-size:13px;
                    color:#dce9f7;">
                    Your Health, Our Priority
                    </p>

                    </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                    <td style="padding:32px 30px;">

                    <h2 style="margin:0 0 15px;color:#173f6d;
                    font-size:21px;">
                    Appointment Confirmed!
                    </h2>

                    <p style="font-size:15px;line-height:1.7;">
                    Dear <strong>%s</strong>,
                    </p>

                    <p style="font-size:14px;line-height:1.7;color:#526174;">
                    Thank you for choosing MediCare Plus.
                    Your appointment has been successfully booked.
                    Please find your appointment details below.
                    </p>

                    <!-- Appointment Details -->
                    <table width="100%%" cellpadding="0" cellspacing="0"
                    style="background:#f2f6fb;border:1px solid #e0e8f1;
                    border-radius:8px;margin:24px 0;">

                    <tr>
                    <td colspan="2" style="padding:17px 18px;
                    border-bottom:1px solid #dce5ef;">

                    <strong style="font-size:15px;color:#173f6d;">
                    APPOINTMENT DETAILS
                    </strong>

                    </td>
                    </tr>

                    <tr>
                    <td style="padding:12px 18px;font-size:13px;
                    color:#64748b;">Patient Name</td>
                    <td style="padding:12px 18px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    <tr>
                    <td style="padding:12px 18px;font-size:13px;
                    color:#64748b;">Token Number</td>
                    <td style="padding:12px 18px;font-size:17px;
                    text-align:right;font-weight:bold;color:#1473c9;">%s</td>
                    </tr>

                    <tr>
                    <td style="padding:12px 18px;font-size:13px;
                    color:#64748b;">Department</td>
                    <td style="padding:12px 18px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    <tr>
                    <td style="padding:12px 18px;font-size:13px;
                    color:#64748b;">Appointment Date</td>
                    <td style="padding:12px 18px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    <tr>
                    <td style="padding:12px 18px;font-size:13px;
                    color:#64748b;">Time Slot</td>
                    <td style="padding:12px 18px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    </table>

                    <!-- Login Details -->
                    <h3 style="font-size:16px;color:#173f6d;
                    margin:26px 0 12px;">
                    PATIENT DASHBOARD LOGIN
                    </h3>

                    <p style="font-size:13px;line-height:1.6;
                    color:#526174;">
                    Your patient dashboard account has been created.
                    Use the following credentials to access your account.
                    </p>

                    <table width="100%%" cellpadding="0" cellspacing="0"
                    style="border:1px solid #e0e8f1;border-radius:8px;">

                    <tr>
                    <td style="padding:13px 15px;font-size:13px;
                    color:#64748b;">Email / Username</td>
                    <td style="padding:13px 15px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    <tr>
                    <td style="padding:13px 15px;font-size:13px;
                    color:#64748b;">Password</td>
                    <td style="padding:13px 15px;font-size:13px;
                    text-align:right;font-weight:bold;">%s</td>
                    </tr>

                    </table>

                    <p style="font-size:12px;color:#b45309;
                    background:#fff8e8;padding:12px;border-radius:6px;
                    line-height:1.6;margin-top:16px;">
                    Please keep your login credentials private.
                    Do not share them with anyone.
                    </p>

                    <p style="font-size:14px;line-height:1.7;
                    color:#526174;margin-top:25px;">
                    We look forward to serving you.
                    Please arrive on time for your appointment.
                    </p>

                    <p style="font-size:14px;margin-top:24px;">
                    Regards,<br>
                    <strong style="color:#173f6d;">
                    MediCare Plus Hospital Team
                    </strong>
                    </p>

                    </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                    <td style="background:#f2f5f9;padding:20px 30px;
                    text-align:center;border-top:1px solid #e5eaf0;">

                    <p style="font-size:12px;color:#64748b;
                    margin:0 0 8px;">
                    This is an automated appointment confirmation email.
                    </p>

                    <p style="font-size:11px;color:#94a3b8;margin:0;">
                    © MediCare Plus. All rights reserved.
                    </p>

                    </td>
                    </tr>

                    </table>

                    </td>
                    </tr>
                    </table>

                    </body>
                    </html>
                    """.formatted(
                    patientName,
                    patientName,
                    token,
                    department,
                    date,
                    slot,
                    email,
                    safePassword
            );

            String plainText = """
                    MediCare Plus
                    Your Health, Our Priority

                    Dear %s,

                    Your appointment has been successfully booked.

                    APPOINTMENT DETAILS
                    -------------------
                    Patient Name: %s
                    Token Number: %s
                    Department: %s
                    Appointment Date: %s
                    Time Slot: %s

                    PATIENT DASHBOARD LOGIN
                    -----------------------
                    Email / Username: %s
                    Password: %s

                    Please keep your login credentials private.

                    Regards,
                    MediCare Plus Hospital Team
                    """.formatted(
                    patient.getName(),
                    patient.getName(),
                    appointment.getToken(),
                    appointment.getDepartment(),
                    appointment.getDate(),
                    appointment.getSlot(),
                    patient.getEmail(),
                    password
            );

            helper.setText(plainText, html);

            mailSender.send(message);

            logger.info(
                    "Appointment confirmation email sent for patient ID: {}",
                    patient.getId()
            );

        } catch (Exception e) {
            logger.error(
                    "Failed to send appointment email for patient ID: {}",
                    patient.getId(),
                    e
            );
        }
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
