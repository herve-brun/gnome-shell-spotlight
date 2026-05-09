// Tests pour les fonctions utilitaires
const assert = require('assert');

describe('Utility Functions', () => {
  test('should calculate radius squared correctly', () => {
    const radius = 0.2;
    const radiusSq = radius * radius;
    assert.strictEqual(radiusSq, 0.04);
  });

  test('should calculate falloff correctly', () => {
    const radius = 0.2;
    const falloffFactor = 0.81;
    const falloff = radius * radius * falloffFactor;
    assert.strictEqual(falloff, 0.0324);
  });

  test('should convert RGB to normalized values', () => {
    const color = [255, 127, 0];
    const normalized = color.map(c => c / 255);
    assert.deepStrictEqual(normalized, [1.0, 0.4980392156862745, 0.0]);
  });

  test('should convert normalized RGB to 0-255 range', () => {
    const color = [1.0, 0.5, 0.0];
    const converted = color.map(c => c * 255);
    assert.deepStrictEqual(converted, [255, 127.5, 0.0]);
  });

  test('should clamp value between min and max', () => {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    assert.strictEqual(clamp(0.5, 0.0, 1.0), 0.5);
    assert.strictEqual(clamp(-0.1, 0.0, 1.0), 0.0);
    assert.strictEqual(clamp(1.5, 0.0, 1.0), 1.0);
  });
});
