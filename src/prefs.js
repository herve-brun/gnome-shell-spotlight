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

// Generate SVG path for easing curve preview
function generateEasingPath(easingId) {
    // Simplified path generation for each easing type
    const paths = {
        linear: 'M0,50 L100,50',
        'ease-in-quad': 'M0,50 Q25,50 100,0',
        'ease-out-quad': 'M0,0 Q75,0 100,50',
        'ease-in-out-quad': 'M0,0 Q25,0 50,25 Q75,50 100,50',
        'ease-in-cubic': 'M0,50 C15,50 30,30 100,0',
        'ease-out-cubic': 'M0,0 C70,0 85,20 100,50',
        'ease-in-out-cubic': 'M0,0 C15,0 40,20 50,25 C60,30 85,50 100,50',
        'ease-in-quart': 'M0,50 C12,50 25,35 100,0',
        'ease-out-quart': 'M0,0 C75,0 88,15 100,50',
        'ease-in-out-quart': 'M0,0 C12,0 35,15 50,25 C65,35 88,50 100,50',
        'ease-in-quint': 'M0,50 C10,50 22,30 100,0',
        'ease-out-quint': 'M0,0 C78,0 90,10 100,50',
        'ease-in-out-quint': 'M0,0 C10,0 35,10 50,25 C65,40 90,50 100,50',
        'ease-in-sine': 'M0,50 C18,50 32,20 100,0',
        'ease-out-sine': 'M0,0 C68,0 82,30 100,50',
        'ease-in-out-sine': 'M0,0 C18,0 32,15 50,25 C68,35 82,50 100,50',
        'ease-in-expo': 'M0,50 C8,50 18,30 100,0',
        'ease-out-expo': 'M0,0 C82,0 92,20 100,50',
        'ease-in-out-expo': 'M0,0 C8,0 25,10 50,25 C75,40 92,50 100,50',
        'ease-in-circ': 'M0,50 C15,50 28,20 100,0',
        'ease-out-circ': 'M0,0 C72,0 85,30 100,50',
        'ease-in-out-circ': 'M0,0 C15,0 35,10 50,25 C65,40 85,50 100,50',
        'ease-in-back': 'M0,50 C-5,80 20,0 100,0',
        'ease-out-back': 'M0,0 C80,105 85,0 100,50',
        'ease-in-out-back': 'M0,0 C-5,80 30,0 50,25 C70,50 105,0 100,50',
        'ease-in-elastic': 'M0,50 C5,80 20,-20 30,60 C40,100 50,20 60,80 C70,0 80,100 90,20 C100,40 100,50',
        'ease-out-elastic': 'M0,0 C10,80 30,120 40,0 C50,100 60,0 70,100 C80,0 90,80 100,50',
        'ease-in-out-elastic': 'M0,0 C5,80 15,120 25,0 C35,100 45,0 55,100 C65,0 75,80 85,0 C95,80 100,50',
        'ease-in-bounce': 'M0,50 L20,50 L25,20 L35,50 L40,30 L50,50 L55,10 L65,50 L70,25 L80,50 L85,15 L95,50 L100,0',
        'ease-out-bounce': 'M0,0 L15,0 L20,30 L30,0 L35,40 L45,0 L50,50 L55,0 L65,50 L70,0 L80,45 L85,0 L95,40 L100,50',
        'ease-in-out-bounce': 'M0,0 L10,0 L15,50 L20,20 L25,50 L30,10 L35,50 L40,30 L45,50 L50,25 L55,50 L60,15 L65,50 L70,25 L75,50 L80,10 L85,50 L90,30 L95,50 L100,25',
    };
    return paths[easingId] || paths.linear;
}

// Create easing preview widget with SVG
function createEasingPreview(easing, selectedEasing, onSelected) {
    const box = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 12,
        margin_top: 6,
        margin_bottom: 6,
        margin_start: 12,
        margin_end: 12,
    });

    // Create SVG image
    const svgPath = generateEasingPath(easing.id);
    const svgContent = `
        <svg width="80" height="60" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="50" fill="#1e1e2e" rx="4"/>
            <path d="${svgPath}" fill="none" stroke="${easing.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="0" y1="50" x2="100" y2="50" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="0" y1="0" x2="0" y2="50" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
        </svg>
    `;

    // Create image from SVG
    const svgBytes = new GLib.Bytes(svgContent);
    const svgStream = Gio.MemoryInputStream.new_from_bytes(svgBytes);
    const svgPixbuf = Gdk.pixbuf_new_from_stream(svgStream, null);
    const image = new Gtk.Image({
        gicon: new Gio.BytesIcon(svgBytes),
        pixel_size: 1,
    });
    image.set_size_request(80, 60);

    // Create label
    const label = new Gtk.Label({
        label: easing.name,
        halign: Gtk.Align.START,
        hexpand: true,
    });
    label.add_css_class('easing-name');

    // Create checkmark for selected
    const check = new Gtk.Image({
        icon_name: 'object-select-symbolic',
        pixel_size: 16,
        visible: easing.id === selectedEasing,
    });

    // Style the row
    const rowBox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    });
    rowBox.append(image);
    rowBox.append(label);
    rowBox.append(check);

    // Add click handler
    const eventController = new Gtk.GestureClick();
    eventController.connect('pressed', () => {
        onSelected(easing.id);
    });
    rowBox.add_controller(eventController);

    // Style based on selection
    if (easing.id === selectedEasing) {
        rowBox.add_css_class('easing-selected');
    } else {
        rowBox.add_css_class('easing-option');
    }

    box.append(rowBox);
    return box;
}

// Create easing category section
function createEasingCategory(categoryName, easings, selectedEasing, onSelected) {
    const group = new Adw.PreferencesGroup({
        title: categoryName,
        margin_top: 12,
    });

    for (const easing of easings) {
        const preview = createEasingPreview(easing, selectedEasing, onSelected);
        group.add(preview);
    }

    return group;
}

function init() {
    // Nothing to do here
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
    const currentFadeEasing = settings.get_string('fade-easing');
    const currentAnimationEasing = settings.get_string('animation-easing');

    // Create easing selection groups by category
    const categories = {};
    for (const easing of easingOptions) {
        if (!categories[easing.category]) {
            categories[easing.category] = [];
        }
        categories[easing.category].push(easing);
    }

    // Add category groups
    for (const [category, easings] of Object.entries(categories)) {
        const group = createEasingCategory(category, easings, currentFadeEasing, (selected) => {
            settings.set_string('fade-easing', selected);
        });
        easingPage.add(group);
    }

    // Add animation easing section
    const animEasingGroup = new Adw.PreferencesGroup({
        title: 'Animation Easing',
        description: 'Easing for time-based animations (ripple, neon)',
        margin_top: 12,
    });

    for (const [category, easings] of Object.entries(categories)) {
        const categoryGroup = new Adw.PreferencesGroup({
            title: category,
            margin_top: 12,
        });

        for (const easing of easings) {
            const preview = createEasingPreview(easing, currentAnimationEasing, (selected) => {
                settings.set_string('animation-easing', selected);
            });
            categoryGroup.add(preview);
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
