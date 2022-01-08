export interface Secrets{
    name: string;
    ronin: string;
    roninPersonal: string;
    secret: string;
    ganancia: number;
    totalClaim?: string;
    axies?: string[];
    slp?: string;
    axs?: string; 
    weth?: string;
    transferResult?: string;
}

export interface AxiesData {
    roning: string
    namePlayer: string
    price?: string
    eth?: string
    hp: number
    speed: number
    skill: number
    morale: number
    id: string
    name: string
    class: string
    image: string
    breedCount: number
    auction?: auction
    genes: string
    parts: AxieParts[]
}

export interface auction {
    startingPrice?: any
    endingPrice?: any
    startingTimestamp?: any
    endingTimestamp?: any
    duration?: any
    timeLeft?: any
    currentPriceUSD: string
    currentPrice: string
    suggestedPrice?: any
    seller?: any
    listingIndex?: any
    state?: any
}

export interface AxieParts{
    id: string
    name: string
    type: string
    class: string
}


export interface AxiesOficialData {
    data: {
        axies: {
            results: [{
                id: string
                name: string
                class: string
                image: string
                breedCount: number
                genes: string,
                stats: {
                    hp: number
                    speed: number
                    skill: number
                    morale: number
                }
                parts: [{
                    id: string
                    name: string
                    type: string
                    class: string
                }],
                auction?:auction
            }]
        }
    }
}

export interface AxiesResultsOficialData {
    id: string
    name: string
    class: string
    image: string
    breedCount: number
    auction?: auction
    stats: stats
    genes: string
    parts: AxieParts[]
}

export interface stats{
    hp: number
    speed: number
    skill: number
    morale: number
}

export interface GraphqlBody{
    operationName: string,
    variables: {
        from: number,
        size: number,
        sort: string,
        auctionType: string,
        owner?: string,
    },
    query: string
}

export interface RandomMessaje{
    data: {
        createRandomMessage: string
    }
}

export interface AccessToken{
    data: {
        createAccessTokenWithSignature:{
            accessToken: string,
            newAccount: boolean,
            result: boolean,
            __typename: string
        }
    }
}

export interface ResAccesToken{
    blockchain_related: {
        signature:{
            amount: number,
            signature: string,
            timestamp: number
        }
    }
}