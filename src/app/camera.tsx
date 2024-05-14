"use client";
import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  createContext,
} from "react";
import Webcam from "react-webcam";

import DrawIO from "./drawio";

type CameraProps = {
  apiKey: string;
};

import GraphContext from "./graph-context";
import { uploadToOpenAI } from "./openai";

function Camera({ apiKey }: CameraProps) {
  const [img, setImg] = useState<string | null>(null);
  const [mirrored, setMirrored] = useState(false);
  const [graph, setGraph] = useState("");
  const webcamRef = useRef<Webcam>(null);

  const resetUI = useCallback(() => {
    setGraph("");
    setImg(null);
  }, []);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImg(imageSrc);
      const graph = await uploadToOpenAI(imageSrc, apiKey);
      setGraph(graph);
    }
  }, [webcamRef, apiKey]);

  if (graph) {
    return (
      <div className="container">
        <GraphContext.Provider value={{ resetUI }}>
          <DrawIO graph={graph} />
        </GraphContext.Provider>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-start">
        <h1 className="text-4xl font-bold text-blue-600 mb-5">DIAGRAMMER</h1>
        {img === null ? (
          <>
            <div className="w-600 h-480 bg-white shadow-lg rounded-lg">
              <Webcam
                width={600}
                height={480}
                ref={webcamRef}
                mirrored={mirrored}
                videoConstraints={{ width: 600, height: 480 }}
                screenshotFormat="image/jpeg"
                minScreenshotWidth={600}
                minScreenshotHeight={480}
              />
            </div>
            <div className="flex mt-4 space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mirror"
                  className="w-4 h-4 border-gray-300 rounded focus:ring-indigo-500"
                  checked={mirrored}
                  onChange={() => setMirrored(!mirrored)}
                />
                <label htmlFor="mirror" className="ml-2 text-sm text-gray-700">
                  Mirror camera
                </label>
              </div>
              <button
                className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => capture()}
              >
                Convert
              </button>
            </div>
          </>
        ) : (
          <>
            <img width="600" height="480" src={img} alt="screenshot" />
            <div className="text-lg text-gray-700 mt-4">
              GPT-4o is crunching numbers...
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Camera;
