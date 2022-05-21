import {useCallback, useEffect, useState} from 'react';
const schema = require('enigma.js/schemas/12.612.0.json');
const enigma = require('enigma.js');
const SessionUtilities = require('enigma.js/sense-utilities');

export type ConnectionType = {
  tenantDomain: string;
  appId: string;
  apiKey: string;
  modelId: string;
};

export type ConnectionStatusType = {
  app: any;
  status: string;
  message?: string;
  model: any;
};

const useConnectTopApp = ({tenantDomain, appId, apiKey, modelId}: ConnectionType) => {
  const [connection, setConnection] = useState<ConnectionStatusType>({
    status: 'idle',
    app: undefined,
    model: undefined,
  });

  const doConnect = useCallback(async () => {
    try {
      setConnection(prv => ({...prv, status: 'Connecting...'}));
      const port = 443;
      const ttl = 3600000;
      const host = tenantDomain;

      const url = SessionUtilities.buildUrl({
        host,
        port,
        secure: true,
        ttl,
        route: `app/${appId}`,
      });
      const headers = apiKey
        ? {headers: {Authorization: `Bearer ${apiKey}`}}
        : {};
      const connecticonfig = {
        schema,
        url: encodeURI(url),
        createSocket: (_url: any) => new WebSocket(_url, null, headers),
      };
      const globalSession = enigma.create(connecticonfig);
      const session = await globalSession.open();
      const app = await session.openDoc(appId);
      const props = await app.getAppProperties();
      const model = await app.getObject(modelId);
      setConnection({
        app,
        status: 'Connected',
        message: `${props.qTitle}`,
        model,
      });
    } catch (error) {
      console.log('error', error);
      setConnection({
        app: undefined,
        status: `Error: ${error?.message}`,
        model: undefined,
      });
    }
  }, [apiKey, appId, modelId, tenantDomain]);

  useEffect(() => {
    doConnect();
  }, [doConnect]);

  return connection;
};

export default useConnectTopApp;
