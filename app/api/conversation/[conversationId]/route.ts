import { NextResponse } from "next/server"
import { getCurrenrUser } from "../../../action/getCurrentUser"
import { pusherServer } from "../../../libs/pusher"

interface IParams{
    conversationId : string
}

export async function DELETE( request : Request , {params} : {params : IParams}){
    try {
        const currentUser = await getCurrenrUser()
        const {conversationId} = params

        if (!currentUser?.id) {
            return new NextResponse("UnAuthorized" , {status : 401})
        }

        const existingConversation = await prisma.conversation.findUnique({
            where : {
                id : conversationId
            },
            include : {
                users : true
            }
        })

        if (!existingConversation) {
            return new NextResponse("Canot Find the conversation" , {status : 402})
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where : {
                id  : conversationId,
                userIds : {
                    hasSome : [currentUser?.id]
                }
            }
        })


        existingConversation.users.forEach(user => {
            if(user.email){
                pusherServer.trigger(user.email , "conversation:delete" , existingConversation)
            }
        });

        return NextResponse.json(deleteConversation)

    } catch (error : any) {
        console.log(error , "Conversation Delete")
        return new NextResponse('Internal Err' , {status : 500})
    }
}