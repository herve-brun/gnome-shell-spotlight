// Mock des modules GNOME pour Jest
const { Gio, Clutter, Cogl, GLib, global: globalMock } = require('./__mocks__/gnome.js');

// Mock de 'gi' (GObject Introspection)
jest.mock('gi', () => ({
  Clutter,
  Cogl,
  Gio,
  GLib,
}));

// Mock de 'imports' (pour les modules GNOME Shell)
jest.mock('imports', () => ({
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
}));

// Configure global pour les tests
global.global = globalMock;
global.Clutter = Clutter;
global.Cogl = Cogl;
global.Gio = Gio;
global.GLib = GLib;
