"use client";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-white font-ruigslay">
              PLAYER VS MAP
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
              Push your limits on technical Trackmania maps
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {!isAuthenticated ? (
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8"
                onPress={login}
              >
                Login with Trackmania
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8"
                onPress={() => router.push("/mappacks/pvm")}
              >
                View Mappacks
              </Button>
            )}
            <Button
              size="lg"
              variant="bordered"
              className="border-zinc-700 text-white hover:bg-zinc-800 px-8"
              as="a"
              href="https://openplanet.dev/plugin/pvm"
              target="_blank"
            >
              Get Openplanet Plugin
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16 w-full">
            <Card className="bg-zinc-800 border border-zinc-700">
              <CardBody className="p-6 text-center space-y-3">
                <div className="text-4xl">🎯</div>
                <h3 className="text-xl font-bold text-white">Time Goals</h3>
                <p className="text-sm text-zinc-400">
                  Set personal records and achieve multiple time goals on every track
                </p>
              </CardBody>
            </Card>

            <Card className="bg-zinc-800 border border-zinc-700">
              <CardBody className="p-6 text-center space-y-3">
                <div className="text-4xl">🏆</div>
                <h3 className="text-xl font-bold text-white">Leaderboards</h3>
                <p className="text-sm text-zinc-400">
                  Compete globally and climb the ranks with point-based progression
                </p>
              </CardBody>
            </Card>

            <Card className="bg-zinc-800 border border-zinc-700">
              <CardBody className="p-6 text-center space-y-3">
                <div className="text-4xl">⭐</div>
                <h3 className="text-xl font-bold text-white">Tiered Maps</h3>
                <p className="text-sm text-zinc-400">
                  Progress through difficulty tiers from beginner to extreme tech
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="pt-16 space-y-6 w-full">
            <h2 className="text-3xl font-bold text-white font-ruigslay">HOW IT WORKS</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-800/50 border border-zinc-700">
                <CardBody className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <h4 className="text-lg font-semibold text-white">Install the Plugin</h4>
                  </div>
                  <p className="text-sm text-zinc-400 pl-11">
                    Download the PvM plugin from Openplanet to access all maps directly in-game
                  </p>
                </CardBody>
              </Card>

              <Card className="bg-zinc-800/50 border border-zinc-700">
                <CardBody className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h4 className="text-lg font-semibold text-white">Login & Track Progress</h4>
                  </div>
                  <p className="text-sm text-zinc-400 pl-11">
                    Sign in with your Trackmania account to save records and track achievements
                  </p>
                </CardBody>
              </Card>

              <Card className="bg-zinc-800/50 border border-zinc-700">
                <CardBody className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <h4 className="text-lg font-semibold text-white">Beat Time Goals</h4>
                  </div>
                  <p className="text-sm text-zinc-400 pl-11">
                    Each map has multiple time goals - beat them all to maximize your points
                  </p>
                </CardBody>
              </Card>

              <Card className="bg-zinc-800/50 border border-zinc-700">
                <CardBody className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <h4 className="text-lg font-semibold text-white">Climb the Ranks</h4>
                  </div>
                  <p className="text-sm text-zinc-400 pl-11">
                    Earn points for achievements and compete on the global leaderboard
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="pt-16 w-full">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <CardBody className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">Ready to Challenge Yourself?</h3>
                <p className="text-zinc-400">
                  Join the community and start your journey through technical Trackmania maps
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {!isAuthenticated ? (
                    <Button
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                      onPress={login}
                    >
                      Get Started
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                      onPress={() => router.push("/mappacks/pvm")}
                    >
                      Browse Maps
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="bordered"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                    as="a"
                    href="#"
                    target="_blank"
                  >
                    View Spreadsheet
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <footer className="pt-16 text-center text-sm text-zinc-600">
            <p>PvM is a community-driven project for Trackmania players</p>
          </footer>
        </div>
      </div>
    </div>
  );
}