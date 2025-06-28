"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X } from "lucide-react";

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      console.log("App installed successfully!");
    }
  };

  const handleIOSInstall = () => {
    setShowIOSInstructions(true);
  };

  const handleCloseIOSInstructions = () => {
    setShowIOSInstructions(false);
  };

  // Don't show anything if the app is already installed
  if (isInstalled) {
    return null;
  }

  // Show iOS instructions if user clicked install on iOS
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-amber-100/80 flex items-center justify-center p-4 z-[9999]">
        <div className="absolute top-4 right-4">
          <Button
            variant="default"
            size="icon"
            className="cursor-pointer hover:bg-amber-500 bg-amber-300"
            onClick={handleCloseIOSInstructions}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Installer PeeBuddy
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Suivez ces étapes pour installer l'application :
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <span className="bg-amber-100 text-amber-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                1
              </span>
              <p className="text-gray-700">
                Appuyez sur l'icône <strong>Partager</strong> dans Safari
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-amber-100 text-amber-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                2
              </span>
              <p className="text-gray-700">
                Sélectionnez <strong>"Sur l'écran d'accueil"</strong>
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="bg-amber-100 text-amber-300 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                3
              </span>
              <p className="text-gray-700">
                Appuyez sur <strong>"Ajouter"</strong>
              </p>
            </div>
          </div>

          <Button
            onClick={handleCloseIOSInstructions}
            className="w-full"
            variant="outline"
          >
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  // Show install button for Android/Chrome
  if (isInstallable && !isIOS) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleInstallClick}
          className="bg-amber-300 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Installer
        </Button>
      </div>
    );
  }

  // Show iOS install button
  if (isIOS && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleIOSInstall}
          className="bg-amber-300 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Installer
        </Button>
      </div>
    );
  }

  return null;
}
