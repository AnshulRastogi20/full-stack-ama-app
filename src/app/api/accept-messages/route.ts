import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    
    const user = session?.user
    console.log(session)

    if(!session || !user){
        return Response.json({
            success:false,
            message: "Not Authenticaated"
        },{
            status: 400
        })
    }


    const userId = user._id

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message: "Failed to update accept message status"
            },{
                status: 401
            })
        }

        return Response.json({
            success:true,
            message: "updated accept message status",
            updatedUser
        },{
            status: 200
        })






        
    } catch (error) {
        console.log("Failed to update accept message status")
        return Response.json({
            success:false,
            message: "Failed to update accept message status"
        },{
            status: 500
        })
    }
}


export async function GET(request:Request) {
    await dbConnect()


    const session = await getServerSession(authOptions)

    const user = session?.user
    if(!session || !user){
        return Response.json({
            success:false,
            message: "Not Authenticaated"
        },{
            status: 400
        })
    }
    
    
    const userId = user._id
    

   try {
     const foundUser = await UserModel.findById(userId)
     
     if(!foundUser){
         return Response.json({
             success:false,
             message: "User not found"
         },{
             status: 401
         })
     }
 
     return Response.json({
         success:true,
         isAcceptingMessages: foundUser.isAcceptingMessages
     },{
         status: 200
     })
 
   } catch (error) {
    console.log("Error in getting acepting message status")
    return Response.json({
        success:false,
        message: "Error in getting acepting message status"
    },{
        status: 500
    })
}
}