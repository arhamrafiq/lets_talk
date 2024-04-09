"use client";

import Modal from "../../../components/Modal";
import Image from "next/image";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  src?: string | null;
}

const ImageModal: React.FC<Props> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image alt="img" className="object-cover" fill src={src} />
      </div>
    </Modal>
  );
};

export default ImageModal;
