

--IGNORE BELOW--
- Event table - event ID -> pct release
- publish event
- link to IPFS pdf contract
- Button panels
- Contract creation UI
- Presentation
- README file
- Event flow:

    - Farmer submits event
    - Event gets created with "submitted" state
    - ICS sees an event in "submitted" state
    - ICS approves it
    - Event goes to "approved" state 
    - ICS creates the same event on ICS/Buyer side - has ot identify farmer
    - Event in "submitted" state
    - Buyer sees the event to be acknowledged
    - Buyer approves the it
    - Event goes to approved state + Funds released to the ICS
    - ICS sees funds available against farmer contract
    - ICS 
    - Farmer receives funds

- Remove unlocking functionality completely