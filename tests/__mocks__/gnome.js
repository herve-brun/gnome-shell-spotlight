// Mock implementations of GNOME libraries
const Gio = {
  File: {
    new_for_path: jest.fn(),
  },
  FileType: {
    DIRECTORY: 0,
    REGULAR: 1,
  },
  // Add other Gio properties as needed
};

const Clutter = {
  Color: class {
    constructor(r, g, b, a) {
      this.red = r;
      this.green = g;
      this.blue = b;
      this.alpha = a;
    }
  },
  // Add other Clutter properties as needed
};

const Cogl = {
  // Add Cogl mock properties as needed
};

const GLib = {
  getenv: jest.fn(),
  get_user_config_dir: jest.fn(() => '/home/user/.config'),
  // Add other GLib properties as needed
};

const global = {
  log: jest.fn(),
  logError: jest.fn(),
  // Add other global properties as needed
};

module.exports = {
  Gio,
  Clutter,
  Cogl,
  GLib,
  global,
};