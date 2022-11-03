// variáveis globais de nome, id e imagem
const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_imagem');

// variável global criada para citar o forms e organizar os dados conforme a necessidade
const form = document.querySelector('.form');

//variáveis globais de navegação e pesquisa
const input = document.querySelector('.input_search');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

//variável criada para localização na pokedex
let searchPokemon = 1;
/*
quando se declara variável com let, ela não pode ser redeclarada (com var pode)

variáveis definidas com let devem ser declaradas antes do uso.

as variáveis definidas com let tem escopo do bloco
(significa que não podem ser acessadas fora do bloco na qual foram criadas)

isso permite fazer coisas como  usar a variável de formas diferentes fora e dentro do bloco.
*/

/*
 cons é outa forma de declarar variável, mas ela obriga a ter um valor inicial. 
 O comando "async" serve para fazer a função gerar uma promessa de resposta, fazendo ela não ser síncrona.
 */
const fetchPokemon = async (pokemon) => {
    /*
    o comando "await" faz com que essa função não execute sem ter a resposta que foi prometida. Só funciona em função assíncrona.*/
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    
    //espera status positivo de comunicação pra ter resposta
    if( APIResponse.status == 200){
        const data = await APIResponse.json();
        return data;
    }
    
}
const renderPokemon = async (pokemon) => {
    //criado só para exibir algo enquanto procura o pokemon
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
   
    //espera retornar alguma informação da database
    const data = await fetchPokemon(pokemon);
    //se retorna algum dado, entra no if senão retorna como não encontrado.
    if(data){
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        searchPokemon = data.id;
    } else{
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :C';
        pokemonNumber.innerHTML = '';
    }
    input.value = '';
}

form.addEventListener('submit', (event)=> {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
    //adicionado a função de por tudo em letra mínuscula aqui para só fazer esse tipo de tratamento no envio da barra de pesquisa e nada mais.
});

btnPrev.addEventListener('click', () => {
    //botão que aguarda o clique para funcionar
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

btnNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);