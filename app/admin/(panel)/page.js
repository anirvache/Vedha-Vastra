import Link from 'next/link';
import { FEATURES } from '@/config/features';

export default function AdminHome() {
  return (
    <>
      <h1>Hello! What would you like to do?</h1>
      <div className="tiles">
        <Link href="/admin/add" className="tile"><span className="tile-icon">{'\u2795'}</span><span>1. Add a new saree</span></Link>
        <Link href="/admin/my-sarees" className="tile"><span className="tile-icon">{'\uD83D\uDCCB'}</span><span>2. My sarees</span></Link>
        {FEATURES.photoTool ? (
          <Link href="/admin/photo-tool" className="tile ai"><span className="tile-icon">{'\uD83D\uDCF7'}</span><span>3. Photo tool (AI)</span></Link>
        ) : null}
        {FEATURES.descriptionTool ? (
          <Link href="/admin/text-tool" className="tile ai"><span className="tile-icon">{'\u270D\uFE0F'}</span><span>4. Description tool (AI)</span></Link>
        ) : null}
      </div>
      <p className="muted"><Link href="/" className="link">View my website</Link> &nbsp;|&nbsp; <Link href="/admin/health" className="link">Check that everything works</Link></p>
    </>
  );
}
