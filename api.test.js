const test = require('./routes/datos');

test('datos', () => {
    expect(test.getEntitiesByRange(5, 8).then(console.log)).totoBe(3);
  });