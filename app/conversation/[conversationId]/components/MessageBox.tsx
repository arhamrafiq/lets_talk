"use client"

import { useSession } from "next-auth/react"
import { fullMessageType } from "../../../Types"
import clsx from "clsx"
import Avatar from './../../../components/Avatar';
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react"
import ImageModal from './ImageModal'

interface MessageBoxProps{
    data  : fullMessageType
    isLast ?: boolean
}

const MessageBox:React.FC<MessageBoxProps> = ({data , isLast}) => {
    const session = useSession()
    const[imgModalOpen , setImgModalOpen] = useState(false)

    const isOwn = session?.data?.user?.email === data?.sender?.email
    const seenList = (data.seen || []).filter((user)=>user.email !== data?.sender?.email).map(user=>user.name).join(" , ")

    const container = clsx(
        "flex gap p-4",
        isOwn && (" justify-end")  
    )

    const avatar = clsx ( isOwn && " order-2 ")
    const body  = clsx ( "flex flex-col gap-2" , 
    isOwn && "item-end" )

    const message = clsx(
        "text-sm w-fit overflow-hidden",
        isOwn ? 'bg-sky-500 text-white' : "bg-gray-100",
        data.image ? 'rounded-md p-0' : "rounded-full py-2 px-3"
    )

  return (
    <div className={container}>
        <div className={avatar}>
            <Avatar user={data?.sender} />
        </div>
        <div className={body}>
            <div className="flex item-center gap-1">
                <div className="text-sm text-gray-500">
                    {data.sender.name}
                </div>
                <div className="text-xs text-gray-400">
                    {format(new Date(data?.createdAt) , 'p')}
                </div>
            </div>
            <div className={message}>
                <ImageModal src={data.img} isopen={imgModalOpen} onClose={()=>setImgModalOpen(false)} />
                {data?.image ? (<Image alt="image" src={data.image} height="228" width="228" className="object-cover cursor-pointer hover:scale-110 transition translate" onClick={()=>setImgModalOpen(true)} />) : (
                    <div>
                        {data.body}
                    </div>
                )}
            </div>
            {
                isLast && isOwn && seenList.length > 0 && (
                    <div className = 'text-xs font-light text-gray-500'>
                        {`Seen by ${seenList}`}
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default MessageBox