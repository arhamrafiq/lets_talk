"use client";

import { useState, useEffect, useMemo } from "react";
import { fullConversationType } from "../../Types";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import useConversation from "../../hooks/useConversation";
import clsx from "clsx";
import ConverstionBox from "../ConverstionBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "../../libs/pusher";
import { find } from "lodash";

interface ConverstionProps {
  initialItems: fullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConverstionProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    const newHandler = (conversation: fullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation) => {
      setItems((current) =>
        current.map((cc) => {
          if (cc.id === conversation.id) {
            return {
              ...cc,
              messages: conversation.messages,
            };
          }

          return cc;
        })
      );
    };

    const deleteHandler = (conversation: fullConversationType) => {
      setItems((current) => {
        return [...current.filter((conve) => conve.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversation");
      }
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherKey , conversationId , router]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        users={users}
        onClose={() => setModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r-[1px] border-gray-200",
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd />
            </div>
          </div>
          {items.map((item) => (
            <ConverstionBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
