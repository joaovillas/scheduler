import express from 'express';
import rules from './rules';

const router = express();

router.use('/rules', rules);


export default router;