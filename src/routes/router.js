const { Router } = require('express');
const { getReqEnv } = require('../sandboxenv/requestsenv');
const githubUserData = require('./githubUserData');
const router = new Router();
router.use('/githubUserData', getReqEnv(githubUserData));
router.use('*', (req, res) => {
    res.status(503).json({        
        message: 'Operation Unsupported!',
    });
});

module.exports = router;