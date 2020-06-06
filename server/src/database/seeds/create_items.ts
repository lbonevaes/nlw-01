import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        { title: 'Lâmpada', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papéis e Papelão', image: 'lampapapeis-papelao.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Resíduos Ogânicos', image: 'organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'oelo.svg' }
    ])
}