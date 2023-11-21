# Shopping app / Quản lý bán hàng

## Backend

NodeJS + Express + MongoDB

### Enviroment variable

Copy file `.env.example` to file `.env` and update properties

```sh
cp .env.example .env
```

- `DB_CONNECT_STRING`: url to the mongodb database
- `ACCESS_TOKEN_SECRET`: Jwt secret key using for user authentication

### Install packages

```sh
npm install
```

> Using `npm install -f` if installation fails

### Run on development mode

```sh
npm run dev
```

### Run on production

```sh
npm run start
```

### Import Data (JSON)

Go to /data folder, cd into the web you're using. Then import it into the database (MongoDB Compass)

### Create an staff (admin) account

```sh
npm run createstaff
```

### Create ramdom customer's account(s)

```sh
npm run createcustomer
```

## Frontend

Vue.js + Pinia + Bootstrap

### Enviroment variables

Copy file `.env.example` to file `.env.local` and update variables

```sh
cp .env.example .env.local
```

- `VITE_APP_API_URL`: API server url

### Install packages

```sh
npm install
```

### Run on development mode

```sh
npm run dev
```

### Build and run on production mode

```sh
npm run build # Run only first time after source have some changes
```

```
npx serve dist
```
