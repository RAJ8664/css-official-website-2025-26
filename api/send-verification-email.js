// api/send-verification-email.js
const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Set CORS headers - important for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or your specific domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    console.log('📧 Received email verification request');
    
    // Parse request body
    const { email, verificationCode } = req.body;

    // Validate required fields
    if (!email || !verificationCode) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email and verification code are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    console.log(`📤 Sending verification email to: ${email}`);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CSS NIT Silchar <onboarding@resend.dev>', // Use your domain when verified
      to: [email],
      subject: 'Verify Your College Email - CSS NIT Silchar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    background-color: #f4f4f4; 
                    margin: 0; 
                    padding: 20px; 
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                }
                .header { 
                    background: linear-gradient(135deg, #000000, #021547); 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                    border-radius: 8px; 
                    margin-bottom: 20px; 
                }
                .code { 
                    font-size: 32px; 
                    font-weight: bold; 
                    text-align: center; 
                    color: #06b6d4; 
                    margin: 30px 0; 
                    padding: 15px; 
                    background: #f8fafc; 
                    border: 2px dashed #06b6d4; 
                    border-radius: 8px; 
                }
                .footer { 
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 1px solid #e2e8f0; 
                    color: #64748b; 
                    font-size: 14px; 
                    text-align: center; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 CSS NIT Silchar</h1>
                    <p>College Email Verification</p>
                </div>
                
                <h2>Hello!</h2>
                <p>Please use the verification code below to verify your college email address and access the CSS chat community.</p>
                
                <div class="code">${verificationCode}</div>
                
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Code expires in:</strong> 10 minutes</p>
                
                <p>If you didn't request this verification, please ignore this email.</p>
                
                <div class="footer">
                    <p>Computer Science Society<br>NIT Silchar</p>
                    <p>© 2024 CSS NIT Silchar. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return res.status(500).json({
        success: false,
        error: `Failed to send email: ${error.message}`
      });
    }

    console.log('✅ Email sent successfully to:', email);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
      email: email,
      code: verificationCode // For debugging, remove in production
    });

  } catch (error) {
    console.error('🚨 Unexpected error in API function:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
};