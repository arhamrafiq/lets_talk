import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";
import { getUser } from './../action/getUsers';

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const users = await getUser();

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}