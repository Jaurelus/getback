// ---- Loan details ----
// Change these in one place and every page updates.
const TOTAL_OWED = 2602;
const NEXT_PAYMENT = { due: "December 15", amount: 300 };

// Add a line here each time a payment comes in, e.g.
//   { date: "Dec 15, 2026", amount: 300 },
const payments = [];

// ---- Shared navbar ----
const links = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Payments" },
];

function renderNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  // "" means the site root, so treat it as index.html
  const current = location.pathname.split("/").pop() || "index.html";

  nav.innerHTML = `
    <nav class="site-nav flex justify-center gap-9 sm:gap-20 py-3 sm:py-4">
      ${links
        .map(({ href, label }) => {
          const cls = href === current ? "active" : "";
          return `<a href="${href}" class="${cls}">${label}</a>`;
        })
        .join("")}
    </nav>
  `;
}

// ---- Helpers ----
const money = (n) => `$${n.toLocaleString()}`;
const totalPaid = () => payments.reduce((sum, p) => sum + p.amount, 0);

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ---- Progress bar (Home) ----
function renderBar() {
  const fill = document.getElementById("bar-fill");
  if (!fill) return;

  const paid = totalPaid();
  const percent = Math.min((paid / TOTAL_OWED) * 100, 100);

  fill.style.width = `${percent}%`;
  setText("bar-raised", money(paid));
  setText("bar-goal", money(TOTAL_OWED));
  setText("bar-percent", `${Math.round(percent)}%`);
}

// ---- Numbers that show up on several pages ----
function renderNumbers() {
  setText("balance", money(TOTAL_OWED - totalPaid()));
  setText("next-due", NEXT_PAYMENT.due);
  setText("next-amount", money(NEXT_PAYMENT.amount));
}

// ---- Payments table (Payments page) ----
function renderLedger() {
  const body = document.getElementById("ledger-body");
  if (!body) return;

  if (payments.length === 0) {
    body.innerHTML = `
      <tr><td colspan="3" style="color: var(--ink-soft); text-align: left">No payments yet.</td></tr>
    `;
    return;
  }

  let remaining = TOTAL_OWED;
  body.innerHTML = payments
    .map((p) => {
      remaining -= p.amount;
      return `<tr><td>${p.date}</td><td>${money(p.amount)}</td><td>${money(remaining)}</td></tr>`;
    })
    .join("");
}

renderNavbar();
renderNumbers();
renderLedger();
setTimeout(renderBar, 150);
