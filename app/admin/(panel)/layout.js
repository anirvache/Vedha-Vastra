import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function PanelLayout({ children }) {
  return (
    <>
      <div className="admin-bar">
        <Link href="/admin" className="admin-home">Home</Link>
        <span className="admin-title">Shop admin</span>
        <LogoutButton />
      </div>
      <div className="admin-wrap">{children}</div>
    </>
  );
}
