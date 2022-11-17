import { SetStateAction, useEffect, useState } from 'react'
import { Typography, Button, Box } 
from "@mui/material";
import Card from "../../components/blog_posts/Card";
import { useAppDispatch, useAppSelector } from '../../app/hook';
import YourPostsFinish from './YourPostsCloser';
import { showUpdateFalse, showUpdateTrue } from '../../features/showUpdateSlice';
import { deleteBlog } from '../../actions/userActions';
import { deleteWallPosts, getWallPosts } from '../../features/wallPostsSlice';
import axios from 'axios';
import Loader from '../../components/Loader';
import { Outlet, useNavigate } from 'react-router-dom';


interface IProps {
  setBlogContent: React.Dispatch<SetStateAction<any | null>>;
  blogContent: object[];
}

export default function YourPosts({setBlogContent, blogContent}: IProps ) {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const finishSelector = useAppSelector(state => state.patheticBoolean);
  const updateSelector = useAppSelector(state => state.showUpdateSlice)
  const loading = useAppSelector((state: any) => state.loaderState.value[0]);
  const wallPostsSelector = useAppSelector(state => state.getWallPostState.value[0])

  async function handleUpdaterButton(index: number) {
    navigate('updatepost')
    dispatch(showUpdateTrue(index))
  }

  async function handleDeletePost(postID: any) {
    dispatch(deleteBlog(postID))
    dispatch(deleteWallPosts())

      setTimeout(() => { // GET REQ WAS OVERLAPPING DELETE REQ
        getUpdatedWallPosts()
      }, 100)
    
  }
  async function getUpdatedWallPosts() {
    try { 
      const data = await axios.get('/api/bloggers', {
      }) 
      dispatch(getWallPosts(data.data))
      setBlogContent(data.data)
    } catch (error) {
      console.log(error)
    } 
  }

    // escape key
    useEffect(() => {
      function escape(e: any){
        if (e.key === 'Escape'){
          navigate('./')
          dispatch(showUpdateFalse())
        }
      }
      window.addEventListener('keyup', (e) => escape(e)) ;
      return () => window.removeEventListener('keyup',  (e) => escape(e)) ;
      // eslint-disable-next-line
    }, [] )

  
    // FILTER BLOG POSTS BASED ON localStorage lastName// should probaby change it to email
    const [ usersPosts, setUsersPost ] = useState<object[]>([]);
    useEffect(() => {
      setUsersPost([]) // creates a shallow update
      let local: any; 
      if (localStorage.getItem('userInfo')){
      local = JSON.parse(localStorage.getItem('userInfo') || ""); 
      }
      let helper: object[] = [];
      if (wallPostsSelector){
      Object.values(wallPostsSelector)
        .filter((item: any )=> item.lastName === local.lastName 
          ? helper.push(item)
          : null)
      }
      setUsersPost(helper)
    }, [ wallPostsSelector ])



  return (
    <Box sx={{width: '90%', height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}} >

  {loading && loading.booly && <Loader /> }
  {finishSelector.value && <YourPostsFinish />}

    <Typography variant='h1' textAlign='center' sx={{filter: finishSelector.value ? 'blur(5px)' : 'null', mt: 4, mb: 4}}>
        {usersPosts.length > 0 ? 'Your Posts' : 'You havent made any posts'}
      </Typography>

      <Box sx={{
              display: 'grid',
              gap: 4,
              mb: 10,
              transition: 'all 5s',
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%/1, max(300px, 100%/3)), 1fr))`
             , width: '100%'
              }}>

      {usersPosts && !updateSelector.value.bool && 
        usersPosts.map((item: any, index: number) => {
          return (<Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Card  key={index} 
                tag={item.tag}
                tag2={item.tag2}
                header={item.header}
                body={item.body}
                date={item.createdAt}
                name={item.firstName}
                
                />
                <Box  key={index + 1000} sx={{display: 'flex', justifyContent: 'space-between', mb: 6, mt: 1, }}>

                  <Button variant='contained'
                    onClick={() => handleUpdaterButton(index)} 
                    sx={{ bgcolor: 'success.main', boxShadow: 4,
                    ":hover": { transform: 'scale(1.05)', boxShadow: 5},
                  }}
                    
                  >Update Blog</Button>
                  <Button 
                    onClick={() => handleDeletePost(item._id)}
                    variant='contained' sx={{ bgcolor: 'error.main', boxShadow: 5,
                                      ":hover": { transform: 'scale(1.05)', boxShadow: 4},
                                      
                                    }}
                  >Delete</Button>
                </Box>
                </Box>)
        })
      }
      </Box>
      <Outlet context={{usersPosts }}/>
  </Box>
  )
}
