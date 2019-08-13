import { inject } from './helpers/index';

export default (options, storeInstance) => {
  let {
    onLoad = () => {},
    onUnload = () => {},
    store = { global: [] },
  } = options;

  Object.assign(options, {
    async onLoad(options) {
      inject(storeInstance, store, this);

      return await onLoad.call(this, options);
    },
    async onUnload(...args) {
      const res = await onUnload.apply(this, args);

      storeInstance.logout(this);

      return res;
    },
    setState(...args) {
      storeInstance.set(...args);

      return this;
    },
  });

  return Page(options);
};
