package com.dreamchasers.recoverbe.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public Boolean sendCode(String to, String code) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(from, "Dream Chasers");
            helper.setTo(to);
            helper.setSubject("Xác nhận tài khoản Dream Chasers");
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
                    "            text-align: center" +
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
                    "                alt=\"Dream Chasers\"\n" +
                    "            />\n" +
                    "        </div>" +
                    "        <h1 >Mã xác nhận đăng kí tài khoản\n</h1>\n" +
                    "        <p>Xin chào,</p>\n" +
                    "        <p>Để xác minh tài khoản của bạn, hãy nhập mã này vào Dream chasers:</p>\n" +
                    " <div style=\"background-color:#ebebeb;color:#333;font-size:40px;letter-spacing:8px;padding:16px;text-align:center\">" + code + "</div>" +
                    "        <p>Mã xác minh sẽ hết hạn sau 48 giờ.</p>\n" +
                    "        <p><strong>Nếu bạn không yêu cầu mã này</strong>, vui lòng bỏ qua tin nhắn này.</p>\n" +
                    "        <p>Trân trọng,</p>\n" +
                    "        <p>Đội ngũ phát triển <strong>Dream Chasers</strong></p>\n" +
                    "<p style=\"Margin:0;Margin-bottom:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;margin:0;margin-bottom:10px;padding:0;text-align:left;color:#757575\">" +
                    "<i>Đây là email được tạo tự động. Vui lòng không trả lời thư này.</i>" +
                    "</p>" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            return true;
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

    public boolean sendMailResetPassword(String email, String code) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            String htmlContent;
            htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Dream Chasers</title>\n" +
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
                    "           text-align: center\n"+
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
                    "                alt=\"Dream Chasers\"\n" +
                    "            />\n" +
                    "        </div>" +
                    "        <h1>Mã khôi phục mật khẩu\n</h1>\n" +
                    "        <p>Xin chào,</p>\n" +
                    "        <p>Bạn nhân được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>\n" +
                    " <div style=\"background-color:#ebebeb;color:#333;font-size:40px;letter-spacing:8px;padding:16px;text-align:center\">" + code + "</div>" +
                    "        <p>Mã xác minh sẽ hết hạn sau 48 giờ.</p>\n" +
                    "        <p><strong>Nếu bạn không yêu cầu mã này</strong>, vui lòng bỏ qua tin nhắn này.</p>\n" +
                    "        <p>Trân trọng,</p>\n" +
                    "        <p>Đội ngũ phát triển <strong>Dream Chasers</strong></p>\n" +
                    "<p style=\"Margin:0;Margin-bottom:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;margin:0;margin-bottom:10px;padding:0;text-align:left;color:#757575\">" +
                    "<i>Đây là email được tạo tự động. Vui lòng không trả lời thư này.</i>" +
                    "</p>" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";;
            mimeMessageHelper.setFrom(from, "Dream Chasers");
            mimeMessageHelper.setSubject("Yêu cầu khôi phục mật khẩu Dream Chasers");
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setText(htmlContent, true);
            mimeMessageHelper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
            mailSender.send(mimeMessage);
        }
        catch (Exception ex) {
            log.error(ex.getMessage());
            return false;
        }
        return true;
    }

}
