import jwt from 'jsonwebtoken'

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {

        return res.status(401).send('Not Authenticated ')
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'safaidansari');
    } catch (err) {
        return res.status(500).send('Internal Server Error ')
    }
    if (!decodedToken) {
        return res.status(401).send('Not Authenticated ')
    }
    req.userId = decodedToken.userId;
    next();
  };

  export {isAuth}  