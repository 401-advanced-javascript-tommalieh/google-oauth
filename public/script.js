const URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const options = {
  client_id: '219059553766-e1kp4mfumg2m9l12qqrbontq4mduloco.apps.googleusercontent.com', 
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  response_type: 'token',
  redirect_uri: `https://class12-googleoauth.herokuapp.com/oauth`
};
const queryString = Object.keys(options)
  .map((key) => {
    return `${key}=${encodeURIComponent(options[key])}`;
  })
  .join('&');

console.log('Query', queryString);
// making the full url
const authUrl = `${URL}?${queryString}`;
const link = document.getElementById('oauth');
link.setAttribute('href', authUrl);
