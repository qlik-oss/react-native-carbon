import { useEffect, useState } from "react";
import { createHyperCubeDef, ModelConfig } from "../core/createHyperCubeDef";

export const useModelFromId = (config: ModelConfig) => {
  const [model, setModel] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchModel() {
      try {
        const m = await config.app.getObject(config.id);
        if (mounted) {
          setModel(m);
        }
      } catch (error) {
        if (mounted) {
          setModel(undefined);
        }
      }
    }

    async function createSessionObject() {
      try {
        if (!config.type) {
          config.type = Math.random().toString(32).substring(8);
        }
        const hyperCupeDef = createHyperCubeDef(config);
        const object = await config.app.createSessionObject(hyperCupeDef);
        if (mounted) {
          setModel(object);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (config.app && config.id) {
      fetchModel();
    } else if (config.app && config.fields) {
      createSessionObject();
    }
    return () => {
      mounted = false;
    };
  }, [config]);
  return { model };
};
