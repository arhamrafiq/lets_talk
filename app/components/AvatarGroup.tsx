"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface Props {
  users?: User[];
}

const AvatarGroup: React.FC<Props> = ({ users }) => {
  const UserSlice = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-11 w-11">
      {UserSlice.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[23px] ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image
            alt="Avatar"
            fill
            src={user?.image || "/images/placeholder_Img.jpeg"}
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
