'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// Define the User type for type safety
type User = {
  name?: string;
  email?: string;
  picture?: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Mock authentication functions to be replaced with real Auth0 implementation
  const checkAuth0Session = async () => {
    // This is a mock implementation
    return { isAuthenticated: false, user: null };
  };

  const loginWithAuth0Provider = (provider: string) => {
    // This would be replaced with actual Auth0 authentication logic
    setIsLoading(true);
    console.log(`Login with ${provider}`);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes: Uncomment to simulate a successful login
      // setIsAuthenticated(true);
      // setUser({ name: 'Demo User', email: 'user@example.com' });
    }, 1500);
  };

  const logoutFromAuth0 = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Initialize on page load
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const { isAuthenticated, user } = await checkAuth0Session();
        
        if (isAuthenticated && user) {
          setIsAuthenticated(true);
          setUser(user);
        }
      } catch (error) {
        console.error("Login page initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Show success message when authenticated
  const SuccessMessage = ({ user }: { user: User }) => (
    <div className={styles.successMessage}>
      <h1>Welcome!</h1>
      <p>Hello {user.name || 'User'}, you have successfully signed in with your corporate email.</p>
      {user.picture && (
        <Image 
          src={user.picture} 
          alt="Profile" 
          width={100}
          height={100}
          style={{ borderRadius: '50%', margin: '20px 0' }}
        />
      )}
      <p>Email: {user.email || 'Not provided'}</p>
      <button onClick={logoutFromAuth0} className={styles.logoutBtn}>Sign Out</button>
    </div>
  );

  return (
    <div className={styles.container} id="main-container">
      {isAuthenticated && user ? (
        <SuccessMessage user={user} />
      ) : (
        <div className={styles.authContainer}>
          <button className={styles.getStartedBtn}>Get Started</button>
          <div className={styles.providersPopup}>
            <div className={styles.triangle}></div>
            <div className={styles.providersPopupInner}>
              <button 
                id="linkedin-login" 
                className={`${styles.providerBtn} ${styles.linkedin}`} 
                title="Continue with LinkedIn"
                onClick={() => loginWithAuth0Provider('linkedin')}
              >
                <svg className={styles.providerIcon} viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </button>
              <button 
                id="google-login" 
                className={`${styles.providerBtn} ${styles.google}`} 
                title="Continue with Google"
                onClick={() => loginWithAuth0Provider('google-oauth2')}
              >
                <svg className={styles.providerIcon} viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
              </button>
              <button 
                id="microsoft-login" 
                className={`${styles.providerBtn} ${styles.microsoft}`} 
                title="Continue with Microsoft"
                onClick={() => loginWithAuth0Provider('windowslive')}
              >
                <svg className={styles.providerIcon} viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`${styles.loading} ${isLoading ? styles.active : ''}`} id="loading">
        <div className={styles.spinner}></div>
        <p>Authenticating...</p>
      </div>
    </div>
  );
} 