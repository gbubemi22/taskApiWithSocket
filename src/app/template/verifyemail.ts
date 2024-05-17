export const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="text-align: center;">Email Verification</h2>
    <p>Hello,</p>
    <p>Your verification code is: <strong>{{token}}</strong></p>
    <p>Please use this code to verify your email.</p>
    <p>If you did not request this verification, you can safely ignore this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
`;