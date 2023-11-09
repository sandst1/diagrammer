import { useContext, useEffect, useMemo, useRef, useState } from "react";

import GraphContext from "./graph-context";

const editorURL =
  "https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&proto=json&saveAndExit=0";

type Props = {
  graph: string;
};

export default function DrawIO({ graph }: Props) {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const { resetUI } = useContext(GraphContext);

  useMemo(() => {
    const receive = (evt: any) => {
      if (iFrameRef.current) {
        if (evt.data.length > 0) {
          const msg = JSON.parse(evt.data);
          console.dir(msg);
          if (msg.event === "init") {
            iFrameRef.current.contentWindow?.postMessage(
              JSON.stringify({
                action: "load",
                autosave: 0,
                xml: graph,
              }),
              "*"
            );
          } else if (msg.event === "save") {
            var xmlBlob = new Blob([msg.xml], { type: "text/plain" });
            const link = document.createElement("a");
            link.setAttribute("href", window.URL.createObjectURL(xmlBlob));
            link.setAttribute("download", "diagram.drawio");
            link.click();
          } else if (msg.event === "exit") {
            resetUI?.();
          }
        }
      }
    };

    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [graph, resetUI]);

  return (
    <div>
      <iframe
        ref={iFrameRef}
        src={editorURL}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
}
