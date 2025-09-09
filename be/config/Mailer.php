<?php
namespace Config;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    public static function send(string $toEmail, string $toName, string $subject, string $html): array {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['SMTP_HOST'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['SMTP_USER'];
            $mail->Password   = $_ENV['SMTP_PASS'];
            $mail->SMTPSecure = $_ENV['SMTP_SECURE'] ?? PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = (int)($_ENV['SMTP_PORT'] ?? 465);

            $mail->setFrom($_ENV['SMTP_FROM'], $_ENV['SMTP_FROM_NAME'] ?? 'App');
            $mail->addAddress($toEmail, $toName ?: $toEmail);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $html;
            $mail->AltBody = strip_tags($html);

            $mail->send();
            return [true, null];
        } catch (Exception $e) {
            return [false, $mail->ErrorInfo];  // 👈 trả về lỗi chi tiết
        }
    }
}
