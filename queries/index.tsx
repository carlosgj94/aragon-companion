import { gql } from 'graphql-request';

export const Erc20VotingPluginQuery = gql`
  query plugin($dao: String!) {
    erc20VotingPlugins(where: { daos_: {dao: $dao}}) {
      id
      minDuration
      totalSupportThresholdPct
      relativeSupportThresholdPct
    }
  }
`

export const Erc20Query = gql`
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

export const MultisigPluginQuery = gql`
  query plugin($dao: String!) {
    addresslistPlugins(where: { daos_: {dao: $dao}}) {
      id
      minDuration
      totalSupportThresholdPct
      relativeSupportThresholdPct
    }
  }
`

export const MultisigQuery = gql`
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

export const HomeDAOs = gql`
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
      plugins {
        plugin {
          ... on ERC20VotingPlugin {
            members {
              address
            }
          }
          ... on AddresslistPlugin {
            id
            members {
              address
            }
          }
        }
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
      plugins {
        plugin {
          ... on ERC20VotingPlugin {
            members {
              address
            }
          }
          ... on AddresslistPlugin {
            id
            members {
              address
            }
          }
        }
      }
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
      plugins {
        plugin {
          ... on ERC20VotingPlugin {
            members {
              address
            }
          }
          ... on AddresslistPlugin {
            id
            members {
              address
            }
          }
        }
      }

      proposals(first: $limit) {
        id
      }
     }
    }
`

export const ProfileERC20VoteQuery = gql`
  query proposals ($limit: Int!, $voter: String!) {
    erc20Votes(first: $limit, where: {voter_contains_nocase: $voter}) {
      id
      vote
      proposal {
        id
        metadata
        creator
        executed
        open
        createdAt
        startDate
        endDate
        yes
        no
        abstain
        voteCount
        census
        dao {
          id
          name
        }
        plugin {
          relativeSupportThresholdPct
          totalSupportThresholdPct
        }
      }
    }
  }
`