const { Clutter, Cogl, Gdk, Gio, GLib } = imports.gi;
const Main = imports.misc.extensionUtils.getCurrentExtension();

// === CONSTANTS ===
const DEV_MODE = false;
const falloffFactor = 0.81;

// === EASING FUNCTIONS ===
const easingFunctions = {
    // Linear
    linear: t => t,

    // Quadratic
    'ease-in-quad': t => t * t,
    'ease-out-quad': t => t * (2 - t),
    'ease-in-out-quad': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    // Cubic
    'ease-in-cubic': t => t * t * t,
    'ease-out-cubic': t => (--t) * t * t + 1,
    'ease-in-out-cubic': t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    // Quartic
    'ease-in-quart': t => t * t * t * t,
    'ease-out-quart': t => 1 - (--t) * t * t * t,
    'ease-in-out-quart': t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

    // Quintic
    'ease-in-quint': t => t * t * t * t * t,
    'ease-out-quint': t => 1 + (--t) * t * t * t * t,
    'ease-in-out-quint': t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

    // Sine
    'ease-in-sine': t => 1 - Math.cos((t * Math.PI) / 2),
    'ease-out-sine': t => Math.sin((t * Math.PI) / 2),
    'ease-in-out-sine': t => -0.5 * (Math.cos(t * Math.PI) - 1),

    // Exponential
    'ease-in-expo': t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
    'ease-out-expo': t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    'ease-in-out-expo': t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 0.5 * (2 - Math.pow(2, -20 * t + 10)),

    // Circular
    'ease-in-circ': t => 1 - Math.sqrt(1 - t * t),
    'ease-out-circ': t => Math.sqrt(1 - (t = t - 1) * t),
    'ease-in-out-circ': t => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (t = t * 2 - 2) * t) + 1) / 2,

    // Back
    'ease-in-back': t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    },
    'ease-out-back': t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    'ease-in-out-back': t => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },

    // Elastic
    'ease-in-elastic': t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    },
    'ease-out-elastic': t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    'ease-in-out-elastic': t => {
        const c5 = (2 * Math.PI) / 4.5;
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    },

    // Bounce
    'ease-in-bounce': t => 1 - easingFunctions['ease-out-bounce'](1 - t),
    'ease-out-bounce': t => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
    'ease-in-out-bounce': t => t < 0.5 ? (1 - easingFunctions['ease-out-bounce'](1 - 2 * t)) / 2 : (1 + easingFunctions['ease-out-bounce'](2 * t - 1)) / 2,
};

function applyEasing(t, easingName) {
    const easing = easingFunctions[easingName] || easingFunctions.linear;
    return easing(t);
}

// Easing metadata for UI preview
const easingMetadata = {
    linear: { name: 'Linear', color: '#888888' },
    'ease-in-quad': { name: 'Ease In Quad', color: '#FF6B6B' },
    'ease-out-quad': { name: 'Ease Out Quad', color: '#4ECDC4' },
    'ease-in-out-quad': { name: 'Ease In Out Quad', color: '#45B7D1' },
    'ease-in-cubic': { name: 'Ease In Cubic', color: '#FFBE0B' },
    'ease-out-cubic': { name: 'Ease Out Cubic', color: '#FB5607' },
    'ease-in-out-cubic': { name: 'Ease In Out Cubic', color: '#8338EC' },
    'ease-in-quart': { name: 'Ease In Quart', color: '#3A86FF' },
    'ease-out-quart': { name: 'Ease Out Quart', color: '#FF006E' },
    'ease-in-out-quart': { name: 'Ease In Out Quart', color: '#A5DD9B' },
    'ease-in-quint': { name: 'Ease In Quint', color: '#F9C74F' },
    'ease-out-quint': { name: 'Ease Out Quint', color: '#90BE6D' },
    'ease-in-out-quint': { name: 'Ease In Out Quint', color: '#577590' },
    'ease-in-sine': { name: 'Ease In Sine', color: '#43AA8B' },
    'ease-out-sine': { name: 'Ease Out Sine', color: '#F94144' },
    'ease-in-out-sine': { name: 'Ease In Out Sine', color: '#F3722C' },
    'ease-in-expo': { name: 'Ease In Expo', color: '#F8961E' },
    'ease-out-expo': { name: 'Ease Out Expo', color: '#F9844A' },
    'ease-in-out-expo': { name: 'Ease In Out Expo', color: '#F9C74F' },
    'ease-in-circ': { name: 'Ease In Circ', color: '#90BE6D' },
    'ease-out-circ': { name: 'Ease Out Circ', color: '#43AA8B' },
    'ease-in-out-circ': { name: 'Ease In Out Circ', color: '#577590' },
    'ease-in-back': { name: 'Ease In Back', color: '#A5DD9B' },
    'ease-out-back': { name: 'Ease Out Back', color: '#4ECDC4' },
    'ease-in-out-back': { name: 'Ease In Out Back', color: '#45B7D1' },
    'ease-in-elastic': { name: 'Ease In Elastic', color: '#FF6B6B' },
    'ease-out-elastic': { name: 'Ease Out Elastic', color: '#FB5607' },
    'ease-in-out-elastic': { name: 'Ease In Out Elastic', color: '#FFBE0B' },
    'ease-in-bounce': { name: 'Ease In Bounce', color: '#F9844A' },
    'ease-out-bounce': { name: 'Ease Out Bounce', color: '#F8961E' },
    'ease-in-out-bounce': { name: 'Ease In Out Bounce', color: '#F9C74F' },
};

// === SHADER REGISTRY ===
const vertexShaderSrc = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const shaders = {
    spotlight: {
        name: 'spotlight',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform SpotlightParams {
                vec2 u_mouse;
                float u_radius_sq;
                vec3 u_color;
                float u_falloff;
            };
            uniform vec2 u_resolution_inv;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist_sq = dot(delta, delta);
                if (dist_sq > u_radius_sq) discard;
                float alpha = smoothstep(u_falloff, u_radius_sq, dist_sq);
                gl_FragColor = vec4(u_color, alpha);
            }
        `,
        uniforms: ['u_mouse', 'u_radius_sq', 'u_color', 'u_falloff', 'u_resolution_inv'],
        defaultSettings: {
            radius: 0.2,
            color: [1.0, 1.0, 1.0],
        },
    },
    ripple: {
        name: 'ripple',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_time;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_frequency;
            uniform float u_amplitude;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                float wave = sin(dist * u_frequency - u_time * 5.0) * u_amplitude;
                float alpha = smoothstep(u_radius, 0.0, dist + wave);
                gl_FragColor = vec4(u_color, alpha);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_time', 'u_radius', 'u_color', 'u_frequency', 'u_amplitude'],
        defaultSettings: {
            radius: 0.3,
            color: [0.0, 0.5, 1.0],
            frequency: 20.0,
            amplitude: 0.1,
        },
    },
    scanline: {
        name: 'scanline',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_scanline_width;
            uniform bool u_horizontal;
            uniform float u_density;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                float scanline;
                if (u_horizontal) {
                    scanline = sin(uv.y * u_density) * 0.5 + 0.5;
                } else {
                    scanline = sin(uv.x * u_density) * 0.5 + 0.5;
                }
                scanline = smoothstep(0.5 - u_scanline_width, 0.5 + u_scanline_width, scanline);
                gl_FragColor = vec4(u_color * scanline, scanline);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_scanline_width', 'u_horizontal', 'u_density'],
        defaultSettings: {
            radius: 0.2,
            color: [1.0, 1.0, 1.0],
            scanline_width: 0.01,
            horizontal: true,
            density: 100.0,
        },
    },
    vignette: {
        name: 'vignette',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_strength;
            uniform float u_inner_radius;
            uniform float u_outer_radius;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                float vignette = smoothstep(u_inner_radius, u_outer_radius, dist);
                vignette = mix(1.0, vignette, u_strength);
                gl_FragColor = vec4(u_color * vignette, vignette);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_strength', 'u_inner_radius', 'u_outer_radius'],
        defaultSettings: {
            radius: 0.5,
            color: [0.0, 0.0, 0.0],
            strength: 0.8,
            inner_radius: 0.0,
            outer_radius: 1.5,
        },
    },
    blur: {
        name: 'blur',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_blur_radius;
            uniform int u_kernel_size;
            uniform int u_iterations;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                
                vec2 texel = u_resolution_inv * u_blur_radius;
                vec3 color = vec3(0.0);
                float totalWeight = 0.0;
                
                int kernelHalfSize = u_kernel_size / 2;
                for (int i = -kernelHalfSize; i <= kernelHalfSize; i++) {
                    for (int j = -kernelHalfSize; j <= kernelHalfSize; j++) {
                        vec2 offset = vec2(i, j) * texel;
                        vec2 sampleUV = uv + offset;
                        float sampleDist = length(sampleUV - u_mouse);
                        if (sampleDist > u_radius) continue;
                        
                        float weight = 1.0;
                        if (u_kernel_size == 3) {
                            if (i == 0 && j == 0) weight = 8.0;
                            else if (abs(i) == 1 && abs(j) == 1) weight = -1.0;
                            else if (abs(i) + abs(j) == 1) weight = -1.0;
                            else if (abs(i) == 2 || abs(j) == 2) weight = -1.0;
                        }
                        
                        color += texture2D(u_screen_texture, sampleUV).rgb * weight;
                        totalWeight += weight;
                    }
                }
                
                if (totalWeight > 0.0) color /= totalWeight;
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_blur_radius', 'u_kernel_size', 'u_iterations', 'u_screen_texture'],
        defaultSettings: {
            radius: 0.2,
            color: [1.0, 1.0, 1.0],
            blur_radius: 10.0,
            kernel_size: 3,
            iterations: 1,
        },
        requiresTexture: true,
    },
    glow: {
        name: 'glow',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_intensity;
            uniform float u_falloff;
            uniform float u_pulse_speed;
            uniform float u_time;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                
                float glow = u_intensity / (1.0 + dist * dist * u_falloff);
                if (u_pulse_speed > 0.0) {
                    glow *= 0.5 + 0.5 * sin(u_time * u_pulse_speed);
                }
                glow = smoothstep(0.0, u_radius, dist) * glow;
                
                gl_FragColor = vec4(u_color * glow, glow);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_intensity', 'u_falloff', 'u_pulse_speed', 'u_time'],
        defaultSettings: {
            radius: 0.2,
            color: [1.0, 1.0, 1.0],
            intensity: 1.0,
            falloff: 5.0,
            pulse_speed: 3.0,
        },
    },
    invert: {
        name: 'invert',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform sampler2D u_screen_texture;
            uniform bool u_invert_alpha;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) {
                    gl_FragColor = texture2D(u_screen_texture, uv);
                    return;
                }
                vec4 screen_color = texture2D(u_screen_texture, uv);
                if (u_invert_alpha) {
                    gl_FragColor = vec4(1.0 - screen_color.rgb, 1.0 - screen_color.a);
                } else {
                    gl_FragColor = vec4(1.0 - screen_color.rgb, screen_color.a);
                }
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_screen_texture', 'u_invert_alpha'],
        defaultSettings: {
            radius: 0.2,
            invert_alpha: false,
        },
        requiresTexture: true,
    },
    pixelate: {
        name: 'pixelate',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform float u_pixel_size;
            uniform sampler2D u_screen_texture;
            uniform int u_pixel_shape;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) {
                    gl_FragColor = texture2D(u_screen_texture, uv);
                    return;
                }
                vec2 pixelated_uv = floor(uv / u_pixel_size) * u_pixel_size;
                if (u_pixel_shape == 1) {
                    vec2 center = pixelated_uv + vec2(u_pixel_size * 0.5);
                    if (length(uv - center) > u_pixel_size * 0.5) {
                        discard;
                    }
                }
                gl_FragColor = texture2D(u_screen_texture, pixelated_uv);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_pixel_size', 'u_screen_texture', 'u_pixel_shape'],
        defaultSettings: {
            radius: 0.2,
            pixel_size: 0.05,
            pixel_shape: 'square',
        },
        requiresTexture: true,
    },
    edge: {
        name: 'edge',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform sampler2D u_screen_texture;
            uniform vec3 u_edge_color;
            uniform float u_edge_threshold;
            uniform int u_kernel_type;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) {
                    gl_FragColor = texture2D(u_screen_texture, uv);
                    return;
                }
                
                vec2 texel = u_resolution_inv;
                vec4 sum = vec4(0.0);
                
                if (u_kernel_type == 0) {
                    float kernel[9] = float[](-1, -1, -1, -1, 8, -1, -1, -1, -1);
                    for (int i = -1; i <= 1; i++) {
                        for (int j = -1; j <= 1; j++) {
                            vec2 offset = vec2(i, j) * texel;
                            sum += texture2D(u_screen_texture, uv + offset) * kernel[(i+1)*3 + (j+1)];
                        }
                    }
                } else if (u_kernel_type == 1) {
                    float kernelX[9] = float[](-1, 0, 1, -1, 0, 1, -1, 0, 1);
                    float kernelY[9] = float[](-1, -1, -1, 0, 0, 0, 1, 1, 1);
                    vec4 sumX = vec4(0.0);
                    vec4 sumY = vec4(0.0);
                    for (int i = -1; i <= 1; i++) {
                        for (int j = -1; j <= 1; j++) {
                            vec2 offset = vec2(i, j) * texel;
                            vec4 sample = texture2D(u_screen_texture, uv + offset);
                            sumX += sample * kernelX[(i+1)*3 + (j+1)];
                            sumY += sample * kernelY[(i+1)*3 + (j+1)];
                        }
                    }
                    sum = sqrt(sumX * sumX + sumY * sumY);
                } else if (u_kernel_type == 2) {
                    float kernel[9] = float[](0, 1, 0, 1, -4, 1, 0, 1, 0);
                    for (int i = -1; i <= 1; i++) {
                        for (int j = -1; j <= 1; j++) {
                            vec2 offset = vec2(i, j) * texel;
                            sum += texture2D(u_screen_texture, uv + offset) * kernel[(i+1)*3 + (j+1)];
                        }
                    }
                }
                
                float edge = length(sum.rgb);
                if (edge > u_edge_threshold) {
                    gl_FragColor = vec4(u_edge_color, 1.0);
                } else {
                    gl_FragColor = texture2D(u_screen_texture, uv);
                }
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_screen_texture', 'u_edge_color', 'u_edge_threshold', 'u_kernel_type'],
        defaultSettings: {
            radius: 0.2,
            edge_color: [1.0, 1.0, 1.0],
            edge_threshold: 0.5,
            kernel_type: 'sobel',
        },
        requiresTexture: true,
    },
    colorShift: {
        name: 'colorShift',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform sampler2D u_screen_texture;
            uniform float u_hue_shift;
            uniform float u_saturation;
            uniform float u_brightness;
            
            vec3 hueShift(vec3 color, float hue) {
                const vec3 k = vec3(0.57735, 0.57735, 0.57735);
                float cosAngle = cos(hue);
                return color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) {
                    gl_FragColor = texture2D(u_screen_texture, uv);
                    return;
                }
                vec4 screen_color = texture2D(u_screen_texture, uv);
                vec3 shifted = hueShift(screen_color.rgb, u_hue_shift);
                shifted = mix(vec3(0.5), shifted, u_saturation);
                shifted *= u_brightness;
                gl_FragColor = vec4(shifted, screen_color.a);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_screen_texture', 'u_hue_shift', 'u_saturation', 'u_brightness'],
        defaultSettings: {
            radius: 0.2,
            hue_shift: 3.14159,
            saturation: 1.0,
            brightness: 1.0,
        },
        requiresTexture: true,
    },
    grid: {
        name: 'grid',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_grid_size;
            uniform float u_grid_thickness;
            uniform bool u_snap_to_mouse;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                
                vec2 grid_uv = uv;
                if (u_snap_to_mouse) {
                    grid_uv = uv - u_mouse;
                }
                
                vec2 grid = abs(fract(grid_uv / u_grid_size) - 0.5);
                float line = smoothstep(u_grid_thickness, 0.0, min(grid.x, grid.y));
                
                gl_FragColor = vec4(u_color * line, line);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_grid_size', 'u_grid_thickness', 'u_snap_to_mouse'],
        defaultSettings: {
            radius: 0.3,
            color: [1.0, 1.0, 1.0],
            grid_size: 0.1,
            grid_thickness: 0.005,
            snap_to_mouse: true,
        },
    },
    neon: {
        name: 'neon',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform vec3 u_color;
            uniform float u_time;
            uniform float u_glow_strength;
            uniform float u_pulse_speed;
            uniform float u_bloom_radius;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                
                float glow = u_glow_strength / (1.0 + dist * dist * 5.0);
                if (u_pulse_speed > 0.0) {
                    glow *= 0.5 + 0.5 * sin(u_time * u_pulse_speed);
                }
                
                float bloom = smoothstep(u_radius, u_radius + u_bloom_radius, dist);
                glow *= bloom;
                
                gl_FragColor = vec4(u_color * glow, glow);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_color', 'u_time', 'u_glow_strength', 'u_pulse_speed', 'u_bloom_radius'],
        defaultSettings: {
            radius: 0.3,
            color: [0.0, 1.0, 1.0],
            glow_strength: 2.0,
            pulse_speed: 3.0,
            bloom_radius: 0.1,
        },
    },
    heatmap: {
        name: 'heatmap',
        vertexSrc: vertexShaderSrc,
        fragmentSrc: `
            precision mediump float;
            uniform vec2 u_resolution_inv;
            uniform vec2 u_mouse;
            uniform float u_radius;
            uniform sampler2D u_heat_texture;
            uniform vec3 u_hot_color;
            uniform vec3 u_cold_color;
            void main() {
                vec2 uv = gl_FragCoord.xy * u_resolution_inv;
                vec2 delta = uv - u_mouse;
                float dist = length(delta);
                if (dist > u_radius) discard;
                
                float heat = texture2D(u_heat_texture, uv).r;
                vec3 color = mix(u_cold_color, u_hot_color, heat);
                
                gl_FragColor = vec4(color, heat);
            }
        `,
        uniforms: ['u_resolution_inv', 'u_mouse', 'u_radius', 'u_heat_texture', 'u_hot_color', 'u_cold_color'],
        defaultSettings: {
            radius: 0.3,
            hot_color: [1.0, 0.0, 0.0],
            cold_color: [0.0, 0.0, 1.0],
        },
        requiresTexture: true,
    },
};

// === SHADER CACHE ===
const shaderCache = new Map();
let resolutionInv = [0, 0];

function getShader(name, vertexSrc, fragmentSrc) {
    if (!shaderCache.has(name)) {
        let shader = new Cogl.Shader();
        shader.set_source(Cogl.ShaderType.VERTEX_SHADER, vertexSrc);
        shader.set_source(Cogl.ShaderType.FRAGMENT_SHADER, fragmentSrc);
        if (!shader.compile()) {
            logError(`Shader "${name}" compilation failed: ${shader.get_info_log()}`);
            return null;
        }
        let pipeline = new Cogl.Pipeline();
        pipeline.set_shader(shader);
        shaderCache.set(name, { shader, pipeline });
    }
    return shaderCache.get(name);
}

// Initialize all shaders
for (const [name, shaderDef] of Object.entries(shaders)) {
    getShader(name, shaderDef.vertexSrc, shaderDef.fragmentSrc);
}

// === GLOBAL STATE ===
let spotlight;
let currentShaderEffect;
let currentShaderName = null;
let screenTexture = null;
let heatTexture = null;
let heatData = null;
let time = 0;
let timeHandlerId = null;
let heatmapHandlerId = null;
let fadeOutId = null;
let fadeInId = null;
let isFadingIn = false;
let isFadingOut = false;
let fadeStartTime = 0;
let fadeDuration = 0;

// === SETTINGS ===
const settings = new Gio.Settings({
    schema_id: 'org.gnome.shell.extensions.spotlight',
});

// === TEXTURE MANAGEMENT ===
function initTextures() {
    if (!screenTexture) {
        screenTexture = new Clutter.Texture({
            width: global.stage_width,
            height: global.stage_height,
        });
        screenTexture.set_content(global.stage);
    }

    if (!heatTexture) {
        heatTexture = new Clutter.Texture({
            width: global.stage_width,
            height: global.stage_height,
        });
        heatData = new Uint8Array(global.stage_width * global.stage_height * 4);
        heatTexture.set_data(heatData, Cogl.PixelFormat.RGBA_8888, 0);
    }
}

function updateHeatmap() {
    if (!heatTexture || currentShaderName !== 'heatmap') return;

    let [mouseX, mouseY] = global.stage.get_pointer_position();
    let index = (Math.floor(mouseY) * global.stage_width + Math.floor(mouseX)) * 4;
    heatData[index] = 255;
    heatData[index + 1] = 0;
    heatData[index + 2] = 0;
    heatData[index + 3] = 255;

    const decayRate = settings.get_double('heatmap-decay-rate');
    for (let i = 0; i < heatData.length; i += 4) {
        if (heatData[i] > 0) {
            heatData[i] = Math.max(0, heatData[i] - decayRate * 255);
            heatData[i + 3] = Math.max(0, heatData[i + 3] - decayRate * 255);
        }
    }

    heatTexture.set_data(heatData, Cogl.PixelFormat.RGBA_8888, 0);
    return GLib.SOURCE_CONTINUE;
}

// === HELPER FUNCTIONS ===
function updateStaticUniforms() {
    resolutionInv = [
        1.0 / global.stage_width,
        1.0 / global.stage_height
    ];
}

function applyShaderEffect() {
    if (!spotlight) return;

    const shaderType = settings.get_string('shader-type');
    if (shaderType === currentShaderName) return;

    if (currentShaderEffect) {
        spotlight.remove_effect(currentShaderEffect);
        currentShaderEffect = null;
    }

    const shaderData = shaderCache.get(shaderType);
    if (!shaderData) {
        logError(`Shader "${shaderType}" not found!`);
        return;
    }

    currentShaderEffect = new Clutter.ShaderEffect({
        shader: shaderData.shader,
        pipeline: shaderData.pipeline,
    });
    spotlight.add_effect(currentShaderEffect);
    currentShaderName = shaderType;

    if (shaderData.requiresTexture) {
        initTextures();
        if (shaderType === 'heatmap') {
            currentShaderEffect.set_uniform_value('u_heat_texture', heatTexture);
            if (!heatmapHandlerId) {
                heatmapHandlerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, updateHeatmap);
            }
        } else {
            currentShaderEffect.set_uniform_value('u_screen_texture', screenTexture);
        }
    }

    updateShaderUniforms();
}

function updateShaderUniforms() {
    if (!currentShaderEffect || !currentShaderName) return;

    const shaderDef = shaders[currentShaderName];
    if (!shaderDef) return;

    const [mouseX, mouseY] = global.stage.get_pointer_position();
    const normalizedMouse = [
        mouseX / global.stage_width,
        mouseY / global.stage_height
    ];
    const color = settings.get_value('color').deep_unpack();
    const radius = settings.get_double('radius');

    currentShaderEffect.set_uniform_value('u_resolution_inv', resolutionInv);
    currentShaderEffect.set_uniform_value('u_mouse', normalizedMouse);
    currentShaderEffect.set_uniform_value('u_color', color);

    switch (currentShaderName) {
        case 'spotlight':
            const radiusSq = radius * radius;
            currentShaderEffect.set_uniform_value('u_radius_sq', radiusSq);
            currentShaderEffect.set_uniform_value('u_falloff', radiusSq * falloffFactor);
            break;
        case 'ripple':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_time', time);
            currentShaderEffect.set_uniform_value('u_frequency', settings.get_double('ripple-frequency'));
            currentShaderEffect.set_uniform_value('u_amplitude', settings.get_double('ripple-amplitude'));
            break;
        case 'scanline':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_scanline_width', settings.get_double('scanline-width'));
            currentShaderEffect.set_uniform_value('u_horizontal', settings.get_boolean('scanline-horizontal'));
            currentShaderEffect.set_uniform_value('u_density', settings.get_double('scanline-density'));
            break;
        case 'vignette':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_strength', settings.get_double('vignette-strength'));
            currentShaderEffect.set_uniform_value('u_inner_radius', settings.get_double('vignette-inner-radius'));
            currentShaderEffect.set_uniform_value('u_outer_radius', settings.get_double('vignette-outer-radius'));
            break;
        case 'blur':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_blur_radius', settings.get_double('blur-radius'));
            currentShaderEffect.set_uniform_value('u_kernel_size', settings.get_int('blur-kernel-size'));
            currentShaderEffect.set_uniform_value('u_iterations', settings.get_int('blur-iterations'));
            break;
        case 'glow':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_intensity', settings.get_double('glow-intensity'));
            currentShaderEffect.set_uniform_value('u_falloff', settings.get_double('glow-falloff'));
            currentShaderEffect.set_uniform_value('u_pulse_speed', settings.get_double('glow-pulse-speed'));
            break;
        case 'invert':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_invert_alpha', settings.get_boolean('invert-alpha'));
            break;
        case 'pixelate':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_pixel_size', settings.get_double('pixel-size'));
            currentShaderEffect.set_uniform_value('u_pixel_shape', settings.get_string('pixel-shape') === 'circle' ? 1 : 0);
            break;
        case 'edge':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_edge_color', settings.get_value('edge-color').deep_unpack());
            currentShaderEffect.set_uniform_value('u_edge_threshold', settings.get_double('edge-threshold'));
            const kernelType = settings.get_string('edge-kernel');
            let kernelId = 0;
            if (kernelType === 'prewitt') kernelId = 1;
            else if (kernelType === 'laplacian') kernelId = 2;
            currentShaderEffect.set_uniform_value('u_kernel_type', kernelId);
            break;
        case 'colorShift':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_hue_shift', settings.get_double('hue-shift'));
            currentShaderEffect.set_uniform_value('u_saturation', settings.get_double('saturation'));
            currentShaderEffect.set_uniform_value('u_brightness', settings.get_double('brightness'));
            break;
        case 'grid':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_grid_size', settings.get_double('grid-size'));
            currentShaderEffect.set_uniform_value('u_grid_thickness', settings.get_double('grid-thickness'));
            currentShaderEffect.set_uniform_value('u_snap_to_mouse', settings.get_boolean('grid-snap-to-mouse'));
            break;
        case 'neon':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_glow_strength', settings.get_double('neon-glow-strength'));
            currentShaderEffect.set_uniform_value('u_pulse_speed', settings.get_double('neon-pulse-speed'));
            currentShaderEffect.set_uniform_value('u_bloom_radius', settings.get_double('neon-bloom-radius'));
            break;
        case 'heatmap':
            currentShaderEffect.set_uniform_value('u_radius', radius);
            currentShaderEffect.set_uniform_value('u_hot_color', settings.get_value('heatmap-hot-color').deep_unpack());
            currentShaderEffect.set_uniform_value('u_cold_color', settings.get_value('heatmap-cold-color').deep_unpack());
            break;
    }
}

function startTimeAnimation() {
    if (timeHandlerId) {
        GLib.source_remove(timeHandlerId);
    }
    time = 0;
    const rippleSpeed = settings.get_double('ripple-speed');
    timeHandlerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
        time += 0.016 * rippleSpeed;
        if (currentShaderName === 'ripple' || currentShaderName === 'neon') {
            updateShaderUniforms();
        }
        return GLib.SOURCE_CONTINUE;
    });
}

// === FADE ANIMATION WITH EASING ===
function startFadeOut() {
    if (fadeOutId) GLib.source_remove(fadeOutId);
    if (fadeInId) GLib.source_remove(fadeInId);
    isFadingIn = false;
    isFadingOut = true;
    fadeStartTime = Date.now();
    fadeDuration = settings.get_int('fade-delay');

    const easing = settings.get_string('fade-easing');

    fadeOutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
        const elapsed = Date.now() - fadeStartTime;
        const progress = Math.min(elapsed / fadeDuration, 1.0);
        const easedProgress = applyEasing(progress, easing);
        spotlight.opacity = 255 * (1 - easedProgress);

        if (progress >= 1.0) {
            isFadingOut = false;
            return GLib.SOURCE_REMOVE;
        }
        return GLib.SOURCE_CONTINUE;
    });
}

function startFadeIn() {
    if (fadeInId) GLib.source_remove(fadeInId);
    if (fadeOutId) GLib.source_remove(fadeOutId);
    isFadingIn = true;
    isFadingOut = false;
    fadeStartTime = Date.now();
    fadeDuration = settings.get_int('fade-delay');

    const easing = settings.get_string('fade-easing');

    fadeInId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
        const elapsed = Date.now() - fadeStartTime;
        const progress = Math.min(elapsed / fadeDuration, 1.0);
        const easedProgress = applyEasing(progress, easing);
        const targetOpacity = settings.get_double('opacity');
        spotlight.opacity = 255 * targetOpacity * easedProgress;

        if (progress >= 1.0) {
            isFadingIn = false;
            return GLib.SOURCE_REMOVE;
        }
        return GLib.SOURCE_CONTINUE;
    });
}

function resetFadeTimers() {
    if (fadeOutId) {
        GLib.source_remove(fadeOutId);
        fadeOutId = null;
    }
    if (fadeInId) {
        GLib.source_remove(fadeInId);
        fadeInId = null;
    }
    isFadingIn = false;
    isFadingOut = false;
}

// Dev-only: Reload shaders
function reloadShaders() {
    shaderCache.clear();
    for (const [name, shaderDef] of Object.entries(shaders)) {
        getShader(name, shaderDef.vertexSrc, shaderDef.fragmentSrc);
    }
    if (currentShaderName) {
        applyShaderEffect();
    }
}

if (DEV_MODE) {
    global.reloadShaders = reloadShaders;
}

// === EXTENSION LIFECYCLE ===
function enable() {
    updateStaticUniforms();
    initTextures();

    spotlight = new Clutter.Actor({
        width: global.stage_width,
        height: global.stage_height,
        opacity: 0,
        reactive: false,
    });
    global.stage.add_actor(spotlight);

    applyShaderEffect();
    startTimeAnimation();

    const motionHandlerId = global.stage.connect('motion-event', () => {
        if (!isFadingIn) {
            resetFadeTimers();
            spotlight.opacity = 255 * settings.get_double('opacity');
            startFadeOut();
        }
    });

    // Start initial fade-in
    startFadeIn();

    settings.connect('changed::shader-type', applyShaderEffect);
    settings.connect('changed::radius', updateShaderUniforms);
    settings.connect('changed::color', updateShaderUniforms);
    settings.connect('changed::opacity', updateShaderUniforms);
    settings.connect('changed::fade-delay', () => {
        resetFadeTimers();
        startFadeOut();
    });
    settings.connect('changed::fade-easing', () => {
        resetFadeTimers();
        if (isFadingOut) startFadeOut();
        else if (isFadingIn) startFadeIn();
    });
    settings.connect('changed::ripple-speed', startTimeAnimation);
    settings.connect('changed::ripple-frequency', updateShaderUniforms);
    settings.connect('changed::ripple-amplitude', updateShaderUniforms);
    settings.connect('changed::scanline-width', updateShaderUniforms);
    settings.connect('changed::scanline-horizontal', updateShaderUniforms);
    settings.connect('changed::scanline-density', updateShaderUniforms);
    settings.connect('changed::vignette-strength', updateShaderUniforms);
    settings.connect('changed::vignette-inner-radius', updateShaderUniforms);
    settings.connect('changed::vignette-outer-radius', updateShaderUniforms);
    settings.connect('changed::blur-radius', updateShaderUniforms);
    settings.connect('changed::blur-kernel-size', updateShaderUniforms);
    settings.connect('changed::blur-iterations', updateShaderUniforms);
    settings.connect('changed::glow-intensity', updateShaderUniforms);
    settings.connect('changed::glow-falloff', updateShaderUniforms);
    settings.connect('changed::glow-pulse-speed', updateShaderUniforms);
    settings.connect('changed::invert-alpha', updateShaderUniforms);
    settings.connect('changed::pixel-size', updateShaderUniforms);
    settings.connect('changed::pixel-shape', updateShaderUniforms);
    settings.connect('changed::edge-color', updateShaderUniforms);
    settings.connect('changed::edge-threshold', updateShaderUniforms);
    settings.connect('changed::edge-kernel', updateShaderUniforms);
    settings.connect('changed::hue-shift', updateShaderUniforms);
    settings.connect('changed::saturation', updateShaderUniforms);
    settings.connect('changed::brightness', updateShaderUniforms);
    settings.connect('changed::grid-size', updateShaderUniforms);
    settings.connect('changed::grid-thickness', updateShaderUniforms);
    settings.connect('changed::grid-color', updateShaderUniforms);
    settings.connect('changed::grid-snap-to-mouse', updateShaderUniforms);
    settings.connect('changed::neon-glow-strength', updateShaderUniforms);
    settings.connect('changed::neon-pulse-speed', updateShaderUniforms);
    settings.connect('changed::neon-color', updateShaderUniforms);
    settings.connect('changed::neon-bloom-radius', updateShaderUniforms);
    settings.connect('changed::heatmap-hot-color', updateShaderUniforms);
    settings.connect('changed::heatmap-cold-color', updateShaderUniforms);
    settings.connect('changed::heatmap-decay-rate', updateShaderUniforms);
    settings.connect('changed::heatmap-point-size', updateShaderUniforms);
}

function disable() {
    if (timeHandlerId) {
        GLib.source_remove(timeHandlerId);
        timeHandlerId = null;
    }
    if (heatmapHandlerId) {
        GLib.source_remove(heatmapHandlerId);
        heatmapHandlerId = null;
    }
    resetFadeTimers();

    if (spotlight) {
        global.stage.remove_actor(spotlight);
        spotlight = null;
    }

    currentShaderEffect = null;
    currentShaderName = null;
}

function init() {
    // Nothing to do here
}