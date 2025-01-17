import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import {useDispatch} from 'react-redux'
import {Button, Input, Logo} from './index'
import {useForm} from 'react-hook-form'


function Signup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState('')

    const signUp = async (data) => {
        setError('')
        try {
            const account = await authService.createAccount(data)
            if (account) {
                const userData = await authService.getCurrentuser()
                if (userData) dispatch(authLogin(userData))
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className='flex items-center justify-center'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'> 
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>
                    Signup to create Account
                </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Already have an account?&nbsp;
                    <Link
                        to='/login'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-6 text-center'>{error}</p>}
                <form 
                onSubmit={handleSubmit(signUp)} 
                className='mt-8 '
                >
                    <div className='space-y-5'>
                        <Input
                        label='Name: '
                        placeholder='Enter your name'
                        type='text'
                        {...register('name', {required: true})}
                        />
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
                        placeholder='Enter your password'
                        type='password'
                        {...register('password',{
                            required: true,
                            minLength: 6
                        })}
                        />
                        <Button
                        type='submit'
                        className='w-full'
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
