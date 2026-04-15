import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using Learnzilla, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.`,
  },
  {
    title: "2. User Accounts",
    content: `You must create an account to use most features of Learnzilla. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration and keep your account information up to date.`,
  },
  {
    title: "3. User Roles",
    content: `Learnzilla supports three types of users: Students, Tutors, and Administrators. Each role has specific privileges and responsibilities. Students can browse tutors, book sessions, and leave reviews. Tutors can create profiles, set availability, and manage sessions. Misuse of role privileges may result in account suspension.`,
  },
  {
    title: "4. Booking & Payments",
    content: `All bookings are made through the Learnzilla platform. Payment is processed at the time of booking. Tutors set their own hourly rates. Learnzilla may charge a service fee on each transaction. All prices are displayed in USD unless otherwise specified.`,
  },
  {
    title: "5. Cancellation & Refund Policy",
    content: `Students may cancel a booking up to 24 hours before the scheduled session for a full refund. Cancellations within 24 hours may be subject to a cancellation fee. If a tutor cancels, the student receives a full refund automatically. We offer a satisfaction guarantee on first sessions.`,
  },
  {
    title: "6. Code of Conduct",
    content: `All users must treat others with respect and professionalism. Harassment, discrimination, fraud, or any form of abuse is strictly prohibited. Users must not share inappropriate content or use the platform for any illegal activities. Violations may result in immediate account termination.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on Learnzilla, including but not limited to text, graphics, logos, and software, is the property of Learnzilla or its content providers. You may not reproduce, distribute, or create derivative works from any content without our explicit written permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Learnzilla provides the platform "as is" and makes no warranties about the quality of tutoring services. We are not liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability shall not exceed the amount paid by you in the preceding 12 months.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the platform ceases immediately. Any provisions that by their nature should survive termination shall remain in effect.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of Learnzilla after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-6 bg-indigo-500/10 text-indigo-600 border-none font-bold px-4 py-1.5 rounded-full">
            <FileText className="w-3 h-3 mr-1" /> Legal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Terms of Service</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-card rounded-[32px] border border-border p-8 md:p-12 space-y-10">
          <p className="text-muted-foreground font-medium leading-relaxed">
            Welcome to Learnzilla. These Terms of Service govern your use of our platform
            and services. By using Learnzilla, you agree to comply with these terms.
          </p>

          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-black mb-4">{section.title}</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground font-medium">
              If you have questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@Learnzilla.com" className="text-indigo-600 font-bold hover:underline">
                legal@Learnzilla.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

