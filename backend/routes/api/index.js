const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');


router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res, user);
    return res.json({ user: user });
});

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});

router.get(
    '/restore-user',
    (req, res) => {
        return res.json(req.user);
    }
);

router.get(
    '/require-auth',
    requireAuth,
    (req, res) => {
        return res.json(req.user);
    }
);

router.use(restoreUser);

module.exports = router;
