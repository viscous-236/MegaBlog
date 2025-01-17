import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'
import { Button , Input, Logo} from './index'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const [error , setError] = useState('')

    const login = async (data) => {
        setError('')
        try {
            const session = await authService.login(data);
            if(session){
                const userData = await authService.getCurrentuser();
                console.log("userData", userData);
                if(userData){
                    dispatch(authLogin(userData))
                    console.log("Dispatched");
                    navigate('/')
                    console.log("Navigated");
                    
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div 
        className='flex item-center justify-center w-full'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
            >
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>Sign to your account</h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/singup"
                        className='font-medium text-primary transition-all duration-200
                        hover:underline'
                    >
                        SignUp
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-6 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)}
                className='mt-8'
                >
                    <div className='space-y-5'>
                        <Input
                        label='Email: '
                        placeholder='Enter your email'
                        type='email'
                        {...register('email',{
                            required: true,
                            validate:{
                                matchPattern: (value) => /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.
                                test(value) || 'Invalid email address'
                            }
                        })}
                        />
                        <Input
                        label='Password: '
                        type='password'
                        placeholder='Enter your password'
                        {...register('password',{
                            required: true,
                            minLength: 6
                        }
                    )}
                    />
                    <Button
                    type='submit'
                    className='w-full'
                    >Sign In</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
