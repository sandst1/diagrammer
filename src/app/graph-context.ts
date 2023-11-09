import { createContext } from "react";

type GraphContextProps = {
  resetUI?: () => void;
};

const GraphContext = createContext<GraphContextProps>({});
export default GraphContext;
