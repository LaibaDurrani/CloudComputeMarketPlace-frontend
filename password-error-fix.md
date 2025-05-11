// Password must be longer

When signing up, make sure your password is at least 6 characters long.

The current validation in your backend requires passwords to be at least 6 characters:

```javascript
check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
```

Your registration attempt is failing because you're using "123" as the password,
which is only 3 characters. Try using a password that's at least 6 characters long.

For example:
{
  "name": "hammad",
  "email": "hammad@gmail.com", 
  "password": "password123",  // At least 6 characters
  "profileType": "both"
}
