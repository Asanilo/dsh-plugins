/**
 * dsh-mobile-hide — Client half.
 *
 * Small, self-owned mobile tweaks for the DSH Web UI. Everything is scoped to
 * narrow touch screens (and, for layout, to the portrait adaptation layer that
 * `@linxin666/dsh-remote-web-ui` puts on <body>), so a desktop browser on the
 * same profile is never affected.
 *
 * Two groups of rules:
 *
 * 1. HIDE — surfaces that are desktop-only or unusable on a phone:
 *    - `.dsh-pet-root` — the dsh-pet mascot. It is a fixed-position overlay with
 *      no `touch-action`, so on a phone its drag handler never wins gesture
 *      arbitration (the browser claims the touch for scrolling). The pet still
 *      lives on the desktop.
 *    - `.meme-trigger` — the dsh-meme button registered into
 *      `conversation.input.left`. Only the trigger is hidden; the picker overlay
 *      and every host-side capability stay installed.
 *
 * 2. LAYOUT — the composer control row. The portrait layer wraps the row into
 *    two lines (`[class$="_row"]{flex-wrap:wrap}` plus `[class$="_trailing"]`
 *    `flex-basis:100%`), which stacks the permission picker above the model
 *    picker. This puts them back on one line: the "+" button and the send
 *    button are absolutely positioned by that layer, so the flow content is
 *    just the modes group and the trailing group.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-mobile-hide',
  factory() {
    /** Phone/tablet: the same breakpoint family the mobile adaptation layers use. */
    const MEDIA = '(max-width: 1100px) and (pointer: coarse)';

    /** Selectors hidden inside MEDIA. Add more lines here — one per surface. */
    const HIDDEN = [
      // dsh-pet mascot (fixed overlay, no touch-action)
      '.dsh-pet-root',
      // dsh-meme composer trigger button
      '.meme-trigger',
    ];

    /**
     * Composer row rules. Scoped to `body.dsh-remote-portrait` because the
     * geometry they adjust (the 38px left inset for the absolute "+" button,
     * the 46px right inset for the absolute send button) is produced by that
     * layer; outside portrait the host's own layout is already correct.
     */
    const COMPOSER = [
      // one line: "+" (absolute, left) | modes (permission/plan) | trailing | send (absolute, right).
      // The `html body` prefix is load-bearing: these override rules from the
      // adaptation layer's own <style>, which is appended to <head> later than
      // ours, so equal specificity would lose on source order.
      'html body.dsh-remote-portrait [class$="_composerSeat"] [class$="_row"]{flex-wrap:nowrap;align-items:center;column-gap:0;min-height:40px;padding-top:6px;padding-bottom:6px}',
      // the modes group itself stays a row even if more than one entry registers;
      // 48px keeps a readable gap from the absolutely positioned "+" (left 8 + 28 wide)
      'html body.dsh-remote-portrait [class$="_composerSeat"] [class$="_modes"]{display:flex;align-items:center;gap:8px;flex:none;min-width:0;padding-left:48px}',
      // trailing joins the line and hugs the send button (right-aligned, like the
      // desktop layout) instead of leaving a dead gap in the middle
      'html body.dsh-remote-portrait [class$="_composerSeat"] [class$="_trailing"]{flex:1 1 auto;flex-basis:auto;flex-wrap:nowrap;min-width:0;min-height:0;justify-content:flex-end;align-items:center;gap:8px;padding-left:0;padding-right:50px}',
      // the model/right-slot group fills the trailing box and right-aligns inside it,
      // so the model selector sits next to the send button whatever the wrapper does
      'html body.dsh-remote-portrait [class$="_composerSeat"] [class$="_standardControls"]{flex:1 1 auto;min-width:0;justify-content:flex-end;gap:8px}',
      // the model select may shrink and ellipsize rather than push the send button
      'html body.dsh-remote-portrait [class$="_composerSeat"] [class$="_select"]{min-width:0}',
    ];

    const CSS =
      `@media ${MEDIA}{` +
      HIDDEN.map((selector) => `${selector}{display:none !important}`).join('') +
      COMPOSER.join('') +
      '}';

    return {
      inject: [],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.plugin = '@local/dsh-mobile-hide';
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        }, 'dsh-mobile-hide: styles');
      },
    };
  },
});
