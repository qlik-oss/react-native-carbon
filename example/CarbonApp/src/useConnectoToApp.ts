import {useAtomValue} from 'jotai';
import {useCallback, useEffect, useState} from 'react';
import {settingsAtom} from './settingsAtoms';
const schema = require('enigma.js/schemas/12.612.0.json');
const enigma = require('enigma.js');
const SessionUtilities = require('enigma.js/sense-utilities');

export type Connection = {
  app: any;
  error: any;
  model: any;
  layout: any;
};

const useConnectToApp = () => {
  const settings = useAtomValue(settingsAtom);
  const [connection, setConnection] = useState<Connection | undefined>(
    undefined,
  );

  const doOpenApp = useCallback(async () => {
    let app;
    let model;
    let layout;
    let error;
    try {
      if (settings) {
        const port = 443;
        const ttl = 3600000;
        const host = settings.baseUrl;

        const url = SessionUtilities.buildUrl({
          host,
          port,
          secure: true,
          ttl,
          route: `app/${settings.appId}`,
        });
        const headers = settings.apiKey
          ? {headers: {Authorization: `Bearer ${settings?.apiKey}`}}
          : {};
        const connecticonfig = {
          schema,
          url: encodeURI(url),
          createSocket: (_url: any) => new WebSocket(_url, null, headers),
        };
        const globalSession = enigma.create(connecticonfig);
        const session = await globalSession.open();
        app = await session.openDoc(settings?.appId);
        model = await app.getObject(settings.visId);
        layout = await model.getLayout();
      }
    } catch (e) {
      error = e;
      console.error('Failed to open app', JSON.stringify(error), e);
    }

    setConnection({app, error, model, layout});
  }, [settings]);

  useEffect(() => {
    doOpenApp();
  }, [doOpenApp, settings]);
  return connection;
};

export default useConnectToApp;
