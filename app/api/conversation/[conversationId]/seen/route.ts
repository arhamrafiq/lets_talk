import { NextResponse } from "next/server"
import { getCurrenrUser } from "../../../../action/getCurrentUser"
import prisma from "../../../../libs/prisma"
import conversationId from './../../../../conversation/[conversationId]/page';
import { pusherServer } from "../../../../libs/pusher";

interface IParams{
    conversationId : string
}

export async function POST(request : Request , {params} : {params : IParams} ){
    try {
        const currentUser = await getCurrenrUser()
        const {conversationId} = params 

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('UnAuthorized' , {status : 401})
        }

        // Find existing conversation
        const converation = await prisma.conversation.findUnique({
            where : {
                id: conversationId
            },
            include : {
                messages : {include : {seen : true}},
                users : true
            }
        })

        if (!converation) {
            return new NextResponse('Invalid Id' , {status : 400} )
        }

        const lastmessage = converation?.messages[converation?.messages.length -1]

        if(!lastmessage){
            return NextResponse.json(converation)
        }

        const updatedMessage = await prisma.message.update({
            where:{
                id : lastmessage.id
            },
            include : {
                sender : true,
                seen : true
            },
            data : {
                seen : {
                    connect : {
                        id : currentUser.id
                    }
                }
            }

        })

        await pusherServer.trigger(currentUser.email , "conversation:update" , {
            id : conversationId,
            messages : [updatedMessage]
        } )


        if(lastmessage.seenIds.indexOf(currentUser.id)!== -1){
            return NextResponse.json(converation)
        }

        await pusherServer.trigger(conversationId! , 'message:update' , updatedMessage)

        return NextResponse.json(updatedMessage)
    } catch (error) {
        console.log(error , "ERR_MESS_SEEN")
        return new NextResponse('Internal Error' , {status : 500})
    }
    
}