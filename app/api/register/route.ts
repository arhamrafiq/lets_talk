import bcrypt from "bcrypt"
import prisma from '../../libs/prisma'
import { NextResponse } from "next/server"

export async function  POST(request : Request) {
    try{
    const body = await request.json()

    const {
        name,
        email,
        password
    } = body
    
    if (!name || !email || !password) {
        return new NextResponse("Mising infos! Fill out all the fields" , {status : 400})
    }

    const hashedPassword = await bcrypt.hash(password , 3)

    const user = await prisma.user.create({
        data : {
            email ,
            name,
            hashedPassword
        }
    })

    return NextResponse.json(user)
}catch(error : any){
    console.log(error , "REGISTERATION_ERR")
    return new NextResponse("Something went wrong while Registering you" , {status : 500})
}
}