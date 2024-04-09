
import { NextResponse } from 'next/server'
import { getCurrenrUser } from '../../action/getCurrentUser'
import prisma from "../../libs/prisma"
import { pusherServer } from "../../libs/pusher"

export async function POST(request:Request){
    try {
        const currentUser = await getCurrenrUser()
        const body = await request.json()

        const {image , message  , conversationId} = body

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('UnAuthorized' , {status : 402})            
        }

        const newMessage  = await prisma.message.create({
            data : {
                body : message,
                image : image,
                conversation: {
                    connect : {
                        id  : conversationId
                    }
                },
                sender : {
                    connect : {
                        id  : currentUser.id
                    }
                },
                seen : {
                    connect  :{
                        id : currentUser.id
                    }
                }
            },
            include : {
                seen  : true,
                sender  :true
            }
        })

        const updateConversation = await prisma.conversation.update({
            where : {
                id : conversationId
            },
            data:{
                LastMesssageAt  : new Date,
                messages : {
                    connect : {
                        id : newMessage.id
                    }
                }
            },
            include : {
                users  :true , 
                messages : {
                    include : {
                        seen  : true
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId , 'messages:new' , newMessage )

        const lastMessage = updateConversation.messages[updateConversation.messages.length-1]

        updateConversation.users.map((user)=>{
            pusherServer.trigger(user.email , 'conversation:update' , {
                id:conversationId,
                messages : [lastMessage]
            })
        })

        return  NextResponse.json(newMessage)
    } catch (error:any) {
        console.log(error , 'ERR_MESSAGES')
        return new NextResponse('Internal Error' , {status : 500})
    }
}