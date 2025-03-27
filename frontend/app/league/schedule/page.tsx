"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLeagueStore } from '@/app/store/leagueStore';

export default function SchedulePage() {
  const { league, userTeam } = useLeagueStore();
  const router = useRouter();

  // Redirect if no league is loaded
  useEffect(() => {
    if (!league) {
      router.push('/');
    }
  }, [league, router]);

  if (!league) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{league.leagueName} Schedule</h1>
      
      {userTeam && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Your Team: {userTeam.city} {userTeam.name}</h2>
        </div>
      )}
      
    </div>
  );
} 