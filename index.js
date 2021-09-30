/*
    project: CLI email sender using google API
    author: Md.Sakib-Al-Emran
    date: 27-09-2021
*/

//dependencies
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const prompt = require("prompt-sync")({ sigint: true });

//credentials
const ClientId = 'your client ID';
const ClientSecret = 'your client secret';
const RedirectUrl = 'https://developers.google.com/oauthplayground';
const RefreshToken = 'your refresh token';

const oAuth2Client = new google.auth.OAuth2(
    ClientId,
    ClientSecret,
    RedirectUrl
);

oAuth2Client.setCredentials({refresh_token: RefreshToken});

//Sender Gmail information
const mailOptions = {
    from: '<yours authorised email address>',
};

//custom input from user
const Email = prompt("Provide the receiver's gmail account: ");
const Subject = prompt('Provide the subject of the mail: ');
const Text = prompt('Write your message: ');

mailOptions.to = `${Email}`;
mailOptions.subject = `${Subject}`;
mailOptions.text = `${Text}`;


async function sendMail(){
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: 'yours authorised email address',
                clientId: ClientId,
                clientSecret: ClientSecret,
                refreshToken: RefreshToken,
                accessToken: accessToken,
            }
        });

        const result = await transport.sendMail(mailOptions);
        return result;

    }catch(error){
        return error;
    }
}

//call the function
sendMail()
    .then((result) => console.log('email is sent', result))
    .catch((error) => console.log(error.message));

