# Roumieh Space Club Backend

## How to run?

First, run the following to install all dependencies.

```
npm install
```

Then, create MySQL database.  
Add connection string to .env. (under DATABASE_URL)  
Add jwt secret to .env. (under JWT_SECRET)
Then, run the following to create the tables in the database.

```
npx prisma migrate dev --name initialization
```

Now your database is ready. You still need to start the server using

```
npm run dev
```
