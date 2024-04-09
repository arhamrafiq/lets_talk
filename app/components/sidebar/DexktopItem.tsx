"use client"

import clsx from "clsx"
import Link from "next/link"

interface DextopItemProps{
  label : String,
  icon : any,
  href : String , 
  onClick ?: ()=>void,
  active?: boolean
}

const DexktopItem: React.FC<DextopItemProps> = ({
  label,
  icon : Icon,
  href,
  onClick,
  active
}) => {
  const handleClick = ()=>{
    if (onClick) {
      return onClick()
    }
  }



  return (
    <li onClick={handleClick}>
      <Link
       href={href}
       className={clsx(`
       group
       flex
       gap-x-3
       rounded-md
       text-sm
       leading-6
       font-semibold
       w-full
       justify-center
       p-3
       text-gray-500
       hover:text-black
       hover:bg-gray-500
       `,
       active && ("bg-gray-100 text-black"))}
       >
        <Icon className="h-6 w-6 shrink-0"/>
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )

}

export default DexktopItem