import { GetServerSideProps } from 'next';

const HomePage: React.FC = () => {
  return null; // This page is just for redirection
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  };
};

export default HomePage;
