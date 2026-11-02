// Generate scoped color overrides beside each component's original CSS rules.
// Keep layout, responsive rules, alpha, and the light theme intact.
const theme = ':root[data-theme="neon-dark"]';
const colorPattern = /#[\da-f]{3,8}\b|\b(?:white|black)\b/gi;
const surfaceProperties = /^(?:background(?:-color|-image)?|fill)$/;
const lineProperties = /^(?:border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|column-rule(?:-color)?|stroke)$/;

export function parseColor(value) {
  let hex = value.toLowerCase().replace('white', '#ffffff').replace('black', '#000000').slice(1);
  if (hex.length === 3 || hex.length === 4) hex = [...hex].map(c => c + c).join('');
  const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(...rgb), min = Math.min(...rgb), delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  let hue = delta === 0 ? 0 : max === rgb[0] ? ((rgb[1] - rgb[2]) / delta) % 6 : max === rgb[1] ? (rgb[2] - rgb[0]) / delta + 2 : (rgb[0] - rgb[1]) / delta + 4;
  hue = (hue * 60 + 360) % 360;
  return {lightness, saturation, hue, alpha: hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1};
}

export function colorRole(value, property, selector) {
  const {lightness, saturation, hue} = parseColor(value);
  const chromatic = saturation > .22;
  const warm = chromatic && hue >= 15 && hue < 65;
  const green = chromatic && hue >= 75 && hue < 170;
  const red = chromatic && (hue < 15 || hue >= 345);
  if (property.includes('shadow')) return 'shadow';
  if (lineProperties.test(property)) return 'border';
  if (surfaceProperties.test(property)) {
    if (/overlay/.test(selector)) return 'backdrop';
    if (warm) return 'warm-surface';
    if (green) return 'success-surface';
    if (red) return 'danger-surface';
    if (/progress.*>i|progress-track.*>span|composition|legend|\.key-|usage-donut|squirrel-coverage>/.test(selector)) return 'blue';
    if (lightness > .97) return 'surface';
    if (lightness > .7) return 'raised';
    if (chromatic && saturation > .4 && lightness > .22) return 'brand';
    return lightness < .16 ? 'background' : 'raised';
  }
  if (warm) return 'warm';
  if (green) return 'success';
  if (red) return 'danger';
  if (/(?:^|[\s>,])(?:h[1-6]|strong|b|dt|dd)(?:\b|$)/.test(selector)) return 'text';
  if (/button|\ba\b|link|action|icon|svg|kicker|eyebrow/.test(selector)) return lightness > .88 ? 'text' : 'blue';
  if (lightness > .88 || lightness < .3) return 'text';
  return 'muted';
}

export function themedValue(value, property, selector) {
  // URL payloads include SVGs and brand assets whose colors must stay intact.
  if (value.includes('url(')) return value;
  return value.replace(colorPattern, literal => {
    const role = colorRole(literal, property, selector);
    const {alpha} = parseColor(literal);
    return alpha < 1
      ? `rgb(var(--night-${role}-rgb) / ${Number(alpha.toFixed(3))})`
      : `var(--night-${role})`;
  });
}

export default function darkColors() {
  return {
    postcssPlugin: 'sso-dark-colors',
    Once(root) {
      const file = root.source?.input.file || '';
      // Animated scenes and portrait illustrations keep their authored colors.
      if (/(?:neon-dark|splash|game|guide-portraits)\.css$/.test(file)) return;
      const rules = [];
      root.walkRules(rule => rules.push(rule));
      for (const rule of rules) {
        let ancestor = rule.parent;
        let inKeyframes = false;
        while (ancestor) {
          if (ancestor.type === 'atrule' && /keyframes$/i.test(ancestor.name)) inKeyframes = true;
          ancestor = ancestor.parent;
        }
        if (inKeyframes || rule.selector.includes('[data-theme=') || rule.selector.includes(':root')) continue;
        const declarations = [];
        for (const node of rule.nodes) {
          if (node.type !== 'decl' || node.prop.startsWith('--')) continue;
          if (!/color|background|border|outline|shadow|fill|stroke/.test(node.prop)) continue;
          const value = themedValue(node.value, node.prop, rule.selector);
          if (value !== node.value) declarations.push(node.clone({value}));
        }
        if (!declarations.length) continue;
        const selectors = rule.selectors.map(selector => `${theme} ${selector}`);
        const dark = rule.clone({selector: selectors.join(',')});
        dark.removeAll();
        for (const declaration of declarations) dark.append(declaration);
        rule.after(dark);
      }
    },
  };
}
