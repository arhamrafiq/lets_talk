import conversationId from '../conversation/[conversationId]/page'
import prisma from '../libs/prisma'
import { getCurrenrUser } from './getCurrentUser'

const getConversationId = async ( conversationId : string ) => {
    try {
        const currentUser = await  getCurrenrUser()

        if (!currentUser?.email) {
            return null
        }

        const conversation = await prisma.conversation.findUnique({
            where : {
                id : conversationId
            },
            include : {
                users : true
            }
        })

        return conversation

    } catch (error : any) {
        return null
    }
}

export default getConversationId