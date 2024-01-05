import { GithubUser } from './GithubUser.js'


// classe com a logica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        GithubUser.search('maykbrito')
            
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || []
        
        // this.entries = [
        //     {
        //         login: 'maykbrito',
        //         name: 'Mayk Brito',
        //         public_repos: '76',
        //         followers: '120000'
        //     }, 
        //     {
        //         login: 'diego3g',
        //         name: 'Diego Fernandes',
        //         public_repos: '189',
        //         followers: '199000'
        //     }
        // ]
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find
            (user => user.login == username)

            if(userExists){
                throw new Error('Usuário já cadastrado!')
            }
            
            const user = await GithubUser.search(username)
                        
            if( user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            // adiciona o retorno no array já criado mantendo a mutanção
            this.entries = [user, ...this.entries]

            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }

    }

    delete(user){
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    // metodo para adicionar um novo usuário do github
    onAdd() {
        //pegar o botão
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            // usando desestruturação para pegar o value que é a propriedade do input
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }
    
    // metodo para atualizar a lista    
    update() {
        this.removeAllTr()   

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)            
            
            
            console.log(row)
        } )
    }

    // metoto para remover todas as linhas da tabela
    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

    // metodo para criar as linhas da tabela
    createRow() {
        const tr = document.createElement('tr')
        
        const content = `
            <tr>
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
                <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
            </tr>
        `

        tr.innerHTML = content

        return tr
    }
}


