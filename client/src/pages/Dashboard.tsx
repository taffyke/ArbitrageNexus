import { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import NewsTicker from "@/components/dashboard/NewsTicker";
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | ArbitragePro</title>
        <meta name="description" content="Monitor your arbitrage activities and market trends with real-time data and analytics." />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-hidden flex flex-col">
            <DashboardOverview />
          </main>
        </div>
      </div>
    </>
  );
}
