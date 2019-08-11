import { inject } from './helpers/index';

export default (options, storeInstance) => {
  let {
    attached: rootAttached = () => { },
    detached: rootDetached = () => { },
    lifetimes: { attached = () => { }, detached = () => {} },
    store = { global: [] },
  } = options;

  Object.assign(options, {
    lifetimes: {
      async attached(...args) {
        inject(storeInstance, store, this);

        await attached.apply(this, ...args);

        rootAttached.apply(this);
      },
      async detached(...args) {
        await detached.apply(this, ...args);

        await rootDetached.apply(this);

        storeInstance.logout(this);
      }
    },
    attached() {},
    detached() {},
    setState(...args) {
      storeInstance.set(...args);

      return this;
    },
    get store() {
      return storeInstance;      
    }
  });

  return Component(options);
};
