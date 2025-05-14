import { Link } from "wouter";
import { Twitter, Github, MessageSquareLock, MessageCircleCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/">
            <a className="text-accent font-bold text-2xl mb-4 block">ArbitragePro</a>
          </Link>
          <p className="text-muted-foreground">The ultimate crypto arbitrage platform for professional traders.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#features" className="hover:text-accent">Features</a></li>
            <li><a href="#" className="hover:text-accent">Pricing</a></li>
            <li><a href="#" className="hover:text-accent">Testimonials</a></li>
            <li><a href="#" className="hover:text-accent">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#" className="hover:text-accent">About Us</a></li>
            <li><a href="#" className="hover:text-accent">Careers</a></li>
            <li><a href="#" className="hover:text-accent">Blog</a></li>
            <li><a href="#" className="hover:text-accent">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <div className="flex space-x-4 text-muted-foreground text-xl">
            <a href="#" className="hover:text-accent">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-accent">
              <MessageCircleCode className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-accent">
              <MessageSquareLock className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-accent">
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-muted-foreground text-sm flex flex-col md:flex-row justify-between">
        <div>© 2023 ArbitragePro. All rights reserved.</div>
        <div className="mt-4 md:mt-0">
          <a href="#" className="hover:text-accent mr-6">Privacy Policy</a>
          <a href="#" className="hover:text-accent">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
