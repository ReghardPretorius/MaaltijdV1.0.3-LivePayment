import { Container, Card, Button } from 'react-bootstrap';

const Hero = () => {
  return (
    <div className=' py-3'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-2 m-1 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>Hello Potchefstroom!</h1>
          <p className='text-center mb-4'>
            Sign In or Register a new account to start ordering your meals today.
          </p>
          <div className='d-flex justify-content-between'>
            <Button variant='primary' style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}  href='/login' className='me-3'>
              Sign In
            </Button>
            <Button variant='secondary' style={{backgroundColor: '#DAA927', borderColor: '#DAA927'}} href='/register'>
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
