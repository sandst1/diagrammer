"use client";
import Image from "next/image";
import Camera from "./camera";
import { useEffect, useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      const key = localStorage.getItem("OPENAI_API_KEY");
      if (key) {
        setApiKey(key);
      }
    }
  }, [apiKey]);

  const updateApiKey = (key: string) => {
    localStorage.setItem("OPENAI_API_KEY", key);
    setApiKey(key);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="container mx-auto px-4 py-8 text-center">
          {!cameraEnabled && (
            <>
              <h1 className="text-4xl font-bold text-blue-600 mb-5">
                DIAGRAMMER
              </h1>
              <h2 className="text-2xl font-bold">
                Bringing your papers into draw.io
              </h2>
              <p className="text-lg text-gray-700 mt-4">
                <br />
                To begin, please enter your OpenAI API Key. <br />
                It will be stored in the local storage of your browser.
              </p>
              <div className="flex items-center justify-center mt-8">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 mr-4 w-96"
                  placeholder="Please enter OpenAI API key"
                  value={apiKey}
                  onChange={(e) => updateApiKey(e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white rounded-lg px-6 py-2"
                  onClick={(e) => {
                    if (apiKey) {
                      setCameraEnabled(true);
                    }
                  }}
                >
                  OK
                </button>
              </div>
            </>
          )}

          {cameraEnabled && (
            <>
              <Camera apiKey={apiKey} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
