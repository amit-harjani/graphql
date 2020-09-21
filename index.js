const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type user {
      id: Int
    name: String
    username: String
    address : address
    post : [post]
    greeting:String
    
  }
  type address {
    city : String
  }
  type post {
      title : String
      body : String
  }
  
  

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users(id:String): [user]
    greeting(name:String) :String
    posts : [post]
  }
`;
const baseURL = `https://jsonplaceholder.typicode.com`

const resolvers = {
  Query: {
   
    users: async (soruce,{id}) => {
     let data={};
     let url = id?'/users/'+id:'/users';
     
     await fetch(`${baseURL}`+`${url}`).then(res => res.json()).then(json => data = Array.isArray(json)?json:[json])
     for(let i= 0 ;i<data.length;i++){
      data[i].post = await resolvers.Query.posts(data[i].id);
     }
     
     console.log(data);
     return data;
    },
    posts: (id=1) => {
    
        return fetch(`${baseURL}/posts?userId=`+`${id}`).then(res => res.json()).then(json => json)
      },
    greeting:(s,{name}) => {
      
        return "hello from  world !!!"+name
     },
   
  },
};


  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers , engine: {    
    graphVariant: "current"
  }});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});