import { Link } from 'react-router-dom';
import FAQAccordion from '../components/FAQAccordion';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Section 1: Trust Badges */}
      <section className="bg-accent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">🏥</div>
              <p className="text-sm font-semibold text-gray-700">Suporte Médico Especializado</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm font-semibold text-gray-700">Entrega em todo o Brasil</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-semibold text-gray-700">Produtos Aprovados pela Anvisa</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-gray-700">Compra 100% Segura</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm font-semibold text-gray-700">Embalagem Discreta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Hero */}
      <section className="bg-gradient-to-br from-white via-accent to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text-dark mb-6">
            Focus.<br />
            Performance.<br />
            Recovery.
          </h1>
          <p className="text-2xl md:text-3xl text-primary mb-4 font-semibold">
            EverWell, every day.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Combinando ciência e inovação, criamos produtos à base de CBD que promovem bem-estar e alta performance, 
            apoiando sua jornada pessoal ou profissional com qualidade de vida e resultados concretos.
          </p>
          <a
            href="https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Comece agora
          </a>
        </div>
      </section>

      {/* Section 3: Quality Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl md:text-2xl text-gray-700 font-semibold">
            Produtos importados, testados e<br />
            <span className="text-primary">com qualidade reconhecida:</span>
          </p>
        </div>
      </section>

      {/* Section 4: Value Proposition */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                Imagine
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Criamos fórmulas que funcionam de verdade, com ingredientes naturais eficazes e propósito definido. 
                Elaborados por especialistas e analisados lote a lote para garantir excelência.
              </p>
              <Link to="/produtos" className="btn-primary inline-block">
                SAIBA MAIS
              </Link>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-4">
                Unlock the power of our products
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Purchase Process (3 Steps) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-text-dark mb-12">
            As etapas de compra
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-4">Compra Descomplicada</h3>
              <div className="space-y-3">
                <a
                  href="https://pro.quaddro.co/yourbestversion/servicos/vgwg3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline"
                >
                  Consulta Médica
                </a>
                <a
                  href="https://pro.quaddro.co/yourbestversion/servicos/xUJjRT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline"
                >
                  Autorização da Anvisa
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-4">Importação e Entrega</h3>
              <p className="text-gray-600">
                Processamento seguro e entrega em todo o Brasil
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-4">Pronto!</h3>
              <p className="text-gray-600">
                Receba seus produtos com qualidade garantida
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/agendar"
              className="btn-primary"
            >
              Inicie agora
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Objective Definition Form */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-text-dark mb-6">
            defina seus objetivos
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Compartilhe seus objetivos e histórico de saúde para que possamos criar a melhor estratégia 
            de bem-estar e performance para você.
          </p>
          <p className="text-xl font-semibold text-primary mb-8">
            Atinja sua melhor perfomance, seja pessoal ou profissional.<br />
            Avance para seu próximo nível e se surpreenda do que você é capaz
          </p>
          <iframe
            src="https://form.jotform.com/252618050339051"
            title="Formulário de Objetivos"
            className="w-full h-[600px] border-0 rounded-lg"
          />
        </div>
      </section>

      {/* Section 7: Products Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-text-dark mb-12">
            Produtos
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="card text-center">
              <div className="h-48 bg-accent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🍬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gummy</h3>
            </div>
            <div className="card text-center">
              <div className="h-48 bg-accent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Óleo</h3>
            </div>
            <div className="card text-center">
              <div className="h-48 bg-accent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🧴</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Creme</h3>
            </div>
          </div>
          <div className="text-center">
            <Link to="/produtos" className="btn-primary">
              Conheça os produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Section 8: Testimonials */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-text-dark mb-12">
            Clientes Satisfeitos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <p className="text-gray-700 mb-4 italic">
                "Tinha uma dor crônica nos braços que sumiram após algumas semanas. Muito Obrigado EverWell"
              </p>
              <p className="font-semibold text-primary">Joana Fontes</p>
            </div>
            <div className="card">
              <p className="text-gray-700 mb-4 italic">
                "As gomas me fizeram ter equílibrio mental e físico no meu dia-a-dia, agora consigo performar bem no meu trabalho"
              </p>
              <p className="font-semibold text-primary">Maria Silva</p>
            </div>
            <div className="card">
              <p className="text-gray-700 mb-4 italic">
                "Com a EverWell consigo me concentrar em meus estudos e dormir bem. Sou muito grato por conhecê-los"
              </p>
              <p className="font-semibold text-primary">Antônio Santos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Why EverWell */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-text-dark mb-12">
            Por que a EverWell ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Qualidade é Inegociável</h3>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-2">Transparência e Conformidade Legal</h3>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-2">Foco em Wellness</h3>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Acompanhamento de Ponta a Ponta</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sua Melhor Versão começa agora!
          </h2>
          <Link
            to="/agendar"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent transition-colors inline-block"
          >
            AGENDAR CONSULTA
          </Link>
        </div>
      </section>

      {/* Section 11: Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-dark mb-8">
            Clientes Satisfeitos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for customer logos/images */}
            <div className="h-24 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Logo</span>
            </div>
            <div className="h-24 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Logo</span>
            </div>
            <div className="h-24 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Logo</span>
            </div>
            <div className="h-24 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Logo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: FAQ */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-text-dark mb-12">
            Dúvidas Frequentes
          </h2>
          <FAQAccordion />
          <div className="text-center mt-8">
            <Link to="/duvidas" className="text-primary hover:underline font-semibold">
              Ver todas as dúvidas →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

