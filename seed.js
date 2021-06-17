const methods = require('./seed_methods')
const rd = require('readline')

const rl = rd.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.question(`1. Reddit\t2. Games\t3. Films and TV Shows\nEnter choice: `, (answer) => {
    switch (answer) {
        case '1':
            methods.reddit();
            break;
        case '2':
            methods.games();
            break;
        case '3':
            methods.sf();
            break;
        default:
            process.stdout.write('Invalid option')
    }
    rl.close()
})