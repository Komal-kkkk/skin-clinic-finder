import { Card, CardContent } from "@/components/ui/card";
import { Shield, Brain, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "Symptom-Based Analysis", desc: "Our diagnostic questionnaire assesses severity using clinically-informed questions." },
  { icon: Shield, title: "8 Conditions Covered", desc: "From bacterial infections like cellulitis to viral conditions like shingles." },
  { icon: MapPin, title: "Hospital Locator", desc: "Find nearby hospitals and dermatologists based on your location." },
  { icon: Users, title: "Educational Purpose", desc: "Designed to raise awareness — always consult a medical professional." },
];

const About = () => (
  <div className="min-h-screen">
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About DermaScan</h1>
          <p className="text-lg text-muted-foreground">
            DermaScan is an educational skin disease detection tool that helps users identify
            potential skin conditions and assess their severity through a guided diagnostic process.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <f.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="font-bold text-lg mb-2">⚕️ Important Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DermaScan is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment.
              The analysis provided is based on symptom-matching algorithms and should be used for educational
              and informational purposes only. Always seek the advice of a qualified healthcare provider
              with any questions you may have regarding a medical condition.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
);

export default About;
