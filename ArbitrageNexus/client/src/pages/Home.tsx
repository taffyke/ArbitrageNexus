import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>ArbitragePro - Advanced Crypto Arbitrage Platform</title>
        <meta name="description" content="Discover and capitalize on price discrepancies across multiple exchanges in real-time with our advanced crypto arbitrage platform." />
        <meta property="og:title" content="ArbitragePro - Advanced Crypto Arbitrage Platform" />
        <meta property="og:description" content="The ultimate platform for professional traders to find and execute profitable arbitrage opportunities across multiple crypto exchanges." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Features />
        <Cta />
        <Footer />
      </div>
    </>
  );
}
