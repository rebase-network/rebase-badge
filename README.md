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
npx hardhat run scripts/0_deploy_badge.ts --network ethereum
```

Upgrade 
```
npx hardhat run scripts/1_upgrade_badge.ts --network ethereum
```

### Contracts
Ethereum Mainet:   
- Badge 0x9cFC620caD1F0134144E7E91623d9Cb835aAbce4
- Proxy 0xe45c7082D76AeF3FE1904Eefd550829D9980ca5D

### Graphics/Metadata
2022 Graphics bafybeihyn5k4td73td2kyu6u45kt4tlzdlpj6iuz2gkskq5qfapmtqrzli
2022 Metadata bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re

TokenId -> Metadata
```
1 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-1st-2022.json

2 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-2nd-2022.json

3 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-3rd-2022.json

4 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Bestcreative-2022.json

5 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Competitor-2022.json

6 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Jury-2022.json

7 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Mentor-2022.json

8 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Popular-2022.json

9 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Sponsor-2022.json

10 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Hackathon-Volunteer-2022.json

11 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/University-Contributor-2022.json

12 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/University-Speaker-2022.json

13 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Web3Daily-Contributor-2022.json

14 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/Web3Daily-Editor-2022.json

15 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/CodingDay-Contributor-2022.json

16 ipfs://bafybeihuwxicd3tc22pdg33hwtxvcxcrq7h4rtpk3xmmnaq2vnve2tm6re/CodingDay-Speaker-2022.json
```