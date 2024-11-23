"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import React, { useState  , useEffect} from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios from 'axios'
import { Form , FormItem , FormField , FormLabel , FormControl , FormDescription , FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



const page = () => {

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceCallback(setUsername,300)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email:'',
      password:''
    }
  })



  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(response)
          setUsernameMessage(response.data.message)
        } catch (error) {
          setUsernameMessage('Error checking username')
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username]);


  const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast({
        title:'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error('Error in signup of user' , error)
      toast({
        title:'Sign-Up failed',
        description: 'Error signing up',
        variant:'destructive'
      })
    } finally{
      setIsSubmitting(false)
    }
    
  }
  


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign Up to continue your secret conversations</p>
        </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e)
                  debouncedUsername(e.target.value)
                }
                }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button  disabled = {isSubmitting} type="submit">Sign-up</Button>
      </form>
    </Form>


        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>


      </div>
    </div>
  )
}

export default page

