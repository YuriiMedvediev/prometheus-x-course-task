import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export function Layout({ userName, isUserLoggedIn, handleSignOut }) {
  return (
    <>
      <Header
        userName={userName}
        isUserLoggedIn={isUserLoggedIn}
        handleSignOut={handleSignOut}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
