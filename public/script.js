// from GH docs Request a user's GitHub identity
const URL = 'https://accounts.google.com/o/oauth2/v2/auth';
// needed query string
const options = {
  client_id: '219059553766-e1kp4mfumg2m9l12qqrbontq4mduloco.apps.googleusercontent.com', //required!!
  scope: 'https://www.googleapis.com/auth/userinfo.profile',
  response_type: 'token',
  redirect_uri: `https://localhost:8000/oauth`
};
// converting the obj to string and formatting the resulting string
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
