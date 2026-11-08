# Elastic theme control

The fixed top-right control adapts the supplied React Bits RubberSegment UI for
System, Light and Dark. Equal slots include local SVG icons and Chinese labels,
with English/Chinese accessible names. It replaces the native select.

The clipped thumb carries duplicate decorative labels so their colors change
inside the thumb. Clicking stretches the thumb across the old/new slots, then
squashes and settles. Dragging the selected thumb uses rubber-band resistance
at the track ends and projected flick velocity on release. Cancel, loss of
capture, resize, blur and external preference updates restore a stable selection.

The control is a radio group with one keyboard tab stop. Arrow keys, Home and
End select and focus the next option. Space/Enter retain native button behavior.
Reduced motion disables the elastic transition. Pointer gestures allow vertical
page scrolling. A ResizeObserver keeps the thumb aligned after font or viewport
changes. The mobile control remains within the screen's safe area.

`src/theme.js` still applies the resolved theme before styles load, persists
`homepage-theme`, follows OS changes in System mode and synchronizes other tabs.
The control dispatches `themepreference`; theme state dispatches `themechange` so
all opening scenes and the control stay in sync. Public entry URLs are versioned
to avoid mixing the old select controller with the new UI in browser caches.

The component is implemented with local DOM and native Web Animations, without
adding React or Motion to this static site. Tests cover tap/drag/cancel, keyboard
navigation, reduced motion, preference persistence, OS changes and cross-tab sync.
