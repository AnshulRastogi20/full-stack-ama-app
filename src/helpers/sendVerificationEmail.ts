import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";


export async function sendVerificationEmail
(
    email:string,
    username: string,
    verifyCode: string
):Promise<ApiResponse> {
    

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `WELCOME ${username} , Verify using this mail`,
            react: VerificationEmail({username:username,otp:verifyCode}),
          });

        return {success:true , message:"verification email sent succefully"}
    } catch (error) {
        console.error("Eroor sending email" , error)
        return {success:false , message:"Failed to send verification email"}
    }


}
