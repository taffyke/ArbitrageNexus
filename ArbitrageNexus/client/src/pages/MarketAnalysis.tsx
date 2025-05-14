import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet } from "react-helmet";
import MarketAnalysisComponent from "@/components/market/MarketAnalysis";

export default function MarketAnalysis() {
  return (
    <>
      <Helmet>
        <title>Market Analysis | ArbitragePro</title>
        <meta name="description" content="Advanced tools to analyze crypto markets across exchanges for identifying arbitrage opportunities." />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-hidden flex flex-col">
            <MarketAnalysisComponent />
          </main>
        </div>
      </div>
    </>
  );
}
