import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export const SelectionsApi = ({model, app, log}) => {
  const eventEmitter = new EventEmitter();
  let active = false;

  return {
    eventEmitter,
    addListener(topic, listener) {
      eventEmitter.addListener(topic, listener);
    },
    begin: async (path) => {
      let abort = false;
      try {
        await model.beginSelections(path);
        active = true;
        eventEmitter.emit('activated');
      } catch (err) {
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
          eventEmitter.emit('activated');
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
        .then((_e) => {
          active = false;
        })
        .catch((e) => {
          log.error('error confirming selection', e);
        });
      eventEmitter.emit('deactivated');
    },
    cancel: () => {
      eventEmitter.emit('canceled');
      model
        .endSelections(false)
        .then((_e) => {
          active = false;
        })
        .catch((e) => {
          log.error('error cancelling selection', e);
        });
      eventEmitter.emit('deactivated');
    },
    select: (s) => {
      model[s.method](...s.params).catch((e) => {
        if (e.code === 6003) {
          model[s.method](...s.params).catch((error) => {
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
        .then((_e) => {
          active = false;
        })
        .catch((e) => {
          log.error('error while going no modal', e);
        });
      eventEmitter.emit('deactivated');
    },
    destroy: () => {
      eventEmitter.removeAllListeners();
    },
    on: (event, func) => {
      eventEmitter.addListener(event, func);
    },
  };
};
