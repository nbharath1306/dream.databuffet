/**
 * Email Template for Post-Application Follow-up
 * 
 * Use this template in your email automation tool (Mailchimp, ConvertKit, Resend, etc.)
 * when a candidate views the Verdict but doesn't complete payment within 1 hour.
 * 
 * Variables to replace:
 * - {{name}} - Candidate's name
 * - {{failure_reason}} - Their selected failure reason
 * - {{location}} - Their location
 * - {{price}} - Their specific tier price
 * - {{payment_link}} - Stripe/Razorpay checkout link
 */

export const EMAIL_TEMPLATE = {
  subject: "Your Protocol Analysis [CONFIDENTIAL]",
  
  // Plain text version
  plainText: `To: {{name}}
From: The Protocol (Automated System)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: PENDING

We reviewed your application data.

You selected "{{failure_reason}}" as your primary bottleneck.

Most candidates try to fix this by watching more tutorials. That is why they fail.

The Protocol is not a tutorial. It is a correction.

Based on your location ({{location}}), you have been approved for the Emerging Market Tier. This spot is reserved for 24 hours.

→ Complete Your Enrollment: {{payment_link}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System generated. Do not reply.
`,

  // HTML version
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Protocol Analysis</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 20px; color: #f59e0b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
                      ⚠️ Status: PENDING
                    </span>
                  </td>
                  <td align="right" style="color: rgba(255,255,255,0.3); font-size: 11px;">
                    ID: {{candidate_id}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">
                To: {{name}}
              </p>
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0 0 32px 0;">
                From: The Protocol (Automated System)
              </p>
              
              <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                We reviewed your application data.
              </p>
              
              <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                You selected <span style="color: #f59e0b; font-weight: 600;">"{{failure_reason}}"</span> as your primary bottleneck.
              </p>
              
              <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                Most candidates try to fix this by watching more tutorials.<br>
                <span style="color: #ef4444;">That is why they fail.</span>
              </p>
              
              <div style="background-color: rgba(255,255,255,0.02); border-left: 2px solid rgba(255,255,255,0.2); padding: 16px 20px; margin: 32px 0;">
                <p style="color: #fff; font-size: 16px; font-weight: 500; margin: 0; line-height: 1.6;">
                  The Protocol is not a tutorial.<br>
                  It is a <span style="color: #10b981;">correction</span>.
                </p>
              </div>
              
              <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
                Based on your location (<strong style="color: #fff;">{{location}}</strong>), you have been approved for the <span style="color: #10b981;">Emerging Market Tier</span>.
              </p>
              
              <div style="background-color: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 16px; margin: 0 0 32px 0; text-align: center;">
                <p style="color: #f59e0b; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                  ⏰ This spot is reserved for 24 hours
                </p>
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{payment_link}}" style="display: inline-block; background-color: #fff; color: #000; padding: 16px 48px; font-size: 14px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
                      Complete Your Enrollment →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="color: rgba(255,255,255,0.2); font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">
                System generated. Do not reply.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
};

// Helper to generate personalized email
export function generateFollowUpEmail(data: {
  name: string;
  email: string;
  failureReason: string;
  location: string;
  price: number;
  paymentLink: string;
}) {
  const candidateId = `${data.email.split("@")[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  
  // Map failure reason codes to readable text
  const failureReasonMap: Record<string, string> = {
    interviews: "I freeze in interviews",
    resume: "My resume gets ignored",
    experience: "I don't have enough experience",
    networking: "I don't know the right people",
    skills: "I'm not sure what to learn",
    confidence: "I don't feel qualified",
    applications: "I apply but never hear back",
  };
  
  const readableFailure = failureReasonMap[data.failureReason] || data.failureReason;
  
  return {
    to: data.email,
    subject: EMAIL_TEMPLATE.subject,
    text: EMAIL_TEMPLATE.plainText
      .replace(/\{\{name\}\}/g, data.name)
      .replace(/\{\{failure_reason\}\}/g, readableFailure)
      .replace(/\{\{location\}\}/g, data.location)
      .replace(/\{\{payment_link\}\}/g, data.paymentLink),
    html: EMAIL_TEMPLATE.html
      .replace(/\{\{name\}\}/g, data.name)
      .replace(/\{\{candidate_id\}\}/g, candidateId)
      .replace(/\{\{failure_reason\}\}/g, readableFailure)
      .replace(/\{\{location\}\}/g, data.location)
      .replace(/\{\{payment_link\}\}/g, data.paymentLink),
  };
}

// Testimonial data for use in emails and components
export const TESTIMONIAL_DATA = [
  {
    id: "akhil",
    name: "Akhil R.",
    role: "Data Engineer @ Microsoft",
    previousSituation: "Fresher, no experience",
    quote: "I didn't need a degree. I needed the Protocol.",
    shortQuote: "The Protocol > 4 years of tutorials",
    linkedIn: "#",
  },
  {
    id: "anuj",
    name: "Anuj K.",
    role: "ML Engineer @ Amazon",
    previousSituation: "5 months unemployed",
    quote: "5 months unemployed. 3 weeks after Protocol: $180K offer.",
    shortQuote: "5 months stuck → $180K in 3 weeks",
    linkedIn: "#",
  },
  {
    id: "aryan",
    name: "Aryan S.",
    role: "Staff Engineer @ Stripe",
    previousSituation: "Failed 5 interviews",
    quote: "I failed 5 times. The Protocol fixed my resume in 2 days.",
    shortQuote: "From 5 rejections to Staff Engineer",
    linkedIn: "#",
  },
];
