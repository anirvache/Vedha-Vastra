// Wrapper for every admin screen. Tells Google not to list these pages.

export const metadata = { title: 'Shop admin', robots: { index: false, follow: false } };

export default function AdminRoot({ children }) {
  return <div className="admin">{children}</div>;
}
