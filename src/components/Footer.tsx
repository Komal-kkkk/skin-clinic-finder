import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm">DermaScan</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Disclaimer: This tool is for educational purposes only and does not replace professional medical advice.
      </p>
    </div>
  </footer>
);

export default Footer;
