# Rebase Badge

Rebase Badge for the Rebase Community.


# Front-End

Run `yarn` in `front-end` folder to install all packages needed for frontend.

# Contracts

## Install packages

Run `yarn` in root folder to install all packages needed for contracts.

## Build & Deploy Contracts

Run tests
```shell
npx hardhat test
```

Deploy
```
npx hardhat run scripts/0_deploy_badge.tx --network ethereum
```

Upgrade 
```
npx hardhat run scripts/1_upgrade_badge.tx --network ethereum
```

### Contracts
Ethereum Mainet: 