class MPStore {
  constructor() {
    this.data = {};
  }

  get(key, nameSpace) {
    if (nameSpace) {
      key = `${nameSpace}_${key}`;
    }

    return this[key];
  }

  set(key, value) {
    if (!value) {
      const { key: k, nameSpace, value: v } = key;

      value = v;

      key = nameSpace ? `${nameSpace}_${k}` : k;
    }

    this[key] = value;

    return this;
  }

  logout(instance, key, nameSpace) {
    // 给了key 给了nameSpace
    if (key && nameSpace) {
      // 容错
      if (!this.data[nameSpace]) return this;

      const { refs = [] } = this.data[nameSpace][key];

      refs.splice(refs.findIndex(ref => ref === instance), 1);

      return this;
    }

    // 给了key 没给nameSpace
    if (key && !nameSpace) {
      // 所有nameSpace下的这个key都删掉
      for (const nameSpaceValue of Object.values(this.data)) {
        if (!nameSpaceValue[key]) return this;
        
        const refs = nameSpaceValue[key].refs;
        
        refs.splice(refs.findIndex(ref => ref === instance), 1);
      }

      return this;
    }

    // 如果两个都没给 就全清理了
    for (const nameSpaceValue of Object.values(this.data)) {
      for (const [, { refs = [] }] of Object.entries(nameSpaceValue)) {
        refs.splice(refs.findIndex(ref => ref === instance), 1);
      }
    }

    return this;
  }

  register(key, instance) {
    let defaultValue = undefined;
    let beforeUpdate = () => {};
    let afterUpdate = () => {};
    let nameSpace = 'global';

    // 重载参数
    if (!instance) {
      beforeUpdate = key.beforeUpdate || beforeUpdate;
      afterUpdate = key.afterUpdate || afterUpdate;
      defaultValue = key.defaultValue;
      instance = key.instance || instance;
      nameSpace = key.nameSpace || nameSpace;
      key = key.key;
    }

    // 处理命名空间
    if (!this.data[nameSpace]) {
      this.data[nameSpace] = {};
    }

    const dataSet = this.data[nameSpace];

    const realKey = nameSpace === 'global' ? key : `${nameSpace}_${key}`;

    if (dataSet[key]) {
      if (!dataSet[key].refs.includes(instance)) {
        dataSet[key].refs.push(instance);
      }

      instance.setData({
        [realKey]: dataSet[key].value || defaultValue,
      });

      return;
    }

    Object.defineProperty(this, realKey, {
      get() {
        return dataSet[key].value;
      },
      set(value) {
        dataSet[key].refs.forEach((instance) => {
          if (instance.setData) {
            beforeUpdate(dataSet[key].value, value);

            dataSet[key].value = value;

            instance.setData({
              [realKey]: value,
            });

            afterUpdate(value);
          }
        });
      },
    });

    dataSet[key] = {
      refs: [instance],
      value: undefined,
    };

    this[realKey] = defaultValue;
  }
}

export const Store = MPStore;

const store = new MPStore();

export default store;
