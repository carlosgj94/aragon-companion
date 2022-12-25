import { gql } from 'graphql-request';

export const erc20VotingPluginQuery = gql`
  query plugin($dao: String!) {
    erc20VotingPlugins(where: { daos_: {dao: $dao}}) {
      id
      minDuration
      totalSupportThresholdPct
      relativeSupportThresholdPct
    }
  }
`

export const erc20Query = gql`
  query proposals($limit:Int!, $dao:String!) {
    erc20VotingProposals(first: $limit, where: {dao: $dao}) {
      id
      creator
      metadata
      executed
      startDate
      endDate
      voteCount
      census
      yes
      no
      abstain
      open
    }
  }
`

export const multisigPluginQuery = gql`
  query plugin($dao: String!) {
    addresslistPlugins(where: { daos_: {dao: $dao}}) {
      id
      minDuration
      totalSupportThresholdPct
      relativeSupportThresholdPct
    }
  }
`

export const multisigQuery = gql`
  query proposals($limit:Int!, $dao:String!) {
    addresslistProposals(first: $limit, where: {dao: $dao}) {
      id
      creator
      metadata
      executed
      startDate
      endDate
      voteCount
      census
      yes
      no
      open
    }
  }
`

export const homeDAOs = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $daos: [String]!) {
    daos(first: $limit, skip: $skip, orderDirection: $direction, where: {id_in: $daos}){
      id
      name
      metadata
      token
      proposals(first: $limit) {
        id
        creator
        metadata
        executed
        createdAt
      }
     }
    }
`
export const SearchDiscoverQuery = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $search: String) {
    daos(first: $limit, skip: $skip, where: {name_contains_nocase: $search}){
      id
      name
      metadata
      proposals(first: $limit) {
        id
      }
     }
    }
`


export const DiscoverQuery = gql`
   query daos ($limit:Int!, $skip: Int!, $direction: OrderDirection!, $orderItem: Dao_orderBy) {
    daos(first: $limit, skip: $skip, orderDirection: $direction, orderBy: $orderItem){
      id
      name
      metadata
      proposals(first: $limit) {
        id
      }
     }
    }
`