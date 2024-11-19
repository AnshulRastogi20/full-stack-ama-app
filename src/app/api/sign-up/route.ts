import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"


export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,email,password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message:"Username is already taken"
            },{status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        
        const verifyCode = Math.floor( 100000 + Math.random() * 900000).toString()
        //random 6 digit code
        
        
        if(existingUserByEmail){
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message:"Email is already taken"
                },{status: 400})
            }
            // unverified user , ie , we should update data and send emial again
            else{

                const hashedPassword = await bcrypt.hash(password,10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours()+1)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCodeExpiry = expiryDate
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()

                
                // return Response.json({
                    //     success: false,
                    //     message:"Username is already taken"
                    // },{status: 400})
                }
            }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })


            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
          );
          if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }
      
          return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
          );

    } catch (error) {
        console.error("Error registering user" , error)
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
    
}