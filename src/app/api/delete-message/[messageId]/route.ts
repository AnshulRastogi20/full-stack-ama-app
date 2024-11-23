import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

//todo - full file


export async function DELETE(request: Request , {params}:{
  params:{messageId:string}
}) {
    const messageId = params.messageId
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
  
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    try{
        const updatedResult = await UserModel.updateOne(
          {
            _id:user._id
          },
          {
            $pull:{messages:{_id:messageId}}
          }
        )

        if (updatedResult.modifiedCount == 0) {
          return Response.json(
            { message: 'Message not found or deleted', 
              success: false },
            { status: 404 }
          );
        }

        return Response.json(
          { message: 'Deleted', 
            success: true },
          { status: 200 }
        );

        
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return Response.json(
        { message: 'Error deleting message', success: false },
        { status: 500 }
      );
    }
  }