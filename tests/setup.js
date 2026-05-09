// Mock des modules GNOME pour Jest
jest.mock('gi', () => {
  const { Gio, Clutter, Cogl, GLib } = require('./__mocks__/gnome.js');
  return {
    Clutter,
    Cogl,
    Gio,
    GLib,
  };
});

// Mock de 'imports' (pour les modules GNOME Shell)
jest.mock('imports', () => {
  const { Gio, Clutter, Cogl, GLib, global: globalMock } = require('./__mocks__/gnome.js');
  return {
    gi: {
      Clutter,
      Cogl,
      Gio,
      GLib,
    },
    misc: {
      extensionUtils: {
        getCurrentExtension: () => ({
          path: '/path/to/extension',
        }),
      },
    },
  };
});

// Configure global pour les tests
const { Gio, Clutter, Cogl, GLib, global: globalMock } = require('./__mocks__/gnome.js');
global.global = globalMock;
global.Clutter = Clutter;
global.Cogl = Cogl;
global.Gio = Gio;
global.GLib = GLib;
