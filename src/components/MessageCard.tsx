"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios from "axios";
import {  useToast } from "@/hooks/use-toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId:any) => void
}

const MessageCard = ({message , onMessageDelete} :MessageCardProps) => {
  const {toast} = useToast()
  
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`)

    toast({
      title: response.data.message
    })
    onMessageDelete(message._id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className="w-5 h-5"/></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default MessageCard;
