"use client"
import useConversation from '../../hooks/useConversation';
import useRoute from './../../hooks/useRoutes';
import MobileItem from './MobileItem';


const MobileFooter = () => {
    const routes = useRoute()
    const {isOpen} = useConversation()

    if (isOpen) {
        return null
    }

  return (
    <div className='fixed justify-between w-full z-40 bottom-0 flex items-center bg-white border-t-[1px] lg:hidden'>
        {
            routes?.map(item=>(
                <MobileItem
                key={item.label}
                href = {item.href}
                label = {item.label}
                icon={item.icon}
                active = {item.active}
                onClick = {item.onClick}
              />
            ))
        }

    </div>
  )
}

export default MobileFooter