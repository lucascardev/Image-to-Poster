import React from 'react';

const BlogSection: React.FC = () => {
  return (
    <div className="mt-20 max-w-4xl mx-auto px-4 prose prose-indigo text-slate-700">
      <article className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Tudo o que você precisa saber sobre Posters Gigantes
        </h2>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            Como funciona a impressão Rasterbator no Print My Poster?
          </h3>
          <p className="mb-4 leading-relaxed">
            Se você sempre quis decorar seu quarto ou escritório de forma criativa mas não sabe como criar impressões imensas de parede, usar uma ferramenta no formato "Rasterbator" é a melhor saída. O <strong>Print My Poster</strong> atua exatamente assim: nós recebemos a sua foto ou imagem e a fatiamos automaticamente em várias páginas tamanho A4.
          </p>
          <p className="mb-4 leading-relaxed">
            Esse método permite que você utilize a impressora normal que você tem em casa. Em vez de encomendar um projeto caro em uma gráfica, nosso sistema processa o arquivo na hora, no seu próprio navegador, mantendo a resolução da sua imagem sem enviá-la para servidores externos. Você apenas faz o download do arquivo PDF, imprime e monta as folhas colando-as lado a lado. E claro, nosso uso é 100% gratuito.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            Dicas para uma Impressão Perfeita
          </h3>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li>
              <strong>Cuidado com a Resolução:</strong> Quanto mais páginas você escolher (ex: grade 4x4), maior sua imagem ficará e mais "esticada" ela será. Procure imagens com pelo menos 2000px de altura e largura, como wallpapers em Full HD ou 4K.
            </li>
            <li>
              <strong>Atenção às bordas:</strong> As impressoras domésticas possuem uma margem natural em branco por onde o papel rola. No nosso aplicativo, definimos um valor seguro (como 6mm) para essas bordas. Você deve utilizar tesoura ou estilete para remover essa borda antes de unir as páginas.
            </li>
            <li>
              <strong>Use o tipo de papel certo:</strong> Papéis Sulfite comuns de 75g servem bem, mas para posters mais duradouros, imprimir em papéis fotográficos ou couchê fina farão as cores brilharem muito mais.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            Onde colar e ideias de uso
          </h3>
          <p className="mb-4 leading-relaxed">
            Existem centenas de formas de reaproveitar posters fracionados. Alguns dos cenários mais práticos incluem:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">Decoração de Quartos</h4>
              <p className="text-sm text-slate-600">Imprima posters enormes das suas bandas favoritas, animes, jogos e filmes com custo zero e personalize o ambiente inteiro.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">Trabalhos Escolares</h4>
              <p className="text-sm text-slate-600">Precisa apresentar mapas cartográficos grandiosos ou murais de sala de aula? O Print My Poster resolve o problema rapidamente.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">Eventos Temporários</h4>
              <p className="text-sm text-slate-600">Festas de aniversário, chás de bebê, banners descartáveis... imprima na hora para quebrar o galho da festa e depois basta jogar no lixo reciclável.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">Gráficas Rápidas</h4>
              <p className="text-sm text-slate-600">Use a interface como edição se você possuir um negócio e quiser apenas um gerador de PDFs com linhas de corte fáceis para o seu cliente final.</p>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
};

export default BlogSection;
