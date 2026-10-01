TASK: make every homepage section responsive. Storefront repo. Follow AGENTS.md.
Branch: fix/responsive-spacing from the latest main.
PLAN FIRST: reply with the audit and your plan, and wait for my OK before changing anything.

Goal: the current fixed spacing is the DESKTOP design. Keep it exactly as it is at 1536px and wider. Below that, spacing must shrink smoothly with the screen width, down to a minimum on phones.

1. Audit every homepage section. List each fixed margin, padding, and gap (for example py-[120px], mt-[80px], gap-[64px], style={{ margin: ... }}), with the file and line.
2. Also list other fixed sizes that could break on small screens: fixed widths or heights, min-widths, large fixed font sizes, absolute positions. Do not change these yet. Just report them with a suggested fix.
3. Create one shared spacing scale (Tailwind theme values or CSS variables) that uses clamp():
   - maximum = the current desktop value, reached at 1536px wide;
   - scaling smoothly with the viewport width below that;
   - minimums: about 48px between sections, 16px side margins on phones, 24px on tablets.
   Name the steps (for example section, block, gap), and map every value from step 1 to one of them.
4. In your plan, show a table: section, current value, new token, and the resulting size at 375px, 768px, 1280px, 1440px, and 1920px.