// classe que pega dados do github
export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
            .then(data => data.json())
            .then( // desestruturando o retorno do data em forma de objeto
                ({ login, name, public_repos, followers }) => ({
                    login,
                    name,
                    public_repos,
                    followers
                })
            )

            // .then(data => ({ // recuperando dados do data forma normal em forma de objeto
            //     login: data.login,
            //     name: user.name,
            //     public_repos: data.public_repos,
            //     followers: data.followers
            // }))
    }
}

