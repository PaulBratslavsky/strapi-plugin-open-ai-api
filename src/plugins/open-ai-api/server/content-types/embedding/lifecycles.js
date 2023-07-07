module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    console.log('beforeCreate', event);
  },

  afterCreate(event) {
    const { result, params } = event;
    console.log('afterCreate', event);
    console.log('afterCreate', result, params);
  }
}
