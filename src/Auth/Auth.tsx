import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
 class Auth {
  tokenRenewalTimeout:any;
  userProfile:any;
  cb:( error: any, result?: any ) =>void;
  handleAuthRoute:any;
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: `${AUTH_CONFIG.redirect_url}/callback`,
    responseType: 'token id_token',
    scope: 'openid profile',
    audience:AUTH_CONFIG.audience
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {

     this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        location.href = '/home'
      } else if (err) {

        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult:any) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    // schedule a token renewal
    this.scheduleRenewal();

    // navigate to the home route
    location.href = '/home'
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile = (cb:(err?:any, result?:any)=> void) => {
    let accessToken = this.getAccessToken();
    // let self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile)
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    // this.userProfile = null;

    clearTimeout(this.tokenRenewalTimeout);
    // logout use form the auth0
     //location.href = `https://${AUTH_CONFIG.domain}/v2/logout?returnTo=${AUTH_CONFIG.redirect_url}/&client_id=${AUTH_CONFIG.clientId}`;
    location.href = '/'

  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let time = localStorage.getItem('expires_at') || '';
    let expiresAt = (time.length > 0) ? JSON.parse(time) : new Date().getTime()
    return new Date().getTime() < expiresAt;
  }

  renewToken() {
    this.auth0.checkSession({},
      (err:any, result:any) => {
        if (err) {
          alert(
            `Could not get a new token (${err.error}: ${err.error_description}).`
          );
        } else {
          this.setSession(result);
          alert(`Successfully renewed auth!`);
        }
      }
    );
  }

  scheduleRenewal() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '');
    const delay = expiresAt - Date.now();
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  }

  checkSSO(cb:(err?:any, result?:any)=> void) {
    this.auth0.checkSession({},
      (err:any, result:any) => {
        if (err){
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        } else {
          this.setSession(result);
        }
        cb(err, result)

      }
    );
  }
}


export default Auth;
