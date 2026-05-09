const { GObject, Gio, Gtk, Adw } = imports.gi;

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

    // Fade easing function
    const fadeEasingRow = new Adw.ComboRow({
        title: 'Fade Easing',
        model: new Gtk.StringList({
            strings: [
                'linear', 'ease-in-quad', 'ease-out-quad', 'ease-in-out-quad',
                'ease-in-cubic', 'ease-out-cubic', 'ease-in-out-cubic',
                'ease-in-elastic', 'ease-out-elastic'
            ],
        }),
    });
    settings.bind('fade-easing', fadeEasingRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(fadeEasingRow);

    // Animation easing function
    const animationEasingRow = new Adw.ComboRow({
        title: 'Animation Easing',
        model: new Gtk.StringList({
            strings: [
                'linear', 'ease-in-quad', 'ease-out-quad', 'ease-in-out-quad',
                'ease-in-cubic', 'ease-out-cubic', 'ease-in-out-cubic',
                'ease-in-elastic', 'ease-out-elastic'
            ],
        }),
    });
    settings.bind('animation-easing', animationEasingRow, 'selected-item', Gio.SettingsBindFlags.DEFAULT);
    commonGroup.add(animationEasingRow);

    mainPage.add(commonGroup);
    window.add(mainPage);

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
