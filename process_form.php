<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Helper to safely get and sanitize fields
    function get_field($name, $default = '') {
        return htmlspecialchars(trim($_POST[$name] ?? $default));
    }

    // Initialize Uploads
    $uploadSuccess = "No file uploaded.";
    $uploadedFilePath = "";

    // Required fields
    $fullName = get_field('fullName');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = get_field('phone');
    $city = get_field('city');
    $goals = get_field('goals');
    $budget = get_field('budget');
    $timeline = get_field('timeline');
    $referenceLinks = get_field('referenceLinks');
    $referralName = get_field('referralName');
    $referralContact = get_field('referralContact');
    $inquiry = get_field('inquiry');

    // Optional fields
    $websiteType = get_field('websiteType');
    $packageSelect = get_field('packageSelect');

    $graphicType = get_field('graphicType');
    $graphicPackage = get_field('graphicPackage');
    $graphicDescription = get_field('graphicDescription');

    $socialService = get_field('socialService');
    $socialPackage = get_field('socialPackage');
    $socialPlatforms = get_field('socialPlatforms');

    $customOption = get_field('customOption');
    $customDescription = get_field('customDescription');

    // Validate required ones
    $errors = [];
    if (empty($fullName)) $errors[] = "Full name is required.";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
    if (empty($phone)) $errors[] = "Phone number is required.";
    if (empty($goals)) $errors[] = "Project goals are required.";
    if (empty($referralName) || empty($referralContact)) $errors[] = "Referral info is required.";

    // File upload handling (done before email in case of errors)
    if (isset($_FILES['fileUpload']) && $_FILES['fileUpload']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['fileUpload']['tmp_name'];
        $fileName = basename($_FILES['fileUpload']['name']);
        $fileSize = $_FILES['fileUpload']['size'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
        $maxFileSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($fileExt, $allowedExtensions)) {
            $errors[] = "Invalid file type. Allowed: " . implode(", ", $allowedExtensions);
        } elseif ($fileSize > $maxFileSize) {
            $errors[] = "File too large. Max 5MB allowed.";
        } else {
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $safeFileName = uniqid() . "_" . preg_replace("/[^a-zA-Z0-9\._-]/", "_", $fileName);
            $uploadedFilePath = $uploadDir . $safeFileName;

            if (move_uploaded_file($fileTmpPath, $uploadedFilePath)) {
                $uploadSuccess = "File uploaded successfully: $safeFileName";
            } else {
                $errors[] = "Failed to move uploaded file.";
            }
        }
    }

    // Stop early if any errors
    if (!empty($errors)) {
        echo json_encode(["status" => "error", "errors" => $errors]);
        exit;
    }

    // Email setup
    $to = "your@email.com"; // Replace this later
    $subject = "New Project Inquiry from $fullName";
    $headers = [
        "From: no-reply@slabbion.com", // Replace this later
        "Reply-To: $email",
        "Content-Type: text/plain; charset=UTF-8"
    ];

    // Compose the message body
    $message = "New Contact Submission:\n\n";
    $message .= "Full Name: $fullName\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "City: $city\n\n";

    if (!empty($websiteType)) {
        $message .= "--- Website Development ---\n";
        $message .= "Type: $websiteType\n";
        $message .= "Package: $packageSelect\n\n";
    }

    if (!empty($graphicType)) {
        $message .= "--- Graphic Design ---\n";
        $message .= "Service: $graphicType\n";
        $message .= "Package: $graphicPackage\n";
        $message .= "Details: $graphicDescription\n\n";
    }

    if (!empty($socialService)) {
        $message .= "--- Social Media ---\n";
        $message .= "Service: $socialService\n";
        $message .= "Package: $socialPackage\n";
        $message .= "Platforms: $socialPlatforms\n\n";
    }

    if (!empty($customOption)) {
        $message .= "--- Custom Solution ---\n";
        $message .= "Option: $customOption\n";
        $message .= "Details: $customDescription\n\n";
    }

    $message .= "--- Project Overview ---\n";
    $message .= "Goals / Vision: $goals\n";
    $message .= "Estimated Budget: $budget\n";
    $message .= "Timeline: $timeline\n";
    $message .= "Reference Links: $referenceLinks\n\n";

    $message .= "--- Referral ---\n";
    $message .= "Referral Name: $referralName\n";
    $message .= "Referral Contact: $referralContact\n\n";

    $message .= "--- Other Notes ---\n";
    $message .= "$inquiry\n\n";

    if ($uploadedFilePath) {
        $message .= "--- Uploaded File ---\n";
        $message .= "File: " . basename($uploadedFilePath) . "\n";
    }

    // Send the email
    $sent = mail($to, $subject, $message, implode("\r\n", $headers));

    // Final response
    echo json_encode([
        "status" => $sent ? "success" : "error",
        "message" => $sent ? "Your request has been sent successfully!" : "Sorry, email failed to send. Try again later."
    ]);
}
?>
