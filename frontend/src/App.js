import React from "react"
import ReactDOM from "react-dom"
import './App.css';
import {QueryClient, QueryClientProvider, useQuery, useQueryClient} from 'react-query'
import {ReactQueryDevtools} from "react-query/devtools"
import {request, gql} from "graphql-request"

const endpoint = "http://codeswiftr.tplinkdns.com:8000/graphql/"
const queryClient = new QueryClient()

export default function App() {
    const [linkId, setLinkId] = React.useState(-1)

    return (
        <QueryClientProvider client={queryClient}>
            {linkId > -1 ? {linkId} : (
                <Links setLinkId={setLinkId}/>
            )}
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    )
}

function useLinks() {
    return useQuery("urls", async () => {
        const 
        {urls}
         = await request (
            endpoint,
            gql`
            query {
                urls {
                    id
                    fullUrl
                    urlHash
                    clicks
                    createdAt
                }
            }
            `
        );
        console.log(urls)
        return urls
    });
}

function Links({setLinkId}){
    const queryClient = useQueryClient();
    const {status, data, error, isFetching } = useLinks();

    return (
        <div>
            <h1>Links</h1>
            <div>
                {status === "loading" ? ("Loading ...") : status ==="error" ? (
                    <span> Error: {error.message}</span>
                )
                :(
                    <div>
                        {data.map((link) => (
                            <p key={link.id}>{link.urlHash} {link.fullUrl}
                            </p>
                            
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
function Example() {
    const {isLoading, error, data} = useQuery('repoData', () => 
        fetch('https://api.github.com/repos/codeswiftr/dotfiles').then(res => res.json()
    ))
        if (isLoading) return 'Loading ..'
        
        if (error) return 'An error has occurred: ' + error.message

        return (
            <div className=".App-header">
                <h1>{data.name}</h1>
                <pre> 

                    {JSON.stringify(data)}</pre> </div>)
}
