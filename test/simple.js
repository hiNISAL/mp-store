import store from '../index';

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const Component = {
  setData(opts) {
    for (const [k, v] of Object.entries(opts)) {
      this[k] = v;
    }
  }
};

const test1 = async () => {
  const Comp1 = Object.create(Component);
  const Comp2 = Object.create(Component);

  Comp1.name = 'xiaoming';
  Comp1.age = '10';
  Comp2.name = 'xiaohong';
  Comp2.age = '20';

  store.register({
    key: 'name',
    instance: Comp1,
    defaultValue: 'dd',
  });
  store.register('name', Comp2);

  store.register('age', Comp1);
  store.register('age', Comp2);

  store.name = '我是一个虚假的名字';
  store.age = '我是一个虚假的年龄';

  console.log(Comp1);
  console.log(Comp2);

  // -
  await sleep(500);

  console.log('注销Comp2');

  store.logout(Comp2);

  // -
  await sleep(500);
  console.log('修改store里的值');

  store.name = '我是二次修改';
  store.age = '我是二次修改的年龄';

  // -
  await sleep(500);

  console.log(Comp1);
  console.log(Comp2);

};

test1();

const test2 = async () => {
  const Comp3 = Object.create(Component);
  Comp3.ns = 'init ns';
  
  store.register({
    key: 'ns',
    instance: Comp3,
    nameSpace: 'ns',
  });

  store.set({
    key: 'ns_ns',
    value: 2,
  });

  console.log(Comp3);

  console.log(store.get('ns', 'ns'));
};

// test2();
