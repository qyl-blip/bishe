/**
 * 主题配置系统 - 现代清爽蓝（B 端后台风格）
 * 目标：统一风格、简单大气（更接近 Ant Design Pro / Element Plus 新规范）
 */

export const darkGoldTheme = {
  colors: {
    // Brand / Primary
    primary: '#1677ff',
    primaryDark: '#0958d9',
    primaryLight: '#69b1ff',

    // Compat: keep "secondary" naming used across styles
    secondary: '#1677ff',
    secondaryDark: '#0958d9',
    secondaryLight: '#4096ff',

    // Surfaces
    bgPrimary: '#f0f2f5',
    bgSecondary: '#ffffff',
    bgTertiary: '#fafafa',
    bgLight: '#f5f7fa',
    bgWhite: '#ffffff',

    // Text
    textPrimary: '#1f2225',
    textSecondary: '#515a6e',
    textTertiary: '#999999',
    textDark: '#1f2225',
    textDarkSecondary: '#515a6e',

    borderColor: '#ebeef5',
    borderLight: '#f0f0f0',
    borderDark: '#dcdfe6',

    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1677ff',
  },

  antdTheme: {
    token: {
      colorPrimary: '#1677ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1677ff',
      colorTextBase: '#1f2225',
      colorText: '#1f2225',
      colorTextSecondary: '#515a6e',
      colorBgBase: '#f0f2f5',
      colorBgLayout: '#f0f2f5',
      colorBgContainer: '#ffffff',
      colorBorder: '#ebeef5',
      borderRadius: 8,
      fontFamily: `'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    },
    algorithm: [],
  },

  styles: {
    transitions: {
      fast: '120ms',
      base: '260ms',
      slow: '520ms',
      timing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    shadows: {
      sm: '0 2px 8px rgba(5, 7, 15, 0.45)',
      md: '0 10px 24px rgba(5, 7, 15, 0.5), 0 2px 8px rgba(212, 175, 55, 0.08)',
      lg: '0 18px 42px rgba(5, 7, 15, 0.6), 0 6px 16px rgba(212, 175, 55, 0.12)',
      xl: '0 30px 70px rgba(5, 7, 15, 0.65), 0 10px 26px rgba(212, 175, 55, 0.16)',
    },
    radiuses: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '18px',
      pill: '999px',
    },
  },
};

export function getThemeConfig() {
  return darkGoldTheme;
}

export function getAntdThemeConfig() {
  return darkGoldTheme.antdTheme;
}

export function applyThemeToDom() {
  const root = document.documentElement;
  const { colors } = darkGoldTheme;

  // 用户侧通用 CSS 变量（用于自定义覆盖/统一风格）
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.secondaryLight);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.error);
  root.style.setProperty('--bg-page', colors.bgPrimary);
  root.style.setProperty('--bg-card', colors.bgWhite);
  root.style.setProperty('--bg-header', colors.bgWhite);
  root.style.setProperty('--text-main', colors.textPrimary);
  root.style.setProperty('--text-regular', colors.textSecondary);
  root.style.setProperty('--text-secondary', colors.textTertiary);
  root.style.setProperty('--border-color', colors.borderColor);
  root.style.setProperty(
    '--shadow-card',
    '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
  );

  // 兼容旧变量（项目里已有用到）
  root.style.setProperty('--color-primary-dark', colors.primaryDark);
  root.style.setProperty('--color-primary-light', colors.primaryLight);

  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-dark', colors.secondaryDark);
  root.style.setProperty('--color-secondary-light', colors.secondaryLight);

  root.style.setProperty('--color-bg-primary', colors.bgPrimary);
  root.style.setProperty('--color-bg-secondary', colors.bgSecondary);
  root.style.setProperty('--color-bg-light', colors.bgLight);

  root.style.setProperty('--color-text-primary', colors.textPrimary);
  root.style.setProperty('--color-text-secondary', colors.textSecondary);
  root.style.setProperty('--color-text-dark', colors.textDark);

  root.style.setProperty('--color-border', colors.borderColor);

  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-info', colors.info);
}

export function initializeTheme() {
  applyThemeToDom();
}

export default darkGoldTheme;
