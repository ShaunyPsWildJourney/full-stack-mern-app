
import { Typography,Button,Box, Container, Paper } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from "../../app/hook";
import { falseBoolean } from "../../features/patheticBooleanSlice";
import { showUpdateFalse } from "../../features/showUpdateSlice";



export default function PostUpdateFinish( ) {

  const dispatch = useAppDispatch();

  function handleFinish() {
    dispatch(falseBoolean())
    dispatch(showUpdateFalse())
    console.log('Post update complete')
  }

  return (

      <Container  
          sx={{
          position: 'absolute',
          left: 0, 
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          zIndex: 20,
          
      }}>
        <Paper elevation={3} sx={{
          position: 'relative',
          width: `50%`, 
          minWidth: '200px',
          height: '50%',
          maxHeight: '400px',
          p: 3, 
          borderRadius: 3, 
          color: '#1A2027', 
          bgcolor: 'rgba(255,255,255,0.5)',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 5,
          ":hover": {
            boxShadow: 8,
            },
          }}
          >
            <Typography variant='h1' 
                    sx={{
                      
                    }}>
                Post successful!
              </Typography>
  
        <Box component="form"  sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '300px',
              width: '70%',
            }}>
  
          <Button 
                  onClick={handleFinish}
                  component={RouterLink} to='/profile' 
                  variant="contained" color="primary" type="submit" size="large" 
                  sx={{
                    backgroundColor: 'primary.light', 
                    fontWeight: 600,
                  }}
              
              >
            Okay
          </Button>
        </Box>
        </Paper>
    </Container>


  )
}