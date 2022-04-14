# takemyhand-server

### Settings

```
node v16.14.2
npm v8.5.0
```

### Running instructions

- Create a .env file on root folder
- Set environments variables in .env file
- Run `npm i` to install dependencies
- Run `npm run dev` to run the program on development environment
- Run `npm build` & `npm start` to run the program on production
- Make sure the `GEOCODE_API_KEY` env var is valid - achieve it through Google Cloud Platform using your account

### Environment variables

```
# Mongo db
MONGO_DB_URI = e.g "mongodb://mongodb0.example.com:27017"

# Jwt auth
JWT_SECRET = my_5tr0Ng_p4s5w0rd
JWT_EXPERATION = "2 days", "10h", "7d".
JWT_REFRESH_EXPERATION = A numeric value is interpreted as a seconds count e.g "3600"

# Geocoding config
GEOCODE_API_KEY = gcp geocoding api key
LAT = Default lat coordinate
LNG = Default lng coordinate

# Admins config
ADMINS = admins phone numbers seperated by comma e.g 545233323,323231212
PASSWORD = admins secret password

# Set this only on production
NODE_ENV = production
```
