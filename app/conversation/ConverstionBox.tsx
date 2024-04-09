"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, User, Message } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { fullConversationType } from "../Types";
import useOtherUser from "../hooks/useOtherUser";
import Avatar from "./../components/Avatar";
import AvatarGroup from "../components/AvatarGroup";

interface ConversationProps {
  data: fullConversationType;
  selected: boolean;
}

const ConverstionBox: React.FC<ConversationProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversation/${data.id}`);
  }, [data.id, router]);

  const LastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data?.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!LastMessage) {
      return false;
    }
    const seenArray = LastMessage?.seen || [];
    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email !== userEmail).length !== 0;
  }, [userEmail, LastMessage]);

  const lastMessageText = useMemo(() => {
    if (LastMessage?.image) {
      return "Sent an Image";
    }
    if (LastMessage?.body) {
      return LastMessage.body;
    }

    return "Start a Converstion";
  }, [LastMessage]);
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex item-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data?.isGroup ? (
        <AvatarGroup users={data?.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data?.name || otherUser.name}
            </p>
            {LastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(LastMessage?.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncute text-sm",
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConverstionBox;
