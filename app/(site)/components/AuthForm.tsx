"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/input/Input";
import Button from './../../components/Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from "react-icons/bs"
import axios from "axios"
import toast from "react-hot-toast";
import { signIn, useSession} from "next-auth/react"
import { useRouter } from "next/navigation";

type Variant = "Login" | "Register";

const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('Login');
  const [loading , isLoading] = useState(false)



  useEffect(()=>{
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  } , [session?.status , router])

  const toggleVariant = useCallback(()=>{
    if (variant === 'Login') {
      setVariant('Register')
    }else{
      setVariant('Login')
    }
  } , [variant])

  const { register , handleSubmit , formState :{errors} } = useForm<FieldValues>({
    defaultValues : {
      name : '' , 
      email : '',
      password : '',
    }
  })

  const  onSubmit : SubmitHandler<FieldValues> = (data)=>{
    isLoading(true)
    if (variant === 'Register') {
      axios.post('/api/register' , data)
      .catch(()=>toast.error("Something went wrong"))
      .finally(()=>isLoading(false))
      .then(()=>signIn('credentials' , data))
    }
    if (variant === 'Login') {
      signIn('credentials' , {
        ...data ,
        redirect : false
      })
      .then((callback)=>{
        if (callback?.error) {
          return toast.error("Invalid Credentials")
        }
        if(callback?.ok && !callback?.error){
          return toast.success("Logged In!")
          router.push('/users')
        }
      })
      .finally(()=>{
        isLoading(false)
      })
    }
  }

  const socialAction = (action : string) =>{
    isLoading(true)
    signIn(action , {
      redirect:false
    })
    .then((callback)=>{
      if (callback?.error) {
        return toast.error("Invalid Credentials")
      }
      if(callback?.ok && !callback?.error){
        return toast.success("Logged In!")
      }
    })
    .finally(()=>{
      isLoading(false)
    })
  }


  // UI Of The Form
  return <div className="
  mt-8
  sm:mx-auto
  sm:w-full
  sm:max-w-md">
    <div className="
    bg-white
    px-4
    py-8
    shadow
    sm:rounded-lg
    sm:px-auto">
      {/* Auth Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {
          variant === 'Register' && (
            <Input disabled={loading} id="name" label="Name" register={register} errors={errors}/>
            )
          }
          <Input disabled={loading} id="email" label="Email" type="email" register={register} errors={errors}/>
          <Input disabled={loading} id="password" label="Password" type="password" register={register} errors={errors}/>
          <div>
            <Button type="submit" disabled={loading}  fullwidth>{variant === 'Login' ? 'Sign In' : 'Register'}</Button>
          </div>
      </form>
      {/* Seperation && Socail Auth Buttons */}
      <div className="mt-6">
        <div className="relative">
          <div className="
          absolute
          inset-0
          flex
          items-center">
            <div className="w-full border-t border-gray-300"/>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or Continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <AuthSocialButton icon={BsGithub} onClick={()=>socialAction('github')}/>
          <AuthSocialButton icon={BsGoogle} onClick={()=>socialAction('google')}/>
        </div>
      </div>
      {/* Form Toogler */}
      <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
        <div>{
          variant === 'Login' ? 'New to TalkMe?' : 'Already have an account?'
          }
        </div>
        <div onClick={toggleVariant} className="underline cursor-pointer">
          {
            variant === 'Login' ? 'Create An Account' : 'Login'
          }
        </div>
      </div>
    </div>
  </div>;
};

export default AuthForm;
