import { GraphqlBody, Secrets } from './interfaces';

class GraphqlBodyAxie{
    private roning?: string;

    getBodyDetail(secret: Secrets): GraphqlBody{
        this.roning = secret.ronin;
        let body: GraphqlBody = this.body('GetAxieLatest', 'All');
        return body
    }

    private body(operationName: string, auctionType: string): GraphqlBody{
        return {
            "operationName": operationName,
            "variables": {
                "from": 0,
                "size": 24,
                "sort": "PriceAsc",
                "auctionType": auctionType,
                "owner": this.roning
            },
            "query": `query ${operationName}($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n`
        }
    }

    getBodyRandomMessage(){
        return {
            "operationName": "CreateRandomMessage",
            "variables": {},
            "query": "mutation CreateRandomMessage{createRandomMessage}"
        }
    }

    getBodyAccessToken(roning: string, message: string, signHex: string){
        return {
            "operationName": "CreateAccessTokenWithSignature",
            "variables": {
                "input": {
                    "mainnet": "ronin",
                    "owner": roning,
                    "message": message,
                    "signature": signHex
                }
            },
            "query": "mutation CreateAccessTokenWithSignature($input: SignatureInput!) {  createAccessTokenWithSignature(input: $input) {    newAccount    result    accessToken    __typename  }}"
        }
    }
}

export const graphqlBodyAxie = new GraphqlBodyAxie();