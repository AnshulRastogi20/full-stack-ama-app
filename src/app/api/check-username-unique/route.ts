import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {

    
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("PRINT ZOD RESULT -- ")
        console.log(result)

        if (!result.success) {
            return Response.json({
                success:false,
                message: "INVALID USERNAME"
            },{
                status: 400
            })
        }
        
        const {username} = result.data
        const existingVerfiedUser = await UserModel.findOne({username , isVerified:true})
        if(existingVerfiedUser){
            return Response.json({
                success: false,
                message:"Username is already taken"
            },{status: 400})
            }

        return Response.json({
            success: true,
            message:"Username is unique"
        },{status: 400})




    } catch (error) {
        console.error("Error checking username" , error)
        return Response.json({
            success:false,
            message: "Error checking username"
        },
    {
        status: 500
    })
    }
}