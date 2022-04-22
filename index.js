const Workplace = require('./lib/Workplace');

initialize = () => {
    const workplace = new Workplace().start();
};

initialize();