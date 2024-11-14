# Bopmatic Service Console

The Bopmatic Service Console allows customers to monitor their Bopmatic projects.

## Building

`npm run build`

## Deploying static front-end application
1. Run build step above
2. Upload the entire build/ directory generated from step #1 above to an S3 bucket or other hosting space
3. Ensure Bopmatic API includes CORS headers relative to the source of your website address (S3 bucket endpoint)

## Running Dev Server

`npm start`

## Contributing
Pull requests are welcome at https://github.com/bopmatic/console

For major changes, please open an issue first to discuss what you
would like to change.

## License
[AGPL3](https://www.gnu.org/licenses/agpl-3.0.en.html)
