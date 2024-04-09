import prisma from "../libs/prisma"
import { getCurrenrUser } from "./getCurrentUser"

const getConversation = async () => {
    const currentUser = await getCurrenrUser()

    if (!currentUser) {
        return [] ; 
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy:{
                LastMesssageAt : 'desc'
            },
            where : {
                userIds : {
                    has : currentUser.id
                }
            },
            include : {
                users : true,
                messages : {
                    include : {
                        sender : true,
                        seen : true
                    }
                }
            }
        })

        return conversations;
    } catch (error) {
        return []
    }
}

export default getConversation