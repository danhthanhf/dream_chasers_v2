package com.example.demo.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String from;

    public Boolean sendCode(String to, String code)  {
        try {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String htmlContent;
            htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <style>\n" +
                    "        /* CSS cho email */\n" +
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
//                    "        <a style = \" color: #fff;\" href=\"http://localhost:3000/login\" class=\"btn\">Đăng nhập vào Dolar Restaurant</a>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";
            helper.setFrom(from, "Dream Chasers");
            helper.setText(htmlContent, true);
            helper.setTo(to);
            helper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
            helper.setSubject("Yêu cầu xác minh email");
            javaMailSender.send(mimeMessage);
            return true;
        }
        catch(Exception e){
            System.out.println(e.getMessage());
            return false;
        }
    }

    public boolean sendMailResetPassword(String email, String code) {
        try {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        String htmlContent;
            htmlContent = "<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Dream Chasers</title>\n" +
                    "    <style>\n" +
                    "        /* CSS cho email */\n" +
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
//                    "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABuCAYAAAD/PJegAAALRElEQVR4Xu1b7Y0TyxJtiGBJAEwGSwaEQAZ3M4AMIAPIwJsBRABkAD+R+GEkAlgJEN/g5+O9tao9VdVTMx7bM/d1SUeeOV1d3V1nuns+dkvJ28kGZxssN3izwcUG64ZRgFwip8sN/imXuR7NFuUycBPssFiWy9wPNlwFT4sN3HBYQIPeM3KxwarYYA3Hwar0mI2npYk3RazKpTZVW5Qm3pSxKpWZiHUWDlypYVpYlWBPbDcs8wG0umaLYp0apo1FUbZ0HBqmjWX517CecmHD9IEXK9u98MwpbJgHzjZoy+eMsdxg+xKVCxrmAWjXXlLPGNDOkA3zgiEa5gVDNMwLhmiYFwzRMC8YomFeMETDvGCIhnnBEA3zgiEa5gVDNMwLhmiYFwwxe9y/f3/99OnT9Zs3b7bni8Vi/erVq/XDhw+3x+w/cxhidjg5ObkS7eLiYi22Wq225Xfv3r3iYBAWvqenpybWDGGIWQCinZ2drc/Pz6+Jpg0C3rhxwwioDT7L5XJ7AXAbM4EhJguIhmUQy2EkmjY9A//+/cvFxmYqpiEmBYj26NGjrWh9DYLcvHlzu+9BQEHGcIFgdj948GDbB+7XhGCIowMJf/LkySDRtMkMRLzfv3+nxfPs+fPn2yV7gjdBhjgKsGxBNCR9LEMs7IF37tzZCvjnz59eszAyXFgTEtMQB4N35zimaQF//fq18yz0DGJiiT+imIbYG+R2/9mzZ3sTTZsW8MePH1sRZRbuw470eGKI0YEk4u7uEKJpg4ByE/Pt27f1z58/r2bhvkQUQ9vYEjgXe4AhRsfjx495fAcxLeDXr1+3s3Afy2jNZDbiIua8jARDjAZ0GslDIo9hsoTevn17/eXLl/X379+3y+ghZqAY9kidD87RCDDEqMDSeSwTAXERaQGxDx7S5MXA5AWUDuJXEndMkyUUM/Dz58/XBDzUDIS9fv3a5GpEGGIniHg4xpuMYxoERD9wIX369Gl7I3MMAWF4buQ8ce4GwhCDoWcgNu99W9ddrQiIGQgBcSODO1FPwK5Yuxr6ol/J6Qt9RxhiEKRD0ik8E41tWIrwDIk9BcnomuGyB+I5EEuoPEp4eyBiYqbKF463b9+yy86Gx4qRRNMwxGBI55CEXQ0zQgt269YtM/iMgPIY0bWE8hcI2cPxMnssQTEmnoWcwwEwxGBIh5C4viaC4SqVGcbxpQ1pJysgZiAvoWxoUyeUk4tzfJbaVVB5uOf4O8AQgyCJ7TP7IsGyg8sKKHtg1xLK8bk/LDBWBQiKVeLDhw8cMrSR35saIg0eUPahHcLphEWCyUXhJRDICAg/PQOzS+gQ4OLNCIlPU/DX4+Kx9YAhekM6gNlUMy3cDh2+qp8RUC+hmT0wulj4XPMsQEZIWbKjuD1giBR0wziuPbTjbYwsGzpB3HmOycfMDREweozgGch986DHwOPBMYTEReuZfrjnuj1hiBS4wSiZEE/7cz0+Z3CCtH/UphgEhH+fGeiB2+Uy/csAj9iekHrWR/UTMERv1P7qK5uY6NeD1MsICH/vLrQmYNS2tOv1m/34HMDLDd1n6d+OMEQvoGPYlCOLBtPFMXS5HPcVMLOEeiJx+/qceS7nYwAXvPQdX/O1H/smYIgquGO4jY4My0bUoYjnMm9Qcp4REL59Z6AHTzDNcR8jXw3cF+ARRB6hJI7nW4EhquBO1WafvMDVneL63jEjKssICL/sDOQ+Ru1GffP8eezsw+cDYIhO6EZrL4H5zpMR8dnyjIB97kJZjK72ta+uU6sb8RyHyyowRAjuWO2LA141SR3+9ToY8QztkxEQ/kPehTJ0u9xP3fch49BLKPslYIgQ3AA24MiwtrO/F8cbvD736ggyAuoPul0z0GuL+8L9yPLRuNhH80kYIo1Xlb+cjq5or7NRxyNeyvoI2GcGZvrmQYvE51wWIeNDMEQakWFfRHnUmYjXZTJgHrg+zggIP+yBmIFdd6HcVg2RH/O1mF4ZnydgiE6gEQw4shcvXlz56Toch2NGPlFZHwH7zECG13YE9pVz5gXYn+VfCrhOEoYw4IA4xx4Xmff4oONwvKHICIi29J9U1ATU/eXfCNqPx6t9NC//Jsev1/TLBI5RgSEMvIDcuDY8G+IBH9/LuF5feG0LlxHQ2wMhnicgtxO178ETUkP+XKP2F+q4Kcy2p2AIAx0Ux7iCsoYbHfmzCB1rQEevAfWzAnqPEWzcv6GQ+rh4IRj+VwL9yBi2ngHtG+IavIDgur79RQZB5Ss8x/XgtS/ICChXf+ZBnuNn+iDARY1Vp49g2jArB/5TjCE6IQMaKqKY/B0M9oNM52X2wxfLTdffpeg9UO5Coz1Qln3EzqwS+j+tao9TGdtBPMAQvbCriNowEPlPWAxI/ioMbYDve2WzgLUZyIaLA23iQoFQIpj853C0j/U1xLl3757Jq6B2Ef0LQ4QBcCzQPmOKOKaxgLXnwGOYnnk86znHFRgiBW5oiiJ6e2C0hB7aRDzOIyPiFQzhBohmn8bURBQBM18jDmksnpdnzm0FhriGKKB35eB4SiLqJbTrQf5QxjcsXh65rAOGSMFrWI6nIiIERH+mMgOjGxZvkmiOywiGMIGY68JUZuKUBOSZNyIMYcBXA5/rX41jiwgBoy/yhzRPPC9fmTIHhkhBNxKJeOyZKDMw8/+B+zJ9w8J58n61H+c3gCFceIJF4PJjiRjdxHgvs/dh3nMeH+vzmk8FhrgGviL4atEcQ/PHEJEFPOQe6D0qROiTUweGcOEFzjSi6x1aRBFQ9sBDPUb0EU/nyfP3OIIh0vCCe5zmDykiz0At4L6Mb1j0BexNAvbr4hwYoopM0K6OYoB4MYwX1XhxDVEBfOzENzF8oQDwL1q7vDQWAeVV2tCbGPQDwAtu9A/9xKcs9BlfUjAGjEVeevOYOS/RebaMYIgU9BWlua4yPhffrjr4QAohkCQAScOXAiQRn3SQUHwlAJBoJBwCoi5m4MePH9fv3r1bv3//fv3y5cutP4RAXcRAPACx5UsIxOA+cb9qYD8eozd2rpOAIVLgztQ4ry5zHt91zsAzn/h5SdGc+OrYXnyvLoPb8WJ6Zd55rZ0AhkgjasjjuWNy7vlyuZcErqfFw7FXT3x0Ocfh8y6+y6fWZ+E8vgcMsROiDnm8x2XhJUbHk2MRS/tqRDE5LnOMiOcyL6acM5eEIQbB66Qc1zrNcaKyKIZweknkNnU5fvVs9WJpRH41XpdFcWp1e8IQo6DWQW9wXjmfewnwfr36zOPYE9I75nhROxkMqdMBQ4yCro7qpHKCOTl87MXm+lyGX75x4b3Sq+OhVhb5ZesMgCF2giTE63DES5n+ZZ6PPR/2jfoiHAvKfsxH5TUfPo+4HWCIURB1sovn8tq5V6ahb2DkV3ORgBzX84nA/RNEPiPAEKMgGgh33uMisC/Xk/PIT/ja0sl1PI5/deyuOnuAIQ4KTi6XaZ7LI1/x00Lx3SfH4vMsr8s5ruezBxjiIOCBRoPlc/bXPl1xmIsQxWY/r07kF/EjwBCjoTYoSWiUdE44+3TFZB/9HMh12NcrZ3C9Lr89whB7BYvSlQCvTNeLEMX16kbn3FftMyEY4ujgZNXOvWTLuex7kY/HaV9uR4PjHBHlwiFnj4kleV+AduWNU9AwD0C7cu4UNMwDyw3KmVPQMA/8s0E5Kf/RffD/ANBua+dOYcO0sSzKFo5Dw7SxKGTPinVqmCaglTGsp6tinRumhVVRex/bojQRp4xVcZZOttPSRJwiVuVSm5QtShNxSliVxMxjwzrbbmyOD2gQ7nkZW5T2nHho4MXKsgyYdTXDVXBWLsV8W9rbmzGBXCKny3KZ4/SM+x+ZTP2qney0rQAAAABJRU5ErkJggg==\" />"+
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
//                    "        <a style = \" color: #fff;\" href=\"http://localhost:3000/login\" class=\"btn\">Đăng nhập vào Dolar Restaurant</a>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>\n";;
                    mimeMessageHelper.setFrom(from, "Dream Chasers");
                    mimeMessageHelper.setSubject("Yêu cầu khôi phục mật khẩu Dream Chasers");
                    mimeMessageHelper.setTo(email);
                    mimeMessageHelper.setText(htmlContent, true);
                    mimeMessageHelper.addInline("logo", new ClassPathResource("/static/images/logo.png"));
                    javaMailSender.send(mimeMessage);
        }
        catch (Exception ex) {
            System.out.println(ex.getMessage());
            return false;
        }
        return true;
    }

}
