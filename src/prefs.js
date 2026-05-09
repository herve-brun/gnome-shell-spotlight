const { GObject, Gio, Gtk, Adw, Gdk, GLib, Cairo } = imports.gi;

// Easing functions metadata with colors
const easingOptions = [
    // Linear
    { id: 'linear', name: 'Linear', color: '#888888', category: 'Basic' },
    
    // Quadratic
    { id: 'ease-in-quad', name: 'Ease In Quad', color: '#FF6B6B', category: 'Quadratic' },
    { id: 'ease-out-quad', name: 'Ease Out Quad', color: '#4ECDC4', category: 'Quadratic' },
    { id: 'ease-in-out-quad', name: 'Ease In Out Quad', color: '#45B7D1', category: 'Quadratic' },
    
    // Cubic
    { id: 'ease-in-cubic', name: 'Ease In Cubic', color: '#FFBE0B', category: 'Cubic' },
    { id: 'ease-out-cubic', name: 'Ease Out Cubic', color: '#FB5607', category: 'Cubic' },
    { id: 'ease-in-out-cubic', name: 'Ease In Out Cubic', color: '#8338EC', category: 'Cubic' },
    
    // Quartic
    { id: 'ease-in-quart', name: 'Ease In Quart', color: '#3A86FF', category: 'Quartic' },
    { id: 'ease-out-quart', name: 'Ease Out Quart', color: '#FF006E', category: 'Quartic' },
    { id: 'ease-in-out-quart', name: 'Ease In Out Quart', color: '#A5DD9B', category: 'Quartic' },
    
    // Quintic
    { id: 'ease-in-quint', name: 'Ease In Quint', color: '#F9C74F', category: 'Quintic' },
    { id: 'ease-out-quint', name: 'Ease Out Quint', color: '#90BE6D', category: 'Quintic' },
    { id: 'ease-in-out-quint', name: 'Ease In Out Quint', color: '#577590', category: 'Quintic' },
    
    // Sine
    { id: 'ease-in-sine', name: 'Ease In Sine', color: '#43AA8B', category: 'Sine' },
    { id: 'ease-out-sine', name: 'Ease Out Sine', color: '#F94144', category: 'Sine' },
    { id: 'ease-in-out-sine', name: 'Ease In Out Sine', color: '#F3722C', category: 'Sine' },
    
    // Exponential
    { id: 'ease-in-expo', name: 'Ease In Expo', color: '#F8961E', category: 'Exponential' },
    { id: 'ease-out-expo', name: 'Ease Out Expo', color: '#F9844A', category: 'Exponential' },
    { id: 'ease-in-out-expo', name: 'Ease In Out Expo', color: '#F9C74F', category: 'Exponential' },
    
    // Circular
    { id: 'ease-in-circ', name: 'Ease In Circ', color: '#90BE6D', category: 'Circular' },
    { id: 'ease-out-circ', name: 'Ease Out Circ', color: '#43AA8B', category: 'Circular' },
    { id: 'ease-in-out-circ', name: 'Ease In Out Circ', color: '#577590', category: 'Circular' },
    
    // Back
    { id: 'ease-in-back', name: 'Ease In Back', color: '#A5DD9B', category: 'Back' },
    { id: 'ease-out-back', name: 'Ease Out Back', color: '#4ECDC4', category: 'Back' },
    { id: 'ease-in-out-back', name: 'Ease In Out Back', color: '#45B7D1', category: 'Back' },
    
    // Elastic
    { id: 'ease-in-elastic', name: 'Ease In Elastic', color: '#FF6B6B', category: 'Elastic' },
    { id: 'ease-out-elastic', name: 'Ease Out Elastic', color: '#FB5607', category: 'Elastic' },
    { id: 'ease-in-out-elastic', name: 'Ease In Out Elastic', color: '#FFBE0B', category: 'Elastic' },
    
    // Bounce
    { id: 'ease-in-bounce', name: 'Ease In Bounce', color: '#F9844A', category: 'Bounce' },
    { id: 'ease-out-bounce', name: 'Ease Out Bounce', color: '#F8961E', category: 'Bounce' },
    { id: 'ease-in-out-bounce', name: 'Ease In Out Bounce', color: '#F9C74F', category: 'Bounce' },
];

// Easing functions for path generation
const easingFuncs = {
    linear: t => t,
    'ease-in-quad': t => t * t,
    'ease-out-quad': t => t * (2 - t),
    'ease-in-out-quad': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'ease-in-cubic': t => t * t * t,
    'ease-out-cubic': t => (--t) * t * t + 1,
    'ease-in-out-cubic': t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    'ease-in-quart': t => t * t * t * t,
    'ease-out-quart': t => 1 - (--t) * t * t * t,
    'ease-in-out-quart': t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    'ease-in-quint': t => t * t * t * t * t,
    'ease-out-quint': t => 1 + (--t) * t * t * t * t,
    'ease-in-out-quint': t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    'ease-in-sine': t => 1 - Math.cos((t * Math.PI) / 2),
    'ease-out-sine': t => Math.sin((t * Math.PI) / 2),
    'ease-in-out-sine': t => -0.5 * (Math.cos(t * Math.PI) - 1),
    'ease-in-expo': t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
    'ease-out-expo': t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    'ease-in-out-expo': t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 0.5 * (2 - Math.pow(2, -20 * t + 10)),
    'ease-in-circ': t => 1 - Math.sqrt(1 - t * t),
    'ease-out-circ': t => Math.sqrt(1 - (t = t - 1) * t),
    'ease-in-out-circ': t => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (t = t * 2 - 2) * t) + 1) / 2,
    'ease-in-back': t => {
        const c1 = 1.70158, c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    },
    'ease-out-back': t => {
        const c1 = 1.70158, c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    'ease-in-out-back': t => {
        const c1 = 1.70158, c2 = c1 * 1.525;
        return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
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
    'ease-in-bounce': t => 1 - easingFuncs['ease-out-bounce'](1 - t),
    'ease-out-bounce': t => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        else if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        else return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    'ease-in-out-bounce': t => t < 0.5 ? (1 - easingFuncs['ease-out-bounce'](1 - 2 * t)) / 2 : (1 + easingFuncs['ease-out-bounce'](2 * t - 1)) / 2,
};

// Custom DrawingArea for easing curve preview
const EasingPreview = GObject.registerClass(
    { GTypeName: 'EasingPreview' },
    class EasingPreview extends Gtk.DrawingArea {
        _init(params) {
            super._init(params);
            this.set_size_request(80, 40);
            this._easingId = params.easingId || 'linear';
            this._color = params.color || '#888888';
        }
        
        get easingId() {
            return this._easingId;
        }
        
        set easingId(value) {
            this._easingId = value;
            this.queue_draw();
        }
        
        get color() {
            return this._color;
        }
        
        set color(value) {
            this._color = value;
            this.queue_draw();
        }
        
        vfunc_snapshot(snapshot) {
            const easing = easingOptions.find(e => e.id === this._easingId) || easingOptions[0];
            const func = easingFuncs[this._easingId] || easingFuncs.linear;
            const color = easing.color || this._color;
            
            const width = this.get_allocated_width();
            const height = this.get_allocated_height();
            
            if (width <= 0 || height <= 0) return;
            
            const cr = snapshot.append_cairo(new Cairo.Rectangle({ x: 0, y: 0, width, height }));
            
            // Background
            cr.setSourceRGB(0.15, 0.15, 0.15);
            cr.rectangle(0, 0, width, height);
            cr.fill();
            
            // Grid lines
            cr.setSourceRGB(0.3, 0.3, 0.3);
            cr.setLineWidth(0.5);
            cr.setDash([2, 2], 0);
            
            // Horizontal line at bottom
            cr.moveTo(0, height - 1);
            cr.lineTo(width, height - 1);
            cr.stroke();
            
            // Vertical lines
            cr.moveTo(0, 0);
            cr.lineTo(0, height);
            cr.stroke();
            cr.moveTo(width - 1, 0);
            cr.lineTo(width - 1, height);
            cr.stroke();
            
            // Reset dash
            cr.setDash([], 0);
            
            // Draw easing curve
            cr.setSourceRGB(
                parseInt(color.slice(1, 3), 16) / 255,
                parseInt(color.slice(3, 5), 16) / 255,
                parseInt(color.slice(5, 7), 16) / 255
            );
            cr.setLineWidth(2);
            cr.setLineCap(Cairo.LineCap.ROUND);
            cr.setLineJoin(Cairo.LineJoin.ROUND);
            
            cr.moveTo(0, height - 1);
            const steps = 100;
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const x = (t * (width - 1));
                const y = height - 1 - (func(t) * (height - 2));
                cr.lineTo(x, y);
            }
            cr.stroke();
            
            cr.$dispose();
        }
    }
);

// Create a selectable easing option row
function createEasingOption(easing, selectedEasing, onSelected) {
    const row = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 12,
        margin_top: 4,
        margin_bottom: 4,
        margin_start: 12,
        margin_end: 12,
    });
    row.add_css_class('easing-option');
    
    // Create preview widget
    const preview = new EasingPreview({
        easingId: easing.id,
        color: easing.color,
        width_request: 80,
        height_request: 40,
    });
    
    // Create label
    const label = new Gtk.Label({
        label: easing.name,
        halign: Gtk.Align.START,
        hexpand: true,
    });
    label.add_css_class('easing-label');
    
    // Create selection indicator
    const check = new Gtk.Image({
        icon_name: 'object-select-symbolic',
        pixel_size: 16,
        visible: easing.id === selectedEasing,
    });
    check.add_css_class('easing-check');
    
    // Pack widgets
    row.append(preview);
    row.append(label);
    row.append(check);
    
    // Add click handler
    const click = new Gtk.GestureClick();
    click.connect('pressed', () => {
        onSelected(easing.id);
    });
    row.add_controller(click);
    
    // Update selection state
    function updateSelection(isSelected) {
        check.visible = isSelected;
        if (isSelected) {
            row.add_css_class('selected');
        } else {
            row.remove_css_class('selected');
        }
    }
    
    updateSelection(easing.id === selectedEasing);
    
    // Return row with update method
    return { widget: row, updateSelection };
}

// Custom CSS for easing selector
const easingCSS = `
.easing-option {
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 200ms ease;
    cursor: pointer;
}

.easing-option:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.easing-option.selected {
    background-color: rgba(78, 205, 196, 0.15);
}

.easing-label {
    font-size: 13px;
    color: #ffffff;
}

.easing-check {
    color: #4ECDC4;
    opacity: 0;
    transition: opacity 200ms ease;
}

.easing-option.selected .easing-check {
    opacity: 1;
}
`;

function init() {
    // Apply custom CSS
    const cssProvider = new Gtk.CssProvider();
    cssProvider.load_from_data(easingCSS, -1);
    
    try {
        Gtk.StyleContext.add_provider_for_display(
            Gdk.Display.get_default(),
            cssProvider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        );
    } catch (e) {
        logError(`Error applying CSS: ${e}`);
    }
}

function fillPreferencesWindow(window) {
    const settings = new Gio.Settings({
        schema_id: 'org.gnome.shell.extensions.spotlight',
    });

    // Main preferences page
    const mainPage = new Adw.PreferencesPage({
        title: 'General',
        icon_name: 'video-x-generic-symbolic',
    });

    // Common settings group
    const commonGroup = new Adw.PreferencesGroup({
        title: 'Common Settings',
        description: 'Settings that apply to all shaders',
    });

    // Shader type
    const shaderTypeRow = new Adw.ComboRow({
        title: 'Shader Type',
        model: new Gtk.StringList({
            strings: [
                'spotlight', 'ripple', 'scanline', 'vignette',
                'blur', 'glow', 'invert', 'pixelate',
                'edge', 'colorShift', 'grid', 'neon', 'heatmap'
            ],
        }),
    });
    settings.bind('shader-type', shaderTypeRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(shaderTypeRow);

    // Radius
    const radiusRow = new Adw.SpinRow({
        title: 'Radius',
        adjustment: new Gtk.Adjustment({
            lower: 0.0,
            upper: 1.0,
            step_increment: 0.01,
            page_increment: 0.1,
        }),
    });
    settings.bind('radius', radiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(radiusRow);

    // Color
    const colorRow = new Adw.ColorRow({
        title: 'Color',
        show_alpha: false,
    });
    settings.bind('color', colorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(colorRow);

    // Opacity
    const opacityRow = new Adw.SpinRow({
        title: 'Opacity',
        adjustment: new Gtk.Adjustment({
            lower: 0.0,
            upper: 1.0,
            step_increment: 0.01,
            page_increment: 0.1,
        }),
    });
    settings.bind('opacity', opacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(opacityRow);

    // Fade delay
    const fadeDelayRow = new Adw.SpinRow({
        title: 'Fade Delay (ms)',
        adjustment: new Gtk.Adjustment({
            lower: 0,
            upper: 5000,
            step_increment: 100,
            page_increment: 500,
        }),
    });
    settings.bind('fade-delay', fadeDelayRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(fadeDelayRow);

    mainPage.add(commonGroup);
    window.add(mainPage);

    // Create Easing Selection Page
    const easingPage = new Adw.PreferencesPage({
        title: 'Easing Functions',
        icon_name: 'graph-symbolic',
    });

    // Get current easing values
    let currentFadeEasing = settings.get_string('fade-easing');
    let currentAnimationEasing = settings.get_string('animation-easing');

    // Create easing selection groups by category
    const categories = {};
    for (const easing of easingOptions) {
        if (!categories[easing.category]) {
            categories[easing.category] = [];
        }
        categories[easing.category].push(easing);
    }

    // Store all option widgets for updates
    const fadeOptions = [];
    const animOptions = [];

    // Add Fade Easing section
    const fadeEasingGroup = new Adw.PreferencesGroup({
        title: 'Fade Easing',
        description: 'Easing function for fade in/out animations',
    });

    for (const [category, easings] of Object.entries(categories)) {
        const categoryGroup = new Adw.PreferencesGroup({
            title: category,
            margin_top: 12,
        });

        for (const easing of easings) {
            const option = createEasingOption(easing, currentFadeEasing, (id) => {
                currentFadeEasing = id;
                settings.set_string('fade-easing', id);
                for (const opt of fadeOptions) {
                    const label = opt.widget.get_children()[1];
                    opt.updateSelection(easing.id === id);
                }
            });
            fadeOptions.push(option);
            categoryGroup.add(option.widget);
        }

        fadeEasingGroup.add(categoryGroup);
    }

    easingPage.add(fadeEasingGroup);

    // Add Animation Easing section
    const animEasingGroup = new Adw.PreferencesGroup({
        title: 'Animation Easing',
        description: 'Easing function for time-based animations (ripple, neon)',
        margin_top: 24,
    });

    for (const [category, easings] of Object.entries(categories)) {
        const categoryGroup = new Adw.PreferencesGroup({
            title: category,
            margin_top: 12,
        });

        for (const easing of easings) {
            const option = createEasingOption(easing, currentAnimationEasing, (id) => {
                currentAnimationEasing = id;
                settings.set_string('animation-easing', id);
                for (const opt of animOptions) {
                    opt.updateSelection(easing.id === id);
                }
            });
            animOptions.push(option);
            categoryGroup.add(option.widget);
        }

        animEasingGroup.add(categoryGroup);
    }

    easingPage.add(animEasingGroup);
    window.add(easingPage);

    // Shader-specific pages
    const shaderPages = {};

    // Spotlight
    shaderPages.spotlight = new Adw.PreferencesPage({ title: 'Spotlight', icon_name: 'lightbulb-symbolic' });
    const spotlightGroup = new Adw.PreferencesGroup({ title: 'Spotlight Settings' });
    const spotlightFalloffRow = new Adw.SpinRow({
        title: 'Falloff Factor',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('spotlight-falloff', spotlightFalloffRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    spotlightGroup.add(spotlightFalloffRow);
    shaderPages.spotlight.add(spotlightGroup);
    window.add(shaderPages.spotlight);

    // Ripple
    shaderPages.ripple = new Adw.PreferencesPage({ title: 'Ripple', icon_name: 'water-symbolic' });
    const rippleGroup = new Adw.PreferencesGroup({ title: 'Ripple Settings' });
    const rippleSpeedRow = new Adw.SpinRow({
        title: 'Speed',
        adjustment: new Gtk.Adjustment({ lower: 1.0, upper: 20.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('ripple-speed', rippleSpeedRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    rippleGroup.add(rippleSpeedRow);

    const rippleFrequencyRow = new Adw.SpinRow({
        title: 'Frequency',
        adjustment: new Gtk.Adjustment({ lower: 1.0, upper: 50.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('ripple-frequency', rippleFrequencyRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    rippleGroup.add(rippleFrequencyRow);

    const rippleAmplitudeRow = new Adw.SpinRow({
        title: 'Amplitude',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('ripple-amplitude', rippleAmplitudeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    rippleGroup.add(rippleAmplitudeRow);
    shaderPages.ripple.add(rippleGroup);
    window.add(shaderPages.ripple);

    // Scanline
    shaderPages.scanline = new Adw.PreferencesPage({ title: 'Scanline', icon_name: 'video-display-symbolic' });
    const scanlineGroup = new Adw.PreferencesGroup({ title: 'Scanline Settings' });
    const scanlineWidthRow = new Adw.SpinRow({
        title: 'Width',
        adjustment: new Gtk.Adjustment({ lower: 0.001, upper: 0.1, step_increment: 0.001, page_increment: 0.01 }),
    });
    settings.bind('scanline-width', scanlineWidthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    scanlineGroup.add(scanlineWidthRow);

    const scanlineHorizontalRow = new Adw.SwitchRow({ title: 'Horizontal', active: true });
    settings.bind('scanline-horizontal', scanlineHorizontalRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    scanlineGroup.add(scanlineHorizontalRow);

    const scanlineDensityRow = new Adw.SpinRow({
        title: 'Density',
        adjustment: new Gtk.Adjustment({ lower: 10.0, upper: 200.0, step_increment: 1.0, page_increment: 10.0 }),
    });
    settings.bind('scanline-density', scanlineDensityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    scanlineGroup.add(scanlineDensityRow);
    shaderPages.scanline.add(scanlineGroup);
    window.add(shaderPages.scanline);

    // Vignette
    shaderPages.vignette = new Adw.PreferencesPage({ title: 'Vignette', icon_name: 'applications-graphics-symbolic' });
    const vignetteGroup = new Adw.PreferencesGroup({ title: 'Vignette Settings' });
    const vignetteStrengthRow = new Adw.SpinRow({
        title: 'Strength',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('vignette-strength', vignetteStrengthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    vignetteGroup.add(vignetteStrengthRow);

    const vignetteInnerRadiusRow = new Adw.SpinRow({
        title: 'Inner Radius',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('vignette-inner-radius', vignetteInnerRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    vignetteGroup.add(vignetteInnerRadiusRow);

    const vignetteOuterRadiusRow = new Adw.SpinRow({
        title: 'Outer Radius',
        adjustment: new Gtk.Adjustment({ lower: 1.0, upper: 2.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('vignette-outer-radius', vignetteOuterRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    vignetteGroup.add(vignetteOuterRadiusRow);
    shaderPages.vignette.add(vignetteGroup);
    window.add(shaderPages.vignette);

    // Blur
    shaderPages.blur = new Adw.PreferencesPage({ title: 'Blur', icon_name: 'blur-symbolic' });
    const blurGroup = new Adw.PreferencesGroup({ title: 'Blur Settings' });
    const blurRadiusRow = new Adw.SpinRow({
        title: 'Blur Radius',
        adjustment: new Gtk.Adjustment({ lower: 1.0, upper: 50.0, step_increment: 1.0, page_increment: 5.0 }),
    });
    settings.bind('blur-radius', blurRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    blurGroup.add(blurRadiusRow);

    const blurKernelSizeRow = new Adw.ComboRow({
        title: 'Kernel Size',
        model: new Gtk.StringList({ strings: ['3', '5'] }),
    });
    settings.bind('blur-kernel-size', blurKernelSizeRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    blurGroup.add(blurKernelSizeRow);

    const blurIterationsRow = new Adw.SpinRow({
        title: 'Iterations',
        adjustment: new Gtk.Adjustment({ lower: 1, upper: 3, step_increment: 1, page_increment: 1 }),
    });
    settings.bind('blur-iterations', blurIterationsRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    blurGroup.add(blurIterationsRow);
    shaderPages.blur.add(blurGroup);
    window.add(shaderPages.blur);

    // Glow
    shaderPages.glow = new Adw.PreferencesPage({ title: 'Glow', icon_name: 'starred-symbolic' });
    const glowGroup = new Adw.PreferencesGroup({ title: 'Glow Settings' });
    const glowIntensityRow = new Adw.SpinRow({
        title: 'Intensity',
        adjustment: new Gtk.Adjustment({ lower: 0.1, upper: 10.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('glow-intensity', glowIntensityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    glowGroup.add(glowIntensityRow);

    const glowFalloffRow = new Adw.SpinRow({
        title: 'Falloff',
        adjustment: new Gtk.Adjustment({ lower: 1.0, upper: 20.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('glow-falloff', glowFalloffRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    glowGroup.add(glowFalloffRow);

    const glowPulseSpeedRow = new Adw.SpinRow({
        title: 'Pulse Speed',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 10.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('glow-pulse-speed', glowPulseSpeedRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    glowGroup.add(glowPulseSpeedRow);
    shaderPages.glow.add(glowGroup);
    window.add(shaderPages.glow);

    // Invert
    shaderPages.invert = new Adw.PreferencesPage({ title: 'Invert', icon_name: 'invert-symbolic' });
    const invertGroup = new Adw.PreferencesGroup({ title: 'Invert Settings' });
    const invertAlphaRow = new Adw.SwitchRow({ title: 'Invert Alpha', active: false });
    settings.bind('invert-alpha', invertAlphaRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    invertGroup.add(invertAlphaRow);
    shaderPages.invert.add(invertGroup);
    window.add(shaderPages.invert);

    // Pixelate
    shaderPages.pixelate = new Adw.PreferencesPage({ title: 'Pixelate', icon_name: 'view-grid-symbolic' });
    const pixelateGroup = new Adw.PreferencesGroup({ title: 'Pixelate Settings' });
    const pixelSizeRow = new Adw.SpinRow({
        title: 'Pixel Size',
        adjustment: new Gtk.Adjustment({ lower: 0.01, upper: 0.2, step_increment: 0.01, page_increment: 0.05 }),
    });
    settings.bind('pixel-size', pixelSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    pixelateGroup.add(pixelSizeRow);

    const pixelShapeRow = new Adw.ComboRow({
        title: 'Pixel Shape',
        model: new Gtk.StringList({ strings: ['square', 'circle'] }),
    });
    settings.bind('pixel-shape', pixelShapeRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    pixelateGroup.add(pixelShapeRow);
    shaderPages.pixelate.add(pixelateGroup);
    window.add(shaderPages.pixelate);

    // Edge Detection
    shaderPages.edge = new Adw.PreferencesPage({ title: 'Edge Detection', icon_name: 'selection-symbolic' });
    const edgeGroup = new Adw.PreferencesGroup({ title: 'Edge Detection Settings' });
    const edgeColorRow = new Adw.ColorRow({ title: 'Edge Color', show_alpha: false });
    settings.bind('edge-color', edgeColorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    edgeGroup.add(edgeColorRow);

    const edgeThresholdRow = new Adw.SpinRow({
        title: 'Threshold',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('edge-threshold', edgeThresholdRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    edgeGroup.add(edgeThresholdRow);

    const edgeKernelRow = new Adw.ComboRow({
        title: 'Kernel Type',
        model: new Gtk.StringList({ strings: ['sobel', 'prewitt', 'laplacian'] }),
    });
    settings.bind('edge-kernel', edgeKernelRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    edgeGroup.add(edgeKernelRow);
    shaderPages.edge.add(edgeGroup);
    window.add(shaderPages.edge);

    // Color Shift
    shaderPages.colorShift = new Adw.PreferencesPage({ title: 'Color Shift', icon_name: 'color-select-symbolic' });
    const colorShiftGroup = new Adw.PreferencesGroup({ title: 'Color Shift Settings' });
    const hueShiftRow = new Adw.SpinRow({
        title: 'Hue Shift',
        adjustment: new Gtk.Adjustment({ lower: -3.14159, upper: 3.14159, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('hue-shift', hueShiftRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    colorShiftGroup.add(hueShiftRow);

    const saturationRow = new Adw.SpinRow({
        title: 'Saturation',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 2.0, step_increment: 0.1, page_increment: 0.5 }),
    });
    settings.bind('saturation', saturationRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    colorShiftGroup.add(saturationRow);

    const brightnessRow = new Adw.SpinRow({
        title: 'Brightness',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 2.0, step_increment: 0.1, page_increment: 0.5 }),
    });
    settings.bind('brightness', brightnessRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    colorShiftGroup.add(brightnessRow);
    shaderPages.colorShift.add(colorShiftGroup);
    window.add(shaderPages.colorShift);

    // Grid
    shaderPages.grid = new Adw.PreferencesPage({ title: 'Grid', icon_name: 'grid-symbolic' });
    const gridGroup = new Adw.PreferencesGroup({ title: 'Grid Settings' });
    const gridSizeRow = new Adw.SpinRow({
        title: 'Grid Size',
        adjustment: new Gtk.Adjustment({ lower: 0.01, upper: 0.5, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('grid-size', gridSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    gridGroup.add(gridSizeRow);

    const gridThicknessRow = new Adw.SpinRow({
        title: 'Grid Thickness',
        adjustment: new Gtk.Adjustment({ lower: 0.001, upper: 0.05, step_increment: 0.001, page_increment: 0.01 }),
    });
    settings.bind('grid-thickness', gridThicknessRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    gridGroup.add(gridThicknessRow);

    const gridColorRow = new Adw.ColorRow({ title: 'Grid Color', show_alpha: false });
    settings.bind('grid-color', gridColorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    gridGroup.add(gridColorRow);

    const gridSnapRow = new Adw.SwitchRow({ title: 'Snap to Mouse', active: true });
    settings.bind('grid-snap-to-mouse', gridSnapRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    gridGroup.add(gridSnapRow);
    shaderPages.grid.add(gridGroup);
    window.add(shaderPages.grid);

    // Neon
    shaderPages.neon = new Adw.PreferencesPage({ title: 'Neon', icon_name: 'lightbulb-symbolic' });
    const neonGroup = new Adw.PreferencesGroup({ title: 'Neon Settings' });
    const neonGlowStrengthRow = new Adw.SpinRow({
        title: 'Glow Strength',
        adjustment: new Gtk.Adjustment({ lower: 0.1, upper: 10.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('neon-glow-strength', neonGlowStrengthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    neonGroup.add(neonGlowStrengthRow);

    const neonPulseSpeedRow = new Adw.SpinRow({
        title: 'Pulse Speed',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 10.0, step_increment: 0.1, page_increment: 1.0 }),
    });
    settings.bind('neon-pulse-speed', neonPulseSpeedRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    neonGroup.add(neonPulseSpeedRow);

    const neonColorRow = new Adw.ColorRow({ title: 'Neon Color', show_alpha: false });
    settings.bind('neon-color', neonColorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    neonGroup.add(neonColorRow);

    const neonBloomRadiusRow = new Adw.SpinRow({
        title: 'Bloom Radius',
        adjustment: new Gtk.Adjustment({ lower: 0.0, upper: 1.0, step_increment: 0.01, page_increment: 0.1 }),
    });
    settings.bind('neon-bloom-radius', neonBloomRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    neonGroup.add(neonBloomRadiusRow);
    shaderPages.neon.add(neonGroup);
    window.add(shaderPages.neon);

    // Heatmap
    shaderPages.heatmap = new Adw.PreferencesPage({ title: 'Heatmap', icon_name: 'heatmap-symbolic' });
    const heatmapGroup = new Adw.PreferencesGroup({ title: 'Heatmap Settings' });
    const heatmapHotColorRow = new Adw.ColorRow({ title: 'Hot Color', show_alpha: false });
    settings.bind('heatmap-hot-color', heatmapHotColorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    heatmapGroup.add(heatmapHotColorRow);

    const heatmapColdColorRow = new Adw.ColorRow({ title: 'Cold Color', show_alpha: false });
    settings.bind('heatmap-cold-color', heatmapColdColorRow, 'rgba', Gio.SettingsBindFlags.DEFAULT);
    heatmapGroup.add(heatmapColdColorRow);

    const heatmapDecayRateRow = new Adw.SpinRow({
        title: 'Decay Rate',
        adjustment: new Gtk.Adjustment({ lower: 0.01, upper: 0.1, step_increment: 0.01, page_increment: 0.05 }),
    });
    settings.bind('heatmap-decay-rate', heatmapDecayRateRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    heatmapGroup.add(heatmapDecayRateRow);

    const heatmapPointSizeRow = new Adw.SpinRow({
        title: 'Point Size',
        adjustment: new Gtk.Adjustment({ lower: 1, upper: 20, step_increment: 1, page_increment: 5 }),
    });
    settings.bind('heatmap-point-size', heatmapPointSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    heatmapGroup.add(heatmapPointSizeRow);
    shaderPages.heatmap.add(heatmapGroup);
    window.add(shaderPages.heatmap);

    // Show/hide shader pages based on selection
    settings.connect('changed::shader-type', () => {
        const shaderType = settings.get_string('shader-type');
        for (const page of Object.values(shaderPages)) {
            page.set_visible(false);
        }
        if (shaderPages[shaderType]) {
            shaderPages[shaderType].set_visible(true);
        }
    });
    settings.emit('changed::shader-type');
}
