import { Link } from "react-router-dom";
import { Upload, Search, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { diseases } from "@/lib/diseases";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, title: "Upload Image", desc: "Take a photo of the affected skin area and upload it." },
  { icon: Activity, title: "Answer Questions", desc: "Respond to 10 diagnostic questions to assess severity." },
  { icon: Search, title: "Get Results", desc: "Receive a possible diagnosis and find nearby hospitals." },
];

const categoryColors: Record<string, string> = {
  bacterial: "bg-destructive/10 text-destructive",
  fungal: "bg-primary/10 text-primary",
  viral: "bg-accent text-accent-foreground",
  parasitic: "bg-accent text-accent-foreground",
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              AI-Powered Skin Analysis
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Detect Skin Diseases
              <br />
              <span className="text-primary">Early & Accurately</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Upload an image of your skin condition and get an instant preliminary analysis
              with severity assessment and nearby hospital recommendations.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/upload">
                Start Detection <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Step {i + 1}</div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases we detect */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Conditions We Detect</h2>
          <p className="text-center text-muted-foreground mb-10">
            Our system can identify the following skin conditions
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {diseases.map((d) => (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4">
                  <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mb-2 ${categoryColors[d.category]}`}>
                    {d.category}
                  </span>
                  <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">Upload an image and get your preliminary analysis in minutes.</p>
          <Button asChild size="lg">
            <Link to="/upload">Go to Upload Page</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
