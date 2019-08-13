export const inject = (store, config, instance) => {
  if (Array.isArray(config)) {
    config = {
      global: config,
    };
  }

  for (const [k, v] of Object.entries(config)) {
    v.forEach((state) => {
      if (typeof state === 'string') {
        state = {
          key: state,
        };
      }

      state.instance = instance;
      state.nameSpace = k;

      store.register(state);
    });
  }
};
