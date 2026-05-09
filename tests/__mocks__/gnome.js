// Mock pour Gio (GSettings)
const Gio = {
  Settings: class {
    constructor({ schema_id }) {
      this.schema_id = schema_id;
      this._settings = {
        'shader-type': 'spotlight',
        'radius': 0.2,
        'color': [1.0, 1.0, 1.0],
        'opacity': 1.0,
        'fade-delay': 1000,
        'easing': 'ease-out-quad',
        'spotlight-falloff': 0.81,
        'ripple-speed': 5.0,
        'ripple-frequency': 20.0,
        'ripple-amplitude': 0.1,
        'scanline-width': 0.01,
        'scanline-horizontal': true,
        'scanline-density': 100.0,
        'vignette-strength': 0.8,
        'vignette-inner-radius': 0.0,
        'vignette-outer-radius': 1.5,
        'blur-radius': 10.0,
        'blur-kernel-size': 3,
        'blur-iterations': 1,
        'glow-intensity': 1.0,
        'glow-falloff': 5.0,
        'glow-pulse-speed': 3.0,
        'invert-alpha': false,
        'pixel-size': 0.05,
        'pixel-shape': 'square',
        'edge-color': [1.0, 1.0, 1.0],
        'edge-threshold': 0.5,
        'edge-kernel': 'sobel',
        'hue-shift': 3.14159,
        'saturation': 1.0,
        'brightness': 1.0,
        'grid-size': 0.1,
        'grid-thickness': 0.005,
        'grid-color': [1.0, 1.0, 1.0],
        'grid-snap-to-mouse': true,
        'neon-glow-strength': 2.0,
        'neon-pulse-speed': 3.0,
        'neon-color': [0.0, 1.0, 1.0],
        'neon-bloom-radius': 0.1,
        'heatmap-hot-color': [1.0, 0.0, 0.0],
        'heatmap-cold-color': [0.0, 0.0, 1.0],
        'heatmap-decay-rate': 0.05,
        'heatmap-point-size': 5,
      };
      this._callbacks = {};
    }

    get_double(key) {
      return this._settings[key];
    }

    get_int(key) {
      return this._settings[key];
    }

    get_string(key) {
      return this._settings[key];
    }

    get_boolean(key) {
      return this._settings[key] || false;
    }

    get_value(key) {
      return { deep_unpack: () => this._settings[key] };
    }

    connect(event, callback) {
      this._callbacks[event] = callback;
      return { disconnect: () => delete this._callbacks[event] };
    }

    emit(event) {
      if (this._callbacks[event]) {
        this._callbacks[event]();
      }
    }
  },
};

// Mock pour Clutter
const Clutter = {
  Actor: class {
    constructor(params) {
      this.width = params?.width || 1920;
      this.height = params?.height || 1080;
      this.opacity = params?.opacity || 0;
      this.reactive = params?.reactive || false;
      this._effects = [];
    }

    add_effect(effect) {
      this._effects.push(effect);
    }

    remove_effect(effect) {
      this._effects = this._effects.filter(e => e !== effect);
    }

    get_pointer_position() {
      return [960, 540];
    }
  },

  ShaderEffect: class {
    constructor(params) {
      this.shader = params?.shader || {};
      this.pipeline = params?.pipeline || {};
    }

    set_uniform_value(name, value) {
      this[name] = value;
    }
  },

  Texture: class {
    constructor(params) {
      this.width = params?.width || 1920;
      this.height = params?.height || 1080;
    }

    set_content(content) {}
    set_data(data, format, rowStride) {}
  },
};

// Mock pour Cogl
const Cogl = {
  Shader: class {
    constructor() {}
    set_source(type, source) {
      this.source = source;
    }
    compile() {
      return true;
    }
    get_info_log() {
      return "Mock shader compiled successfully";
    }
  },

  Pipeline: class {
    constructor() {}
    set_shader(shader) {
      this.shader = shader;
    }
  },

  PixelFormat: {
    RGBA_8888: 'RGBA_8888',
  },
};

// Mock pour GLib
const GLib = {
  timeout_add: (priority, interval, callback) => {
    const id = Math.random().toString(36).substring(2, 9);
    setTimeout(callback, interval);
    return id;
  },

  source_remove: (id) => {
    clearTimeout(id);
    return true;
  },

  PRIORITY_DEFAULT: 0,
};

// Mock pour global (GNOME Shell)
const globalMock = {
  stage: {
    width: 1920,
    height: 1080,
    get_pointer_position: () => [960, 540],
    add_actor: (actor) => {},
    remove_actor: (actor) => {},
    connect: (event, callback) => {
      return { disconnect: () => {} };
    },
  },
  stage_width: 1920,
  stage_height: 1080,
};

// Exporte les mocks
module.exports = {
  Gio,
  Clutter,
  Cogl,
  GLib,
  global: globalMock,
};
