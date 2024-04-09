import { getCurrenrUser } from "../../action/getCurrentUser";
import  prisma  from '../../libs/prisma';
import { NextResponse } from "next/server"
import { pusherServer } from "../../libs/pusher";

export async function POST( request : Request ){
    try {
        const currentUser = await getCurrenrUser()
        const body = await request.json()
        const { userId, isGroup , members , name } = body

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('UnAuthorized Access' , {status : 401})
        }
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid Access' , {status : 400})
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data : {
                    name,
                    isGroup,
                    users : {
                        connect : [
                            ...members.map((member : {value : String})=>({id : member.value})),
                            {
                                id  : currentUser.id
                            }
                        ]
                    }
                } , 
                include : {
                    users : true
                }
            })

            newConversation.users.forEach(user=>{
                if(user.email){
                    pusherServer.trigger(user.email , 'conversation:new' , newConversation)
                }
            })

            return  NextResponse.json(newConversation)
        }


        const existingConverstions = await prisma.conversation.findMany({
            where : {
                OR : [{
                    userIds : {
                        equals : [currentUser.id , userId]
                    }
                },{
                    userIds : {
                        equals : [userId , currentUser.id]
                    }
                }]
            }
        })

        const singleConverstion = existingConverstions[0]

        if (singleConverstion) {
            return NextResponse.json(singleConverstion)
        }

        const newConverstion = await prisma.conversation.create({
            data : {
                users : {
                    connect : [
                        {id : userId} , {id : currentUser.id}
                    ]
                }
            },
            include : {
                users : true
            }
        })


        newConverstion.users.forEach(user=>{
            if(user.email){
                pusherServer.trigger(user.email , 'conversation:new' , newConverstion)
            }
        })

        return NextResponse.json(newConverstion)
    } catch (error:any) {
        return new NextResponse('Internal Error' , {status : 500})
    }
}
