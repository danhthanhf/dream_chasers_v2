package com.dreamchasers.recoverbe.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MailService {
    private final JavaMailSender mailSender;

    @Autowired
    public MailService(JavaMailSender javaMailSender) {
        this.mailSender = javaMailSender;
    }
    @Value("${spring.mail.username")
    private String from;

    @Async
    public void sendCompletedCourse(String toEmail, String courseTitle, String fullName) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            helper.setFrom(from, "Distance Class");
            helper.setTo(toEmail);
            helper.setSubject("Course Completed: " + courseTitle);
            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <style>\n" +
                    "        body {\n" +
                    "            font-family: Arial, sans-serif;\n" +
                    "            background-color: #f9f9f9;\n" +
                    "            margin: 0;\n" +
                    "            padding: 0;\n" +
                    "        }\n" +
                    "        .container {\n" +
                    "            max-width: 600px;\n" +
                    "            margin: 0 auto;\n" +
                    "            background-color: #ffffff;\n" +
                    "            padding: 20px;\n" +
                    "            border-radius: 8px;\n" +
                    "            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n" +
                    "            text-align: center;\n" +
                    "        }\n" +
                    "        h1 {\n" +
                    "            color: #333;\n" +
                    "        }\n" +
                    "        p {\n" +
                    "            color: #555;\n" +
                    "            font-size: 16px;\n" +
                    "            line-height: 1.6;\n" +
                    "        }\n" +
                    "        .certificate {\n" +
                    "            margin: 20px 0;\n" +
                    "            padding: 15px;\n" +
                    "            border: 2px dashed #007bff;\n" +
                    "            color: #007bff;\n" +
                    "            font-size: 18px;\n" +
                    "            font-weight: bold;\n" +
                    "        }\n" +
                    "        .footer {\n" +
                    "            margin-top: 20px;\n" +
                    "            font-size: 14px;\n" +
                    "            color: #888;\n" +
                    "        }\n" +
                    "    </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "    <div class=\"container\">\n" +
                    "        <div style=\"display: flex\">\n" +
//                    "            <img\n" +
//                    "                style=\"margin: auto; display: block; height: 60px;\"\n" +
//                    "                src='cid:logo'\n" +
//                    "                alt=\"Distant Class\"\n" +
//                    "            />\n" +
                    "        </div>" +
                    "        <h1>Congratulations on Completing Your Course!</h1>\n" +
                    "        <p>Dear " + "<strong> " + fullName +"</strong>" + ",</p>\n" +
                    "        <p>We are thrilled to inform you that you have successfully completed the course <strong>\"" + courseTitle + "\"</strong>.</p>\n" +
                    "        <p>Thank you for learning with <strong>Distance Class</strong>! We hope to see you in our future courses.</p>\n" +
                    "        <p class=\"footer\"><i>This is an automated message. Please do not reply to this email.</i></p>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>";
            helper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
            helper.setText(htmlContent, true);
            mailSender.send(mime);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public void sendCode(String to, String code) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(from, "Distant Class");
            helper.setTo(to);
            helper.setSubject("Verify account Distant Class");
            helper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <style>\n" +
                    "        body {\n" +
                    "            font-family: Arial, sans-serif;\n" +
                    "            background-color: #f4f4f4;\n" +
                    "            margin: 0;\n" +
                    "            padding: 0;\n" +
                    "        }\n" +
                    "        .container {\n" +
                    "            max-width: 600px;\n" +
                    "            margin: 0 auto;\n" +
                    "            background-color: #ffffff;\n" +
                    "            padding: 20px;\n" +
                    "            border-radius: 5px;\n" +
                    "            box-shadow: 0 0 10px rgba(0,0,0,0.1);\n" +
                    "        }\n" +
                    "        h1 {\n" +
                    "            color: #333;\n" +
                    "            text-align: center;" +
                    "        }\n" +
                    "        p {\n" +
                    "            color: #555;\n" +
                    "        }\n" +
                    "         i {" +
                    "               font-size: 15px;\n" +
                    "         }" +
                    "        .btn {\n" +
                    "            background-color: #007bff;\n" +
                    "            color: #fff;\n" +
                    "            text-decoration: none;\n" +
                    "            padding: 10px 20px;\n" +
                    "            border-radius: 5px;\n" +
                    "            display: inline-block;\n" +
                    "        }\n" +
                    "        .btn:hover {\n" +
                    "            background-color: #0056b3;\n" +
                    "        }\n" +
                    "    </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "    <div class=\"container\">\n" +
                    "        <div style=\"display: float\">\n" +
                    "            <img\n" +
                    "                style=\"margin: auto; display: block; height: 60px;\"\n" +
                    "                src='cid:logo'\n" +
                    "                alt=\"Distant Class\"\n" +
                    "            />\n" +
                    "        </div>" +
                    "        <h1>Account Registration Verification Code</h1>\n" +
                    "        <p>Hello,</p>\n" +
                    "        <p>To verify your account, please enter this code into Distant Class:</p>\n" +
                    " <div style=\"background-color:#ebebeb;color:#333;font-size:40px;letter-spacing:8px;padding:16px;text-align:center\">" + code + "</div>" +
                    "        <p>This verification code will expire in 48 hours.</p>\n" +
                    "        <p><strong>If you did not request this code</strong>, please disregard this message.</p>\n" +
                    "        <p>Best regards,</p>\n" +
                    "        <p>The <strong>Distant Class</strong> Development Team</p>\n" +
                    "<p style=\"Margin:0;Margin-bottom:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;margin:0;margin-bottom:10px;padding:0;text-align:left;color:#757575\">" +
                    "<i>This is an automatically generated email. Please do not reply to this email.</i>" +
                    "</p>" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        }
        catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public void sendMailResetPassword(String email, String code) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            String htmlContent;
            htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Distant Class</title>\n" +
                    "    <style>\n" +
                    "        body {\n" +
                    "            font-family: Arial, sans-serif;\n" +
                    "            background-color: #f4f4f4;\n" +
                    "            margin: 0;\n" +
                    "            padding: 0;\n" +
                    "        }\n" +
                    "        .container {\n" +
                    "            max-width: 600px;\n" +
                    "            margin: 0 auto;\n" +
                    "            background-color: #ffffff;\n" +
                    "            padding: 20px;\n" +
                    "            border-radius: 5px;\n" +
                    "            box-shadow: 0 0 10px rgba(0,0,0,0.1);\n" +
                    "        }\n" +
                    "        h1 {\n" +
                    "            color: #333;\n" +
                    "            text-align: center;\n" +
                    "        }\n" +
                    "        p {\n" +
                    "            color: #555;\n" +
                    "            font-size: 15px;\n" +
                    "        }\n" +
                    "        .btn {\n" +
                    "            background-color: #007bff;\n" +
                    "            color: #fff;\n" +
                    "            text-decoration: none;\n" +
                    "            padding: 10px 20px;\n" +
                    "            border-radius: 5px;\n" +
                    "            display: inline-block;\n" +
                    "        }\n" +
                    "        .btn:hover {\n" +
                    "            background-color: #0056b3;\n" +
                    "        }\n" +
                    "    </style>\n" +
                    "<link rel=\"icon\" type=\"image/png\" href=\"images/logo.png\">"+
                    "</head>\n" +
                    "<body>\n" +
                    "    <div class=\"container\">\n" +
                    "        <div style=\"display: flex\">\n" +
                    "            <img\n" +
                    "                style=\"margin: auto; display: block; height: 60px;\"\n" +
                    "                src='cid:logo'\n" +
                    "                alt=\"Distant Class\"\n" +
                    "            />\n" +
                    "        </div>" +
                    "        <h1>Password Recovery Code\n</h1>\n" +
                    "        <p>Hello,</p>\n" +
                    "        <p>You are receiving this email because we received a request to reset the password for your account.</p>\n" +
                    " <div style=\"background-color:#ebebeb;color:#333;font-size:40px;letter-spacing:8px;padding:16px;text-align:center\">" + code + "</div>" +
                    "        <p>This verification code will expire after 48 hours.</p>\n" +
                    "        <p><strong>If you did not request this code</strong>, please disregard this message.</p>\n" +
                    "        <p>Best regards,</p>\n" +
                    "        <p>The <strong>Distant Class</strong> Development Team</p>\n" +
                    "<p style=\"Margin:0;Margin-bottom:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;margin:0;margin-bottom:10px;padding:0;text-align:left;color:#757575\">" +
                    "<i>This is an automatically generated email. Please do not reply to this email.</i>" +
                    "</p>" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";
            mimeMessageHelper.setFrom(from, "Distant Class");
            mimeMessageHelper.setSubject("Request password recovery Distant Class");
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setText(htmlContent, true);
            mimeMessageHelper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
            mailSender.send(mimeMessage);
        }
        catch (Exception ex) {
            log.error(ex.getMessage());
        }
    }

}
