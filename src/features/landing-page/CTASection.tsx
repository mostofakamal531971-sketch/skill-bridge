import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[50px] p-12 text-center text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Ready to Master a New Skill?</h2>
        <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">Join Learnzilla today. Choose your role as a Student or Tutor and start your journey.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl h-16 px-10 text-lg">
            Register as Student
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-black rounded-2xl h-16 px-10 text-lg">
            Become a Tutor <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  </section>
);

export default CTASection;
