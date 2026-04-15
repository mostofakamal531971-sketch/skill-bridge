import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly, such as when you create an account, book a session, or contact us. This includes your name, email address, profile picture, payment information, and any content you submit through the platform. We also automatically collect usage data including IP addresses, browser type, device information, and pages visited.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use collected information to provide and improve our services, process transactions, send notifications about bookings, personalize your experience, and communicate with you about platform updates. We may also use aggregated data for analytics to improve the overall Learnzilla experience.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell your personal information to third parties. We may share information with tutors/students as needed for booking purposes, with service providers who assist in operating our platform, and when required by law or to protect the rights and safety of our users.`,
  },
  {
    title: "4. Data Security",
    content: `We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our users come from. You can control cookie preferences through your browser settings. Essential cookies are required for the platform to function properly.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, update, or delete your personal data at any time through your account settings. You can also request a copy of your data, object to certain processing activities, and withdraw consent where applicable. To exercise these rights, contact us at privacy@Learnzilla.com.`,
  },
  {
    title: "7. Children's Privacy",
    content: `Learnzilla is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover we have collected information from a child under 13, we will delete it immediately.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-6 bg-indigo-500/10 text-indigo-600 border-none font-bold px-4 py-1.5 rounded-full">
            <Shield className="w-3 h-3 mr-1" /> Legal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-card rounded-[32px] border border-border p-8 md:p-12 space-y-10">
          <p className="text-muted-foreground font-medium leading-relaxed">
            At Learnzilla, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our platform. Please read this
            policy carefully.
          </p>

          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-black mb-4">{section.title}</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground font-medium">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@Learnzilla.com" className="text-indigo-600 font-bold hover:underline">
                privacy@Learnzilla.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

