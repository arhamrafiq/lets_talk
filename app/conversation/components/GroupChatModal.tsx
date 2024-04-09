"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import Input from "./../../components/input/Input";
import Select from "../../components/input/Select";
import Button from "../../components/Button";
import { type } from "./../../Types/index";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  users: User[];
}

const GroupChatModal: React.FC<Props> = ({ isOpen, onClose, users }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    axios
      .post("/api/conversation", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-d border-gray-900 pb-12">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Create A Group Chat
            </h2>
            <p className="mt-1 leading-6 text-sm text-gray-900">
              Start A chat with more people
            </p>
            <div className="mt-10 flex flex-col gap-y-78">
              <Input
                type="text"
                id="name"
                label="Group Name"
                register={register}
                disabled={loading}
                errors={errors}
                required
              />
              <Select
                disabled={loading}
                label="Members"
                options={users?.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={loading} onClick={onClose} type="button" secondary>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
