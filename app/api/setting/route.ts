import { NextResponse } from "next/server"
import { getCurrenrUser } from "../../action/getCurrentUser"
import prisma from "../../libs/prisma"

export async function POST(request : Request){
    try {
        const currentUser = await getCurrenrUser()
        const body = await request.json()
        const {name , image } = body

        if(!currentUser){
            return new NextResponse("UnAuthorized" , {status : 401})
        }

        const updateUser = await prisma.user.update({
            where : {
                id : currentUser?.id
            },
            data:{
                image : image,
                name : name
            }
        })

        return NextResponse.json(updateUser)
    } catch (error:any) {
        console.log(error , "SETT_ERR")
        return new NextResponse("Internal Err" , {status : 500})
    }
}