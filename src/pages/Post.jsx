import React,{useEffect, useState} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Button } from '../Components'
import service from '../appwrite/conf'
import parse from 'html-react-parser'

function Post() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const isAuthor = post && userData ? post.userId === userData.$id : false
    
    console.log('Redux userData:', userData);
    console.log('userData:', userData);

    useEffect(() => {
        service.getPost(slug).then((post) => {
            if(post) setPost(post)
            else navigate('/')
        }).catch((error) => {
            console.log("Post :: useEffect :: getPost :: error", error);
            
        });
    },[slug, navigate])

    const deletePost = () => {
        console.log('function deletePost');
        service.deletePost(slug).then((status) => {
            console.log('Post :: deletePost :: status', status);
            if(status) {
                console.log("status if arrived");
                service.deleteFile(post.featuredImage)
                navigate('/')
            }
        }).catch((error) => {
            console.log('Post :: deletePost :: error',error);
        })
    }
    return post ? (
        <div className='py-8'>
            <Container>
                <div className='w-full flex justify-center mb-4 relative rounded-xl p-2'>
                    <img 
                    src={service.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className='rounded-xl'
                    />
                    {console.log('isAuthor:', isAuthor)}
                    {console.log('userData:', userData)}
                    {console.log('post:', post)}
                    {isAuthor && <div className='absolute right-6 top-6'>
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button
                                className='mr-3'
                                bgColor='bg-blue-500'
                                >Edit
                                </Button>
                            </Link>
                            <Button
                            bgColor='bg-red-500'
                            onClick={deletePost}
                            >
                                Delete
                            </Button>
                        </div>
                    }
                </div>
                <div className='w-full mb-6'>
                    <h1 className='text 2-xl font-bold'>
                        {post.title}
                    </h1>
                </div>
                <div className='browser-css'>
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post
