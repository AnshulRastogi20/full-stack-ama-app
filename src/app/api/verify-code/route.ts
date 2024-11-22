// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { z } from "zod";
// import { verifySchema } from "@/schemas/verifySchema";


// const verifyQuerySchema = z.object({
//     code: verifySchema
// })

// export async function POST(request:Request) {

//     await dbConnect()

//     try {

//         const {username , verifyCode} = await request.json()
//         const otp = {
//             code: verifyCode
//         }
//         console.log(otp)
//         const result = verifyQuerySchema.safeParse(otp)
//         console.log('logging result')
//         console.log(result)
//         if (!result.success) {
//             console.log("error here")
//             console.error(result.error.errors);
//             return Response.json({
//                 success:false,
//                 message: (result.error.errors[0]).message
//             },{
//                 status: 400
//             })
//         }

//         const {code} = result.data
//         console.log(code)


//         // const {username , code} = await request.json()
//         // console.log("here")

//         const decodedUsername = decodeURIComponent(username) // not necessary , we can use username directly as well

//         const user = await UserModel.findOne({username: decodedUsername})
//         if(!user){
//             return Response.json({
//                 success: false,
//                 message:"User not found"
//             },{status: 400})
//             }
        

//         console.log(user.verifyCode)
//         console.log(code)

//         const userVerified = user.verifyCode == code.code && new Date(user.verifyCodeExpiry) > new Date()

//         if (userVerified) {
//             user.isVerified = true
//             await user.save()

//             return Response.json({
//                 success:true,
//                 message: "User Verified"
//             },{
//                 status: 200
//             })
//         }
//         else if (!(user.verifyCode == code.code)) {
//             return Response.json({
//                 success:false,
//                 message: "invalid code"
//             },{
//                 status: 400
//             })
//         }
//         else if (!(new Date(user.verifyCodeExpiry) > new Date())) {
//             return Response.json({
//                 success:false,
//                 message: "code expired , sign up again to receive new code"
//             },{
//                 status: 500
//             })
//         }


        
//     } catch (error) {
//         console.error("Error verifying user")
//         return Response.json({
//             success:false,
//             message: "Error verifying user"
//         },
//     {
//         status: 500
//     })
//     }

// }


import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}