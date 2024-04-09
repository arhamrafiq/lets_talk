import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import { getCurrenrUser } from './../../action/getCurrentUser';

async function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const currentUser = await getCurrenrUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;