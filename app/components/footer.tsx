
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Brain, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-7">
                <Image
                  src="https://cdn.abacus.ai/images/6d229b87-5c7f-4b45-9676-c5557063f842.png"
                  alt="Mr. RE:commerce"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">Mr. RE:commerce</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Banbrytande inom Consciousness as a Service. Vi skapar intelligent AI som förstår, känner och utvecklas.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="w-4 h-4" />
              <span>Pionjärer inom CaaS-teknologi</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hem
                </Link>
              </li>
              <li>
                <Link href="/consciousnesses" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI-Medvetanden
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Säkerhet
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Om Oss
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tjänster</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Interaktiv Demo
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">CaaS Integration</span>
              </li>
              <li>
                <span className="text-muted-foreground">AI Konsultation</span>
              </li>
              <li>
                <span className="text-muted-foreground">Säkerhetsanalys</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@mrrecommerce.se</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+46 8 123 456 78</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Stockholm, Sverige</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Mr. RE:commerce. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-6 text-sm mt-4 md:mt-0">
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
