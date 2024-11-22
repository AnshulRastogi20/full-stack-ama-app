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
        console.log("inside check")
        const queryParam = {
            username: searchParams.get('username')
        }
        console.log(queryParam)

        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)


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
        },{status: 201})




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