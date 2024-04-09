import prisma from "../libs/prisma"
import getSession from "./getSession"

export const getUser = async ( ) => {
    const session = await getSession()
    if (!session?.user?.email) {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy : {
                CreatedAt: 'desc'
            },
            where : {
                NOT : {
                    email : session.user.email
                }
            }
        })

        return users
    } catch (error : any) {
        return []
    }

}