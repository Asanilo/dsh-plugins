/**
 * dsh-settings-footer — Client half.
 *
 * dsh 0.2.1 replaced the sidebar-footer Settings trigger with the account
 * launcher: signed out it reads "⋯ 更多" and opens a second-level menu
 * (设置 / 意见反馈 / 登录). This bundle shadows the `settings.launcher` seat
 * with the previous single trigger row (gear + 设置) so the footer goes back
 * to the old layout, while the account plugin keeps providing its Settings
 * page, sign-in flow and notices.
 *
 * Registration notes:
 * - `settings.launcher` is a single slot; the shipped account launcher sits at
 *   priority 0 and the lowest priority renders, so we register at -1 to shadow
 *   it. Uninstalling/disabling this bundle restores the account launcher.
 * - The host half is empty; every resource is disposed with `ctx.effect`.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-settings-footer',
  factory(require) {
    const React = require('react');
    const primitives = require('@deepseek-ai/dsh-client-ui-primitives');

    const h = React.createElement;

    const NS = 'dsh-settings-footer';
    const zh = { trigger: '设置' };
    const en = { trigger: 'Settings' };

    // Same geometry/colors as the shipped settings trigger row (SettingsRoot
    // chrome) so the restored button matches the surrounding sidebar exactly.
    const CSS = [
      '.dshsf-trigger{box-sizing:border-box;border-radius:var(--dsw-radius-md);cursor:pointer;width:auto;min-width:0;height:42px;color:var(--dsw-alias-label-primary);background:0 0;border:none;flex:1;align-items:center;gap:8px;margin:0;padding:0 10px 0 8px;font-family:inherit;font-size:14px;line-height:22px;display:flex;overflow:hidden}',
      '.dshsf-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshsf-trigger:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}',
      '.dshsf-trigger.dshsf-rail{flex:none;justify-content:center;gap:0;width:36px;height:36px;margin:0;padding:0}',
      '.dshsf-label{white-space:nowrap;overflow:hidden}',
    ].join('');

    /**
     * The sidebar-footer Settings trigger: icon, label in the wide column, and
     * the settings keyboard shortcut in the tooltip.
     * @param props - launcher owner props plus the bound locale translate.
     */
    function SettingsTrigger({ wide, settingsOpen, openSettings, settingsShortcut, t }) {
      const label = t('trigger');
      const button = h(
        'button',
        {
          type: 'button',
          className: wide ? 'dshsf-trigger' : 'dshsf-trigger dshsf-rail',
          'aria-label': label,
          'aria-haspopup': 'dialog',
          'aria-expanded': settingsOpen ? 'true' : 'false',
          'aria-keyshortcuts': settingsShortcut && settingsShortcut.aria,
          onClick: () => openSettings(),
        },
        h(primitives.IconSettingsOutlineMedium, { size: wide ? 16 : 18 }),
        wide && h('span', { className: 'dshsf-label' }, label),
      );
      return h(
        primitives.Tooltip,
        { disabled: settingsOpen, label, shortcutKeys: settingsShortcut && settingsShortcut.keys },
        button,
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.plugin = '@local/dsh-settings-footer';
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        }, 'dsh-settings-footer: styles');

        ctx.effect(
          () => ctx.locale.register(NS, { zh, en }),
          'dsh-settings-footer: dictionaries',
        );

        ctx.slots.inject('settings.launcher', () =>
          ctx.slots.register(
            {
              name: 'settings.launcher',
              // Shadow the shipped account launcher (priority 0); lowest renders.
              priority: -1,
              locale: NS,
            },
            SettingsTrigger,
          ),
        );
      },
    };
  },
});
