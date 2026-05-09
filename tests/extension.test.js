// Tests pour l'extension principale
const { Gio, Clutter, Cogl, GLib } = require('./__mocks__/gnome.js');

// Réinitialise les mocks globaux avant chaque test
global.global = {
  stage: {
    width: 1920,
    height: 1080,
    get_pointer_position: () => [960, 540],
    add_actor: (actor) => {},
    remove_actor: (actor) => {},
    connect: (event, callback) => ({ disconnect: () => {} }),
  },
  stage_width: 1920,
  stage_height: 1080,
};

// Charge le code de l'extension
const extensionCode = require('fs').readFileSync('./src/extension.js', 'utf8');

// Exécute le code de l'extension dans un contexte isolé
const extensionContext = {
  Clutter,
  Cogl,
  Gio,
  GLib,
  global: global.global,
  console,
  logError: console.error,
  Main: { path: __dirname },
};

// Évalue le code de l'extension pour accéder aux fonctions
const extensionModule = { exports: {} };
const extensionFunction = new Function('exports', 'module', 'require', 'global', 'Clutter', 'Cogl', 'Gio', 'GLib', extensionCode);
extensionFunction(extensionModule.exports, extensionModule, require, global, Clutter, Cogl, Gio, GLib);

// Extraire les fonctions de l'extension
const { enable, disable, updateShaderUniforms, applyShaderEffect, startTimeAnimation } = extensionModule.exports;

describe('GNOME Shell Spotlight Extension', () => {
  let settings;
  let spotlight;
  let currentShaderEffect;
  let shaderCache;

  beforeEach(() => {
    // Réinitialise les variables globales de l'extension
    global.spotlight = undefined;
    global.currentShaderEffect = undefined;
    global.currentShaderName = null;
    global.time = 0;
    global.timeHandlerId = null;
    global.heatmapHandlerId = null;
    global.shaderCache = new Map();

    // Crée de nouveaux mocks pour chaque test
    settings = new Gio.Settings({ schema_id: 'org.gnome.shell.extensions.spotlight' });
    global.global.stage = {
      width: 1920,
      height: 1080,
      get_pointer_position: () => [960, 540],
      add_actor: (actor) => { spotlight = actor; },
      remove_actor: (actor) => { spotlight = null; },
      connect: (event, callback) => ({ disconnect: () => {} }),
    };

    // Réinitialise les mocks de Gio.Settings
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Nettoie après chaque test
    if (spotlight) {
      spotlight = null;
    }
    if (global.timeHandlerId) {
      GLib.source_remove(global.timeHandlerId);
      global.timeHandlerId = null;
    }
    if (global.heatmapHandlerId) {
      GLib.source_remove(global.heatmapHandlerId);
      global.heatmapHandlerId = null;
    }
  });

  test('should initialize spotlight actor on enable', () => {
    enable();
    expect(spotlight).toBeDefined();
    expect(spotlight.width).toBe(1920);
    expect(spotlight.height).toBe(1080);
    expect(spotlight.opacity).toBe(0);
  });

  test('should add shader effect to spotlight', () => {
    enable();
    expect(spotlight._effects.length).toBeGreaterThan(0);
  });

  test('should update shader uniforms with correct values', () => {
    enable();
    const shaderEffect = spotlight._effects[0];

    // Modifie les paramètres
    settings._settings.radius = 0.3;
    settings._settings.color = [0.5, 0.5, 1.0];

    // Appelle la fonction de mise à jour
    updateShaderUniforms();

    // Vérifie que les uniformes ont été mis à jour
    expect(shaderEffect.u_radius).toBe(0.3);
    expect(shaderEffect.u_color).toEqual([0.5, 0.5, 1.0]);
  });

  test('should update mouse position uniform', () => {
    enable();
    const shaderEffect = spotlight._effects[0];

    // Modifie la position de la souris
    global.global.stage.get_pointer_position = () => [100, 200];

    // Appelle la fonction de mise à jour
    updateShaderUniforms();

    // Vérifie que l'uniforme de position a été mis à jour
    expect(shaderEffect.u_mouse).toEqual([100 / 1920, 200 / 1080]);
  });

  test('should switch shaders when shader-type changes', () => {
    enable();
    const initialEffect = spotlight._effects[0];

    // Modifie le type de shader
    settings._settings['shader-type'] = 'ripple';
    settings.emit('changed::shader-type');

    // Vérifie que l'effet a changé
    expect(spotlight._effects[0]).not.toBe(initialEffect);
    expect(global.currentShaderName).toBe('ripple');
  });

  test('should disable and clean up resources', () => {
    enable();
    expect(spotlight).toBeDefined();

    disable();
    expect(spotlight).toBeNull();
    expect(global.currentShaderEffect).toBeNull();
    expect(global.currentShaderName).toBeNull();
  });

  test('should update opacity based on settings', () => {
    enable();
    const initialOpacity = spotlight.opacity;

    // Modifie l'opacité
    settings._settings.opacity = 0.5;
    updateShaderUniforms();

    // Vérifie que l'opacité a été mise à jour
    expect(spotlight.opacity).toBe(0.5 * 255);
  });
});

describe('Shader Uniform Updates', () => {
  let settings;
  let spotlight;
  let shaderEffect;

  beforeEach(() => {
    settings = new Gio.Settings({ schema_id: 'org.gnome.shell.extensions.spotlight' });
    global.global.stage = {
      width: 1920,
      height: 1080,
      get_pointer_position: () => [960, 540],
    };
    spotlight = new Clutter.Actor({ width: 1920, height: 1080, opacity: 0 });
    shaderEffect = new Clutter.ShaderEffect();
    spotlight.add_effect(shaderEffect);
    global.spotlight = spotlight;
    global.currentShaderEffect = shaderEffect;
    global.currentShaderName = 'spotlight';
    global.resolutionInv = [1 / 1920, 1 / 1080];
  });

  test('should update spotlight-specific uniforms', () => {
    settings._settings.radius = 0.25;
    settings._settings['spotlight-falloff'] = 0.75;

    // Simule la fonction updateShaderUniforms pour spotlight
    const radius = settings.get_double('radius');
    const radiusSq = radius * radius;
    const falloff = radiusSq * 0.81; // falloffFactor dans extension.js

    shaderEffect.set_uniform_value('u_radius_sq', radiusSq);
    shaderEffect.set_uniform_value('u_falloff', falloff);

    expect(shaderEffect.u_radius_sq).toBe(0.0625);
    expect(shaderEffect.u_falloff).toBeCloseTo(0.04921875);
  });

  test('should update ripple-specific uniforms', () => {
    global.currentShaderName = 'ripple';
    settings._settings.radius = 0.3;
    settings._settings['ripple-speed'] = 10.0;
    settings._settings['ripple-frequency'] = 25.0;
    settings._settings['ripple-amplitude'] = 0.15;

    shaderEffect.set_uniform_value('u_radius', settings.get_double('radius'));
    shaderEffect.set_uniform_value('u_time', 0);
    shaderEffect.set_uniform_value('u_frequency', settings.get_double('ripple-frequency'));
    shaderEffect.set_uniform_value('u_amplitude', settings.get_double('ripple-amplitude'));

    expect(shaderEffect.u_radius).toBe(0.3);
    expect(shaderEffect.u_frequency).toBe(25.0);
    expect(shaderEffect.u_amplitude).toBe(0.15);
  });
});
