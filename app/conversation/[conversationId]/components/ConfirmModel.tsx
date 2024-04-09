"use client";

import { useRouter } from "next/navigation";
import Modal from "../../../components/Modal";
import conversationId from "./../page";
import useConversation from "../../../hooks/useConversation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import Button from "../../../components/Button";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ConfirmModel: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [loading, setLoading] = useState(false);

  const onDelete = useCallback(() => {
    setLoading(true);

    axios
      .delete(`/api/conversation/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversation");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete Conversation?
          </Dialog.Title>
          <div className="mt-2">
            <p>Are you Sure? Cant be undo</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={loading} onClick={onDelete} danger>
          Delete
        </Button>
        <Button disabled={loading} onClick={onClose} secondary>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
