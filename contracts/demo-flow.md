1. Background + plus problem we're trying to solve and why
2. Contracts are setup ahead of time, injected with a script.
Two sets of contracts, one for buyer<> FPO and the other for FPO<>Farmer
Physical contracts stored encrypted on IPFS using lighthouse, referenced in abbove contracts 
Contract NFT minted with IPFS uri 
All smart contracts on Polygon
Attempted push notifications to notify when payments are released (but not workng)

3. In the final product, contracts will be created from a UI that might look like this:
    
    < show the contract creation UI >
4. Goto buyer screen
    - Show the params of the contract
5. Show the same contract view for the banker
6. Same contract view for the FPO
7. We now sign the contract
    - FPO signs
    - Bank signs
    - Buyer signs
8. When the buyer signs, the prepayment funds are transferred to the FPO
9. The FPO is a farmer cooperative and decides how to use the funds. For example, they may decide to use all the funds for input supplies. 

    < show example form to buy seeds >

10. Funds transferred to the Input seller

11. We describe the Farmbook here and how we track on-farm events and prove quality, compliance, climate-friendliness. We will have ability to define contracts where additional funds are released based on threshold of some of the scores.

- In this demo, we move on to the stage where harvest has been received by the buyer.
- The buyer now accepts the quantity and price. In reality, there will be negotiation and settlement, but in the interest of time, we've short-circuited it and we're manually entering these parameters:
    - Show harvest acceptance form
- Upon entry, funds get released to the FPO.
- FPO will release funds to the farmer. In the final solution, there will be tracking of exact harvest quantities etc, but for now, we're showing manually releasing funds to the farmer.

  - show the fund release UI

Conclusion - there's a lot of work tobe done as you can tell, but we're trying to apply web3 principles and technology to transform fundamental problems of compromised health of people and planet, while improving farmer net incomes.

