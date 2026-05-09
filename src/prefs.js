const { GObject, Gio, Gtk, Adw, Gdk, GLib } = imports.gi;

// Easing functions metadata with colors and SVG previews
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

// SVG path data for each easing curve
const easingPaths = {
    linear: 'M10,30 L90,30',
    'ease-in-quad': 'M10,30 Q30,30 90,10',
    'ease-out-quad': 'M10,10 Q70,10 90,30',
    'ease-in-out-quad': 'M10,10 Q30,10 50,20 Q70,30 90,30',
    'ease-in-cubic': 'M10,30 C25,30 35,20 90,10',
    'ease-out-cubic': 'M10,10 C75,10 85,20 90,30',
    'ease-in-out-cubic': 'M10,10 C20,10 40,15 50,20 C60,25 80,30 90,30',
    'ease-in-quart': 'M10,30 C20,30 30,20 90,10',
    'ease-out-quart': 'M10,10 C80,10 85,15 90,30',
    'ease-in-out-quart': 'M10,10 C20,10 35,12 50,20 C65,28 80,30 90,30',
    'ease-in-quint': 'M10,30 C18,30 28,20 90,10',
    'ease-out-quint': 'M10,10 C82,10 88,15 90,30',
    'ease-in-out-quint': 'M10,10 C18,10 32,12 50,20 C68,28 82,30 90,30',
    'ease-in-sine': 'M10,30 C20,30 32,18 90,10',
    'ease-out-sine': 'M10,10 C80,10 88,22 90,30',
    'ease-in-out-sine': 'M10,10 C20,10 32,14 50,20 C68,26 80,30 90,30',
    'ease-in-expo': 'M10,30 C15,30 22,20 90,10',
    'ease-out-expo': 'M10,10 C88,10 92,18 90,30',
    'ease-in-out-expo': 'M10,10 C15,10 28,12 50,20 C72,28 85,30 90,30',
    'ease-in-circ': 'M10,30 C18,30 32,15 90,10',
    'ease-out-circ': 'M10,10 C82,10 88,25 90,30',
    'ease-in-out-circ': 'M10,10 C18,10 32,12 50,20 C68,28 82,30 90,30',
    'ease-in-back': 'M10,30 C5,40 25,5 90,10',
    'ease-out-back': 'M10,10 C85,5 88,40 90,30',
    'ease-in-out-back': 'M10,10 C5,40 30,5 50,20 C70,30 95,5 90,30',
    'ease-in-elastic': 'M10,30 C12,45 22,5 30,40 C38,55 45,15 55,45 C62,5 72,55 80,15 C88,55 90,30',
    'ease-out-elastic': 'M10,10 C20,45 30,55 40,5 C50,55 60,5 70,55 C80,5 85,45 90,30',
    'ease-in-out-elastic': 'M10,10 C12,45 20,55 28,5 C35,55 42,5 50,20 C58,55 65,5 72,55 C80,5 85,45 90,30',
    'ease-in-bounce': 'M10,30 L22,30 L24,12 L32,30 L36,20 L44,30 L48,8 L56,30 L60,18 L68,30 L72,8 L80,30 L84,12 L92,30 L90,10',
    'ease-out-bounce': 'M10,10 L18,10 L20,28 L28,10 L32,38 L40,10 L44,30 L52,10 L56,42 L64,10 L68,38 L76,10 L80,38 L88,10 L90,30',
    'ease-in-out-bounce': 'M10,10 L14,10 L16,26 L22,10 L26,32 L32,10 L36,22 L42,10 L46,32 L52,10 L56,18 L62,10 L66,32 L72,10 L76,22 L82,10 L86,32 L92,10 L90,30',
};

// Create SVG image widget for easing preview
function createEasingSVG(easing, width = 80, height = 40) {
    const path = easingPaths[easing.id] || easingPaths.linear;
    const color = easing.color;
    
    const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="40" fill="#1e1e2e" rx="4"/>
  <path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="10" y1="30" x2="90" y2="30" stroke="#333" stroke-width="0.5" stroke-dasharray="2,2"/>
  <line x1="10" y1="10" x2="10" y2="30" stroke="#333" stroke-width="0.5" stroke-dasharray="2,2"/>
  <line x1="90" y1="10" x2="90" y2="30" stroke="#333" stroke-width="0.5" stroke-dasharray="2,2"/>
</svg>
    `;
    
    // Create a pixbuf from SVG string
    const bytes = new GLib.Bytes(svg);
    const stream = Gio.MemoryInputStream.new_from_bytes(bytes);
    
    try {
        const pixbuf = Gdk.pixbuf_new_from_stream(stream, null);
        if (pixbuf) {
            const image = new Gtk.Image();
            image.set_from_pixbuf(pixbuf);
            return image;
        }
    } catch (e) {
        logError(`Error creating SVG for ${easing.id}: ${e}`);
    }
    
    // Fallback: create a colored rectangle
    const fallback = new Gtk.Label({ label: easing.name.substring(0, 3), halign: Gtk.Align.CENTER });
    fallback.add_css_class('easing-fallback');
    return fallback;
}

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
    
    // Create SVG preview
    const svgWidget = createEasingSVG(easing, 80, 40);
    svgWidget.set_size_request(80, 40);
    
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
    row.append(svgWidget);
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
            row.remove_css_class('easing-option');
        } else {
            row.remove_css_class('selected');
            row.add_css_class('easing-option');
        }
    }
    
    updateSelection(easing.id === selectedEasing);
    
    // Return row with update method
    return { widget: row, updateSelection };
}

// Create a category group
function createEasingCategory(categoryName, easings, selectedEasing, onSelected) {
    const group = new Adw.PreferencesGroup({
        title: categoryName,
        margin_top: 12,
    });
    
    const options = [];
    
    for (const easing of easings) {
        const option = createEasingOption(easing, selectedEasing, (id) => {
            onSelected(id);
            // Update all options in this category
            for (const opt of options) {
                opt.updateSelection(opt.widget.get_children()[1].get_label() === easingOptions.find(e => e.id === id)?.name);
            }
        });
        options.push(option);
        group.add(option.widget);
    }
    
    return group;
}

// Custom CSS for easing selector
const easingCSS = `
.easing-option {
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 200ms ease;
}

.easing-option:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.easing-option.selected {
    background-color: rgba(255, 255, 255, 0.1);
}

.easing-label {
    font-size: 13px;
    color: #ffffff;
}

.easing-check {
    color: #4ECDC4;
}

.easing-fallback {
    width: 80px;
    height: 40px;
    background-color: #333;
    border-radius: 4px;
    color: #fff;
    font-size: 10px;
}
`;

function init() {
    // Apply custom CSS
    const cssProvider = new Gtk.CssProvider();
    cssProvider.load_from_data(easingCSS, -1);
    Gtk.StyleContext.add_provider_for_display(
        Gdk.Display.get_default(),
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );
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
                    const easingObj = easingOptions.find(e => e.id === id);
                    opt.updateSelection(label.get_label() === easingObj?.name);
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
                    const label = opt.widget.get_children()[1];
                    const easingObj = easingOptions.find(e => e.id === id);
                    opt.updateSelection(label.get_label() === easingObj?.name);
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
