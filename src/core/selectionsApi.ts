import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export const SelectionsApi = ({model, app, log}: any) => {
  const eventEmitter = new EventEmitter();
  let active = false;

  return {
    eventEmitter,
    addListener(topic: string, listener: () => void) {
      eventEmitter.addListener(topic, listener);
    },
    begin: async (path: string) => {
      let abort = false;
      try {
        await model.beginSelections(path);
        active = true;
        eventEmitter.emit('activated');
      } catch (err: any) {
        if (err.code === 6003) {
          abort = true;
        }
      }

      // retry
      if (abort) {
        try {
          await app.abortModal(true);
          await model.beginSelections(path);
          active = true;
          eventEmitter.emit('activated', model);
        } catch (error) {
          log.error('Error beginning selections', error);
        }
      }
    },
    clear: async () => {
      try {
        eventEmitter.emit('cleared');
        await model.resetMadeSelections();
      } catch (e) {
        log.error('Failed to clear', e);
      }
    },
    confirm: () => {
      eventEmitter.emit('confirmed');
      model
        .endSelections(true)
        .then((_e: any) => {
          active = false;
        })
        .catch((e: any) => {
          log.error('error confirming selection', e);
        });
      eventEmitter.emit('deactivated');
    },
    cancel: () => {
      eventEmitter.emit('canceled');
      model
        .endSelections(false)
        .then((_e: any) => {
          active = false;
        })
        .catch((e: any) => {
          log.error('error cancelling selection', e);
        });
      eventEmitter.emit('deactivated');
    },
    select: (s: any) => {
      model[s.method](...s.params).catch((e: any) => {
        if (e.code === 6003) {
          model[s.method](...s.params).catch((error: any) => {
            log.error('error during selecting', error);
          });
        }
      });
    },
    canClear: () => {},
    canConfirm: () => {},
    canCancel: () => {},
    isActive: () => {
      return active;
    },
    isModal: () => active,
    goModal: async () => {
      active = false;
      return app.abortModal(true);
    },
    noModal: () => {
      model
        .endSelections(true)
        .then((_e: any) => {
          active = false;
        })
        .catch((e: any) => {
          log.error('error while going no modal', e);
        });
      eventEmitter.emit('deactivated');
    },
    destroy: () => {
      eventEmitter.removeAllListeners();
    },
    on: (event: any, func: () => void) => {
      eventEmitter.addListener(event, func);
    },
  };
};
